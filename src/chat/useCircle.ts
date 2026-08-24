import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "./api";

/**
 * Chamada de áudio/vídeo real (WebRTC) para os Círculos.
 * -------------------------------------------------------
 * Topologia "mesh": cada participante abre uma conexão direta
 * (RTCPeerConnection) com cada outro participante. Funciona bem para
 * grupos pequenos (o cenário normal de uma escola: uma turma, um setor).
 * Não escala indefinidamente — acima de ~6-8 pessoas simultâneas o
 * consumo de CPU/banda de cada participante cresce bastante, porque cada
 * um envia sua câmera/áudio direto para todo mundo.
 *
 * O servidor (server/index.mjs) só relata "quem está no Círculo" e repassa
 * mensagens de sinalização (ofertas/respostas SDP e candidatos ICE) — ele
 * nunca vê ou processa o áudio/vídeo em si, que viaja direto entre os
 * navegadores.
 *
 * Servidores ICE: por padrão usamos apenas STUN público (gratuito, mantido
 * pelo Google). Isso resolve a maioria das redes domésticas, mas redes de
 * escola com firewall/NAT mais restritivo podem precisar de um servidor
 * TURN (que retransmite a mídia) — configurável via VITE_TURN_URL /
 * VITE_TURN_USERNAME / VITE_TURN_CREDENTIAL no .env. Veja server/README.md.
 */

interface RemotePeer {
  socketId: string;
  userId: string;
  name: string;
  stream: MediaStream | null;
}

function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ];
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  const turnUrl = env?.VITE_TURN_URL;
  if (turnUrl) {
    servers.push({
      urls: turnUrl,
      username: env?.VITE_TURN_USERNAME,
      credential: env?.VITE_TURN_CREDENTIAL,
    });
  }
  return servers;
}

