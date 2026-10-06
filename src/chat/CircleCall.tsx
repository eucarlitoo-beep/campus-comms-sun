import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertTriangle, Loader2 } from "lucide-react";
import { initials } from "@/lib/chat-ui";

function VideoTile({
  stream,
  name,
  muted,
  isLocal,
  cameraOn,
}: {
  stream: MediaStream | null;
  name: string;
  muted?: boolean;
  isLocal?: boolean;
  cameraOn: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted">
      {stream && cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
          {initials(name)}
        </span>
      )}
      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {muted && <MicOff className="h-3 w-3" />}
        {name}
        {isLocal ? " (você)" : ""}
      </div>
    </div>
  );
}

export function CircleCall({
  roomLabel,
  connecting,
  muted,
  cameraOn,
  localStream,
  peers,
  error,
  currentUserName,
  onToggleMute,
  onToggleCamera,
  onLeave,
}: {
  roomLabel: string;
  connecting: boolean;
  muted: boolean;
  cameraOn: boolean;
  localStream: MediaStream | null;
  peers: { socketId: string; name: string; stream: MediaStream | null }[];
  error: string | null;
  currentUserName: string;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold">Círculo em {roomLabel}</p>
        {connecting && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Conectando…
          </span>
        )}
      </div>

      {error && (
        <div className="mb-2 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <VideoTile stream={localStream} name={currentUserName} isLocal cameraOn={cameraOn} />
        {peers.map((p) => (
          <VideoTile key={p.socketId} stream={p.stream} name={p.name} cameraOn={!!p.stream} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={onToggleMute}
          className={`grid h-9 w-9 place-items-center rounded-full border ${
            muted
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border hover:bg-muted"
          }`}
          title={muted ? "Ativar microfone" : "Silenciar"}
        >
          {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <button
          onClick={onToggleCamera}
          className={`grid h-9 w-9 place-items-center rounded-full border ${
            cameraOn ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
          }`}
          title={cameraOn ? "Desligar câmera" : "Ligar câmera"}
        >
          {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </button>
        <button
          onClick={onLeave}
          className="flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground"
        >
          <PhoneOff className="h-3.5 w-3.5" /> Sair
        </button>
      </div>
    </div>
  );
}
