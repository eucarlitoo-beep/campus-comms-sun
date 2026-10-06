import { io, type Socket } from "socket.io-client";
import type { Channel, ChatMessage, ChatUser, Dm } from "./types";
import { supabase } from "./supabaseClient";

/**
 * Endereço do servidor de chat (server/index.mjs). Em produção, defina
 * VITE_CHAT_SERVER_URL nas variáveis de ambiente do site apontando para
 * onde o servidor Node estiver hospedado (ver server/README.md).
 */
export const CHAT_SERVER_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CHAT_SERVER_URL ||
  "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(CHAT_SERVER_URL, { autoConnect: true, transports: ["websocket", "polling"] });
  }
  return socket;
}

/** Token de acesso da sessão atual do Supabase (renovado automaticamente
 * pelo próprio SDK enquanto a sessão estiver ativa). */
export async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${CHAT_SERVER_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status} em ${path}`);
  }
  return res.json();
}

export const chatApi = {
  me: () => request<{ user: ChatUser }>("/api/me"),
  listUsers: () => request<ChatUser[]>("/api/users"),
  listChannels: () => request<Channel[]>("/api/channels"),
  createChannel: (name: string, isPrivate = false) =>
    request<Channel>("/api/channels", {
      method: "POST",
      body: JSON.stringify({ name, isPrivate }),
    }),
  renameChannel: (id: string, name: string) =>
    request<Channel>(`/api/channels/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  listDms: () => request<Dm[]>("/api/dms"),
  openDm: (otherUserId: string) =>
    request<Dm>("/api/dms", { method: "POST", body: JSON.stringify({ otherUserId }) }),
  history: (roomId: string, roomType: "channel" | "dm", before?: number) =>
    request<ChatMessage[]>(
      `/api/messages?roomId=${encodeURIComponent(roomId)}&roomType=${roomType}${
        before ? `&before=${before}` : ""
      }`,
    ),
  thread: (parentId: string) => request<ChatMessage[]>(`/api/threads/${parentId}`),
  search: (query: string) =>
    request<ChatMessage[]>(`/api/search?query=${encodeURIComponent(query)}`),
  upload: async (file: File) => {
    const token = await getAccessToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${CHAT_SERVER_URL}/api/upload`, {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Falha ao enviar arquivo.");
    return res.json() as Promise<{ url: string; name: string; size: number; type: string }>;
  },
  fileUrl: (path: string) => `${CHAT_SERVER_URL}${path}`,
};