export function useCircle(currentUser: { id: string; name: string } | null) {
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
  const [error, setError] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  const roomRef = useRef<{ roomId: string; roomType: string } | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const cleanupPeer = useCallback((socketId: string) => {
    pcsRef.current[socketId]?.close();
    delete pcsRef.current[socketId];
    setPeers((prev) => {
      const next = { ...prev };
      delete next[socketId];
      return next;
    });
  }, []);

  const createPeerConnection = useCallback(
    (socketId: string, info: { userId: string; name: string }) => {
      const socket = getSocket();
      const pc = new RTCPeerConnection({ iceServers: getIceServers() });
      pcsRef.current[socketId] = pc;

      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getTracks()) {
          pc.addTrack(track, localStreamRef.current);
        }
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("circle:signal", {
            to: socketId,
            signal: { type: "candidate", candidate: event.candidate.toJSON() },
          });
        }
      };

      pc.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [socketId]: {
            socketId,
            userId: info.userId,
            name: info.name,
            stream: event.streams[0] ?? null,
          },
        }));
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          cleanupPeer(socketId);
        }
      };

      setPeers((prev) => ({
        ...prev,
        [socketId]: prev[socketId] ?? {
          socketId,
          userId: info.userId,
          name: info.name,
          stream: null,
        },
      }));

      return pc;
    },
    [cleanupPeer],
  );

  const join = useCallback(
    async (roomId: string, roomType: "channel" | "dm") => {
      if (!currentUser) return;
      setError(null);
      setConnecting(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch {
        setError(
          "Não foi possível acessar o microfone. Verifique as permissões do navegador e tente de novo.",
        );
        setConnecting(false);
        return;
      }

      roomRef.current = { roomId, roomType };
      const socket = getSocket();
      socket.emit("circle:join", {
        roomId,
        roomType,
        userId: currentUser.id,
        name: currentUser.name,
      });
      setJoined(true);
      setConnecting(false);
    },
    [currentUser],
  );

  const leave = useCallback(() => {
    const socket = getSocket();
    if (roomRef.current) {
      socket.emit("circle:leave", roomRef.current);
      roomRef.current = null;
    }
    for (const socketId of Object.keys(pcsRef.current)) cleanupPeer(socketId);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setJoined(false);
    setPeers({});
  }, [cleanupPeer]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  }, [muted]);

  const toggleCamera = useCallback(async () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    if (cameraOn) {
      for (const track of stream.getVideoTracks()) {
        track.stop();
        stream.removeTrack(track);
        for (const pc of Object.values(pcsRef.current)) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) pc.removeTrack(sender);
        }
      }
      setCameraOn(false);
      setLocalStream(new MediaStream(stream.getTracks()));
      return;
    }
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const [track] = camStream.getVideoTracks();
      stream.addTrack(track);
      for (const pc of Object.values(pcsRef.current)) {
        pc.addTrack(track, stream);
      }
      setCameraOn(true);
      setLocalStream(new MediaStream(stream.getTracks()));
    } catch {
      setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  }, [cameraOn]);

  // Eventos de sinalização (entram uma vez, ficam vivos enquanto o componente existir)
  useEffect(() => {
    const socket = getSocket();

    async function onExistingPeers({
      peers: existing,
    }: {
      peers: { socketId: string; userId: string; name: string }[];
    }) {
      for (const p of existing) {
        const pc = createPeerConnection(p.socketId, p);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("circle:signal", {
            to: p.socketId,
            signal: { type: "offer", sdp: offer.sdp },
          });
        } catch {
          cleanupPeer(p.socketId);
        }
      }
    }

    function onPeerJoined(info: { socketId: string; userId: string; name: string }) {
      // Quem já estava na sala só espera a oferta de quem entrou —
      // evita duas ofertas cruzadas (glare).
      setPeers((prev) => ({
        ...prev,
        [info.socketId]: prev[info.socketId] ?? {
          socketId: info.socketId,
          userId: info.userId,
          name: info.name,
          stream: null,
        },
      }));
    }

    async function onSignal({
      from,
      signal,
    }: {
      from: string;
      signal:
        | { type: "offer"; sdp: string }
        | { type: "answer"; sdp: string }
        | { type: "candidate"; candidate: RTCIceCandidateInit };
    }) {
      let pc = pcsRef.current[from];
      if (signal.type === "offer") {
        if (!pc) {
          const knownName = peers[from]?.name ?? "Alguém";
          const knownUserId = peers[from]?.userId ?? from;
          pc = createPeerConnection(from, { userId: knownUserId, name: knownName });
        }
        try {
          await pc.setRemoteDescription({ type: "offer", sdp: signal.sdp });
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("circle:signal", {
            to: from,
            signal: { type: "answer", sdp: answer.sdp },
          });
        } catch {
          cleanupPeer(from);
        }
      } else if (signal.type === "answer" && pc) {
        try {
          await pc.setRemoteDescription({ type: "answer", sdp: signal.sdp });
        } catch {
          cleanupPeer(from);
        }
      } else if (signal.type === "candidate" && pc) {
        try {
          await pc.addIceCandidate(signal.candidate);
        } catch {
          /* candidatos atrasados podem falhar silenciosamente sem problema */
        }
      }
    }

    function onPeerLeft({ socketId }: { socketId: string }) {
      cleanupPeer(socketId);
    }

    socket.on("circle:existing-peers", onExistingPeers);
    socket.on("circle:peer-joined", onPeerJoined);
    socket.on("circle:signal", onSignal);
    socket.on("circle:peer-left", onPeerLeft);

    return () => {
      socket.off("circle:existing-peers", onExistingPeers);
      socket.off("circle:peer-joined", onPeerJoined);
      socket.off("circle:signal", onSignal);
      socket.off("circle:peer-left", onPeerLeft);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, cleanupPeer]);

  // Sai do Círculo automaticamente se o componente desmontar (ex: logout)
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        getSocket().emit("circle:leave", roomRef.current);
      }
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    joined,
    connecting,
    muted,
    cameraOn,
    peers: Object.values(peers),
    localStream,
    error,
    join,
    leave,
    toggleMute,
    toggleCamera,
  };
}
