import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatApi, getSocket } from "./api";
import { playNotifySound } from "./sound";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import type {
  ActiveRoom,
  Channel,
  ChatMessage,
  ChatUser,
  Dm,
  Notification,
  TypingEvent,
} from "./types";

function roomKey(type: string, id: string) {
  return `${type}:${id}`;
}

const FAVORITES_KEY = "atlasdesk_chat_favorites";

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export interface UseChatOptions {
  soundEnabled?: boolean;
  mutedRooms?: Set<string>;
}

export function useChat(options: UseChatOptions = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [dms, setDms] = useState<Dm[]>([]);
  const [users, setUsers] = useState<Record<string, ChatUser>>({});
  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingByRoom, setTypingByRoom] = useState<Record<string, TypingEvent[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [threadParent, setThreadParent] = useState<ChatMessage | null>(null);
  const [threadReplies, setThreadReplies] = useState<Record<string, ChatMessage[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [unreadByRoom, setUnreadByRoom] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

  const currentUserRef = useRef<ChatUser | null>(null);
  currentUserRef.current = currentUser;
  const activeRoomRef = useRef<ActiveRoom | null>(null);
  activeRoomRef.current = activeRoom;

  /** Id "canônico" de uma DM (mesmo algoritmo usado no servidor: par de ids
   * ordenado). Precisamos disso porque a UI referencia uma DM pelo id do
   * outro usuário, mas o servidor guarda/emite mensagens usando o id do par. */
  const dmRoomId = useCallback(
    (otherUserId: string) => {
      if (!currentUser) return otherUserId;
      return [currentUser.id, otherUserId].sort().join("__");
    },
    [currentUser],
  );

  const roomIdFor = useCallback(
    (room: ActiveRoom) => (room.type === "dm" ? dmRoomId(room.id) : room.id),
    [dmRoomId],
  );

  /* -------------------- login / cadastro / sessão -------------------- */

  const loadProfile = useCallback(async () => {
    try {
      const { user } = await chatApi.me();
      setCurrentUser(user);
      setServerError(null);
      return user;
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar seu perfil. Verifique se o servidor de chat está rodando.",
      );
      throw err;
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (!supabase) {
        setServerError(
          "Login ainda não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY — veja server/README.md.",
        );
        throw new Error("Supabase não configurado.");
      }
      setConnecting(true);
      setServerError(null);
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        // O gatilho do banco cria o perfil quase na hora; tenta algumas
        // vezes caso o cadastro exija confirmação de e-mail (nesse caso,
        // não haverá sessão ainda e isso vai lançar — tratado no chamador).
        await new Promise((r) => setTimeout(r, 500));
        return await loadProfile();
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [loadProfile],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        setServerError(
          "Login ainda não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY — veja server/README.md.",
        );
        throw new Error("Supabase não configurado.");
      }
      setConnecting(true);
      setServerError(null);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return await loadProfile();
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "E-mail ou senha incorretos, ou conta inexistente.",
        );
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [loadProfile],
  );

  // Restaura a sessão (se o navegador já tiver uma) e acompanha login/logout
  // feitos em qualquer lugar (ex: outra aba).
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) loadProfile().catch(() => {});
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setCurrentUser(null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  /* -------------------- socket lifecycle -------------------- */

  useEffect(() => {
    if (!currentUser) return;
    const socket = getSocket();

    async function identify() {
      const { data } = await supabase!.auth.getSession();
      const token = data.session?.access_token;
      if (token) socket.emit("identify", { token });
    }
    if (socket.connected) identify();
    socket.on("connect", identify);

    function onIdentifyError({ error }: { error: string }) {
      setServerError(error);
    }
    socket.on("identify:error", onIdentifyError);

    function onPresence({
      userId,
      online,
      lastSeen,
    }: {
      userId: string;
      online: boolean;
      lastSeen?: number;
    }) {
      setUsers((prev) => ({
        ...prev,
        [userId]: prev[userId]
          ? { ...prev[userId], online, lastSeen: lastSeen ?? prev[userId].lastSeen }
          : ({
              id: userId,
              name: "…",
              avatarColor: "#999",
              online,
              lastSeen: lastSeen ?? Date.now(),
            } as ChatUser),
      }));
    }

    function onNewMessage(message: ChatMessage) {
      if (message.parentId) {
        setThreadReplies((prev) => ({
          ...prev,
          [message.parentId!]: [...(prev[message.parentId!] ?? []), message],
        }));
        return;
      }
      const key = roomKey(message.roomType, message.roomId);
      setMessages((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), message] }));

      const active = activeRoomRef.current;
      const activeKey = active ? roomKey(active.type, roomIdFor(active)) : null;
      const isMine = message.authorId === currentUserRef.current?.id;
      if (!isMine && key !== activeKey) {
        setUnreadByRoom((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
        const { soundEnabled, mutedRooms } = optionsRef.current;
        if (soundEnabled && !mutedRooms?.has(key)) {
          playNotifySound();
        }
      }
    }

    function onTyping(evt: TypingEvent) {
      const key = roomKey(evt.roomType, evt.roomId);
      setTypingByRoom((prev) => {
        const list = (prev[key] ?? []).filter((t) => t.userId !== evt.userId);
        return { ...prev, [key]: evt.typing ? [...list, evt] : list };
      });
    }

    function onReadUpdate({ messageId, readBy }: { messageId: string; readBy: string[] }) {
      setMessages((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = next[key].map((m) => (m.id === messageId ? { ...m, readBy } : m));
        }
        return next;
      });
    }

    function onReactionUpdate({
      messageId,
      reactions,
    }: {
      messageId: string;
      reactions: Record<string, string[]>;
    }) {
      const patch = (list: ChatMessage[]) =>
        list.map((m) => (m.id === messageId ? { ...m, reactions } : m));
      setMessages((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) next[key] = patch(next[key]);
        return next;
      });
      setThreadReplies((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) next[key] = patch(next[key]);
        return next;
      });
    }

    function onThreadUpdate({
      parentId,
      replyCount,
      lastReplyAt,
    }: {
      parentId: string;
      replyCount: number;
      lastReplyAt: number;
    }) {
      setMessages((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = next[key].map((m) =>
            m.id === parentId ? { ...m, replyCount, lastReplyAt } : m,
          );
        }
        return next;
      });
    }

    function onNotification(n: Notification) {
      setNotifications((prev) => [n, ...prev].slice(0, 30));
    }

    function onChannelNew(channel: Channel) {
      setChannels((prev) => (prev.some((c) => c.id === channel.id) ? prev : [...prev, channel]));
    }

    function onChannelUpdated(channel: Channel) {
      setChannels((prev) => prev.map((c) => (c.id === channel.id ? channel : c)));
      setActiveRoom((prev) =>
        prev && prev.type === "channel" && prev.id === channel.id
          ? { ...prev, label: `# ${channel.name}` }
          : prev,
      );
    }

    socket.on("presence:update", onPresence);
    socket.on("message:new", onNewMessage);
    socket.on("typing:update", onTyping);
    socket.on("message:read:update", onReadUpdate);
    socket.on("message:reaction:update", onReactionUpdate);
    socket.on("thread:update", onThreadUpdate);
    socket.on("notification:new", onNotification);
    socket.on("channel:new", onChannelNew);
    socket.on("channel:updated", onChannelUpdated);

    return () => {
      socket.off("connect", identify);
      socket.off("identify:error", onIdentifyError);
      socket.off("presence:update", onPresence);
      socket.off("message:new", onNewMessage);
      socket.off("typing:update", onTyping);
      socket.off("message:read:update", onReadUpdate);
      socket.off("message:reaction:update", onReactionUpdate);
      socket.off("thread:update", onThreadUpdate);
      socket.off("notification:new", onNotification);
      socket.off("channel:new", onChannelNew);
      socket.off("channel:updated", onChannelUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  /* -------------------- initial data load -------------------- */

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const [ch, dmList, userList] = await Promise.all([
          chatApi.listChannels(),
          chatApi.listDms(),
          chatApi.listUsers(),
        ]);
        setChannels(ch);
        setDms(dmList);
        setUsers((prev) => {
          const map = { ...prev };
          for (const u of userList) map[u.id] = u;
          return map;
        });
        if (!activeRoom && ch.length) {
          setActiveRoom({ id: ch[0].id, type: "channel", label: `# ${ch[0].name}` });
        }
        setServerError(null);
      } catch {
        setServerError(
          "Não foi possível conectar ao servidor de chat. Confira se ele está rodando (server/README.md).",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  /* -------------------- room history -------------------- */

  const loadHistory = useCallback(
    async (room: ActiveRoom) => {
      const key = roomKey(room.type, roomIdFor(room));
      try {
        const history = await chatApi.history(roomIdFor(room), room.type);
        setMessages((prev) => ({ ...prev, [key]: history }));
      } catch {
        /* silencioso: usuário já vê o aviso de conexão no topo */
      }
    },
    [roomIdFor],
  );

  useEffect(() => {
    if (!activeRoom) return;
    const key = roomKey(activeRoom.type, roomIdFor(activeRoom));
    if (!messages[key]) loadHistory(activeRoom);
    setUnreadByRoom((prev) => (prev[key] ? { ...prev, [key]: 0 } : prev));
    const socket = getSocket();
    if (activeRoom.type === "channel") {
      socket.emit("channel:join", { channelId: activeRoom.id, userId: currentUser?.id });
    } else if (currentUser) {
      const otherId = activeRoom.id;
      socket.emit("dm:open", { userId: currentUser.id, otherUserId: otherId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom?.id, activeRoom?.type]);

  /* -------------------- actions -------------------- */

  const selectChannel = useCallback((channel: Channel) => {
    setThreadParent(null);
    setActiveRoom({ id: channel.id, type: "channel", label: `# ${channel.name}` });
  }, []);

  const selectDm = useCallback((otherUser: ChatUser) => {
    setThreadParent(null);
    setActiveRoom({ id: otherUser.id, type: "dm", label: otherUser.name });
  }, []);

  const createChannel = useCallback(
    async (name: string) => {
      if (!currentUser) return;
      const channel = await chatApi.createChannel(name);
      setChannels((prev) => [...prev, channel]);
      selectChannel(channel);
    },
    [currentUser, selectChannel],
  );

  const renameChannel = useCallback(async (id: string, name: string) => {
    const updated = await chatApi.renameChannel(id, name);
    setChannels((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setActiveRoom((prev) =>
      prev && prev.type === "channel" && prev.id === id
        ? { ...prev, label: `# ${updated.name}` }
        : prev,
    );
  }, []);

  const sendMessage = useCallback(
    (
      text: string,
      extra?: { fileUrl?: string; fileName?: string; fileType?: string; parentId?: string },
    ) => {
      if (!currentUser || !activeRoom) return;
      getSocket().emit("message:send", {
        roomId: roomIdFor(activeRoom),
        roomType: activeRoom.type,
        text,
        ...extra,
      });
    },
    [currentUser, activeRoom, roomIdFor],
  );

  const startTyping = useCallback(() => {
    if (!currentUser || !activeRoom) return;
    getSocket().emit("typing:start", {
      roomId: roomIdFor(activeRoom),
      roomType: activeRoom.type,
      userId: currentUser.id,
      name: currentUser.name,
    });
  }, [currentUser, activeRoom, roomIdFor]);

  const stopTyping = useCallback(() => {
    if (!currentUser || !activeRoom) return;
    getSocket().emit("typing:stop", {
      roomId: roomIdFor(activeRoom),
      roomType: activeRoom.type,
      userId: currentUser.id,
    });
  }, [currentUser, activeRoom, roomIdFor]);

  const markRead = useCallback(
    (message: ChatMessage) => {
      if (!currentUser || message.readBy.includes(currentUser.id)) return;
      getSocket().emit("message:read", {
        messageId: message.id,
        roomId: message.roomId,
        roomType: message.roomType,
        userId: currentUser.id,
      });
    },
    [currentUser],
  );

  const toggleReaction = useCallback(
    (message: ChatMessage, emoji: string) => {
      if (!currentUser) return;
      getSocket().emit("message:react", {
        messageId: message.id,
        emoji,
        userId: currentUser.id,
        roomId: message.roomId,
        roomType: message.roomType,
      });
    },
    [currentUser],
  );

  const openThread = useCallback(
    async (message: ChatMessage) => {
      setThreadParent(message);
      if (!threadReplies[message.id]) {
        const replies = await chatApi.thread(message.id);
        setThreadReplies((prev) => ({ ...prev, [message.id]: replies }));
      }
    },
    [threadReplies],
  );

  const closeThread = useCallback(() => setThreadParent(null), []);

  const sendThreadReply = useCallback(
    (text: string) => {
      if (!currentUser || !threadParent) return;
      getSocket().emit("message:send", {
        roomId: threadParent.roomId,
        roomType: threadParent.roomType,
        text,
        parentId: threadParent.id,
      });
    },
    [currentUser, threadParent],
  );

  const uploadFile = useCallback(async (file: File) => chatApi.upload(file), []);

  const search = useCallback(
    async (query: string) => {
      if (!currentUser) return [] as ChatMessage[];
      return chatApi.search(query);
    },
    [currentUser],
  );

  const dismissNotification = useCallback((index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const currentRoomMessages = useMemo(() => {
    if (!activeRoom) return [];
    return messages[roomKey(activeRoom.type, roomIdFor(activeRoom))] ?? [];
  }, [messages, activeRoom, roomIdFor]);

  const currentRoomTyping = useMemo(() => {
    if (!activeRoom || !currentUser) return [];
    return (typingByRoom[roomKey(activeRoom.type, roomIdFor(activeRoom))] ?? []).filter(
      (t) => t.userId !== currentUser.id,
    );
  }, [typingByRoom, activeRoom, currentUser, roomIdFor]);

  const logout = useCallback(() => {
    supabase?.auth.signOut().catch(() => {});
    getSocket().disconnect();
    setCurrentUser(null);
    setActiveRoom(null);
    setMessages({});
    setChannels([]);
    setDms([]);
  }, []);

  return {
    currentUser,
    connecting,
    serverError,
    isAuthConfigured: isSupabaseConfigured,
    signUp,
    signIn,
    logout,
    channels,
    dms,
    users,
    activeRoom,
    selectChannel,
    selectDm,
    createChannel,
    renameChannel,
    messages: currentRoomMessages,
    sendMessage,
    startTyping,
    stopTyping,
    typing: currentRoomTyping,
    markRead,
    toggleReaction,
    threadParent,
    threadReplies: threadParent ? (threadReplies[threadParent.id] ?? []) : [],
    openThread,
    closeThread,
    sendThreadReply,
    uploadFile,
    search,
    notifications,
    dismissNotification,
    unreadByRoom,
    roomIdFor,
    favorites,
    toggleFavorite,
    allMessages: messages,
  };
}
