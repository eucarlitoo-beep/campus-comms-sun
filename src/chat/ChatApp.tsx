import { useEffect, useRef, useState } from "react";
import {
  Hash,
  Plus,
  Search,
  LogOut,
  AlertTriangle,
  X,
  Home,
  MessagesSquare,
  Bell,
  Files,
  MoreHorizontal,
  Star,
  Paperclip,
  Settings,
  HelpCircle,
  Keyboard,
  Moon,
  Sun,
  UserPlus,
  MessageSquarePlus,
  Bot,
  Headphones,
  ChevronDown,
  Video,
  Mic,
  LayoutPanelLeft,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BellOff,
  Pencil,
  Contact,
} from "lucide-react";
import { MessageComposer, initials } from "@/lib/chat-ui";
import { useChat } from "./useChat";
import { useDarkMode } from "./useDarkMode";
import { useCircle } from "./useCircle";
import { CircleCall } from "./CircleCall";
import { PresenceDot, TypingIndicator } from "./Presence";
import { MessageItem } from "./MessageItem";
import { ThreadPanel } from "./ThreadPanel";
import { SearchModal } from "./SearchModal";
import { NotificationBell } from "./NotificationBell";
import { FileUploadButton } from "./FileUploadButton";
import { chatApi } from "./api";
import type { ChatMessage, ChatUser } from "./types";

const SOUND_PREF_KEY = "atlasdesk_chat_sound";

/* ---------------- Item de sala na barra lateral ---------------- */

function SidebarRoomButton({
  icon,
  label,
  active,
  unread,
  presence,
  isFavorite,
  onClick,
  onToggleFavorite,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  unread?: number;
  presence?: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 ${
        active ? "bg-accent text-accent-foreground font-bold" : "hover:bg-primary-foreground/10"
      }`}
    >
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        {icon}
        <span className={`truncate ${unread ? "font-bold" : ""}`}>{label}</span>
        {presence !== undefined && <PresenceDot online={presence} />}
      </button>
      {!!unread && (
        <span className="grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
      <button
        onClick={onToggleFavorite}
        className={`shrink-0 opacity-0 group-hover:opacity-100 ${isFavorite ? "opacity-100" : ""}`}
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-current text-amber-300" : ""}`} />
      </button>
    </div>
  );
}

/* ---------------- Login gate ---------------- */

function LoginGate({
  onSignIn,
  onSignUp,
  connecting,
  error,
  authConfigured,
}: {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, name: string) => void;
  connecting: boolean;
  error: string | null;
  authConfigured: boolean;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!authConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
          <img src="/brand/atlasdesk-icon.png" alt="AtlasDesk" className="mx-auto h-12 w-12" />
          <h1 className="mt-4 font-display text-xl font-bold">Login ainda não configurado</h1>
          <p className="mt-3 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-left text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo{" "}
            <code>.env</code> da raiz do projeto — veja <code>server/README.md</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
        <img src="/brand/atlasdesk-icon.png" alt="AtlasDesk" className="mx-auto h-12 w-12" />
        <h1 className="mt-4 font-display text-xl font-bold">
          {mode === "signin" ? "Entrar no AtlasDesk" : "Criar sua conta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Entre com o e-mail e a senha da sua conta."
            : "Leva menos de um minuto."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !password.trim()) return;
            if (mode === "signin") onSignIn(email.trim(), password);
            else if (name.trim()) onSignUp(email.trim(), password, name.trim());
          }}
          className="mt-6 space-y-3 text-left"
        >
          {mode === "signup" && (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            type="email"
            autoFocus={mode === "signin"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@escola.edu.br"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            minLength={6}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            disabled={
              connecting || !email.trim() || !password.trim() || (mode === "signup" && !name.trim())
            }
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {connecting ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          {mode === "signin" ? "Ainda não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-left text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Icon rail ---------------- */

function RailButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex w-full flex-col items-center gap-1 py-2 text-primary-foreground/70 hover:text-primary-foreground"
    >
      <span
        className={`relative grid h-9 w-9 place-items-center rounded-lg ${
          active ? "bg-primary-foreground/20 text-primary-foreground" : ""
        }`}
      >
        {icon}
        {!!badge && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}

/* ---------------- Painel de atividade ---------------- */

function ActivityPanel({
  notifications,
  users,
}: {
  notifications: { type: string; message: ChatMessage }[];
  users: Record<string, ChatUser>;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <h3 className="mb-3 font-display text-base font-bold">Atividade</h3>
      {notifications.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma atividade recente. Menções e respostas aparecem aqui.
        </p>
      )}
      <div className="space-y-1">
        {notifications.map((n, i) => {
          const author = users[n.message.authorId];
          return (
            <div
              key={`${n.message.id}-${i}`}
              className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/40"
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: author?.avatarColor ?? "#999" }}
              >
                {initials(author?.name ?? "?")}
              </div>
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-bold">{author?.name ?? "Alguém"}</span> mencionou você
                </p>
                <p className="truncate text-sm text-muted-foreground">{n.message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Painel de arquivos ---------------- */

function FilesPanel({
  messages,
  users,
}: {
  messages: ChatMessage[];
  users: Record<string, ChatUser>;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <h3 className="mb-3 font-display text-base font-bold">Arquivos</h3>
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum arquivo compartilhado ainda. Anexos e GIFs enviados nas conversas aparecem aqui.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {messages.map((m) => {
          const author = users[m.authorId];
          const url = m.fileUrl!.startsWith("http") ? m.fileUrl! : chatApi.fileUrl(m.fileUrl!);
          const isImage = m.fileType?.startsWith("image/");
          return (
            <a
              key={m.id}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-lg border border-border bg-card shadow-card-soft hover:opacity-90"
            >
              {isImage ? (
                <img src={url} alt={m.fileName ?? ""} className="h-28 w-full object-cover" />
              ) : (
                <div className="grid h-28 w-full place-items-center bg-muted/50">
                  <Paperclip className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-2">
                <p className="truncate text-xs font-semibold">{m.fileName ?? "Arquivo"}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {author?.name ?? "Alguém"}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Menu "Mais" ---------------- */

function MoreMenu({
  onPreferences,
  onShortcuts,
  onHelp,
  onClose,
}: {
  onPreferences: () => void;
  onShortcuts: () => void;
  onHelp: () => void;
  onClose: () => void;
}) {
  const items = [
    { icon: <Settings className="h-4 w-4" />, label: "Preferências", onClick: onPreferences },
    { icon: <Keyboard className="h-4 w-4" />, label: "Atalhos de teclado", onClick: onShortcuts },
    { icon: <HelpCircle className="h-4 w-4" />, label: "Ajuda", onClick: onHelp },
  ];
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bottom-16 left-16 w-56 rounded-lg border border-border bg-card p-1.5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => {
              it.onClick();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Menu "Criar novo" (+) ---------------- */

function CreateMenu({
  onNewChannel,
  onNewMessage,
  onClose,
}: {
  onNewChannel: () => void;
  onNewMessage: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bottom-16 left-16 w-56 rounded-lg border border-border bg-card p-1.5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onNewChannel();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <Hash className="h-4 w-4" /> Novo canal
        </button>
        <button
          onClick={() => {
            onNewMessage();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <MessageSquarePlus className="h-4 w-4" /> Nova mensagem direta
        </button>
      </div>
    </div>
  );
}

/* ---------------- Convidar pessoas ---------------- */

function InvitePeopleModal({
  workspaceName,
  onClose,
}: {
  workspaceName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined" ? `${window.location.origin}/app` : "https://atlasdesk.app/app";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Convidar colegas de equipe</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Compartilhe este link com a equipe de {workspaceName}. Quem abrir entra direto no chat —
          ainda não há aprovação ou papéis de administrador nesta versão.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
          <span className="flex-1 truncate">{link}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Administrador ---------------- */

function SettingsModal({
  soundOn,
  onToggleSound,
  dark,
  onToggleDark,
  onClose,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  dark: boolean;
  onToggleDark: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Preferências</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-1">
          <button
            onClick={onToggleDark}
            className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2.5">
              {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Tema {dark ? "escuro" : "claro"}
            </span>
            <span
              className={`h-5 w-9 rounded-full p-0.5 transition ${dark ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-card transition ${dark ? "translate-x-4" : ""}`}
              />
            </span>
          </button>
          <button
            onClick={onToggleSound}
            className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2.5">
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Som de notificações
            </span>
            <span
              className={`h-5 w-9 rounded-full p-0.5 transition ${soundOn ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-card transition ${soundOn ? "translate-x-4" : ""}`}
              />
            </span>
          </button>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Um painel de administração completo (papéis, permissões, cobrança) ainda não existe nesta
          versão do AtlasDesk.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Barra de Círculo (chamada de áudio) ---------------- */

/* ---------------- Menu de opções do canal ("...") ---------------- */

function ChannelOptionsMenu({
  isFavorite,
  onToggleFavorite,
  onDetails,
  isMuted,
  onToggleMute,
  onRename,
  onClose,
}: {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDetails: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRename: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute right-6 top-14 w-64 rounded-lg border border-border bg-card p-1.5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onToggleFavorite();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current text-amber-400" : ""}`} />
          {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        </button>
        <button
          onClick={() => {
            onDetails();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <LayoutPanelLeft className="h-4 w-4" /> Ver detalhes do canal
        </button>
        <button
          onClick={() => {
            onRename();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          <Pencil className="h-4 w-4" /> Renomear canal
        </button>
        <button
          onClick={() => {
            onToggleMute();
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
        >
          {isMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {isMuted ? "Reativar notificações" : "Silenciar canal"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Renomear canal ---------------- */

function RenameChannelModal({
  currentName,
  onRename,
  onClose,
}: {
  currentName: string;
  onRename: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(currentName);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Renomear canal</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && name.trim() !== currentName) onRename(name.trim());
            onClose();
          }}
          className="mt-4 space-y-3"
        >
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Detalhes do canal ---------------- */

function ChannelDetailsModal({
  channel,
  memberCount,
  onClose,
}: {
  channel: { id: string; name: string; createdAt: number; isPrivate: boolean };
  memberCount: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 font-display text-sm font-bold">
            <Hash className="h-4 w-4 text-muted-foreground" /> {channel.name}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Criado em</dt>
            <dd className="font-semibold">
              {new Date(channel.createdAt).toLocaleDateString("pt-BR")}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Membros</dt>
            <dd className="font-semibold">{memberCount}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Visibilidade</dt>
            <dd className="font-semibold">{channel.isPrivate ? "Privado" : "Público"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ---------------- Atalhos de teclado ---------------- */

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { keys: "Ctrl/Cmd + K", desc: "Abrir a busca" },
    { keys: "Esc", desc: "Fechar painel ou modal aberto" },
    { keys: "Enter", desc: "Enviar mensagem" },
    { keys: "Shift + Enter", desc: "Quebrar linha na mensagem" },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Atalhos de teclado</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-xs font-semibold">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Ajuda ---------------- */

function HelpModal({ onClose }: { onClose: () => void }) {
  const tips = [
    "Clique em # Canais para conversar por assunto, turma ou setor.",
    "Use @ seguido do nome de alguém para mencionar essa pessoa.",
    "O botão de fone no topo do canal inicia um Círculo (chamada de áudio/vídeo).",
    "Arraste um arquivo pro campo de mensagem, ou use o clipe, pra anexar.",
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Ajuda rápida</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
          {tips.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Diretórios (lista de pessoas) ---------------- */

function DirectoryView({
  users,
  onOpenDm,
}: {
  users: ChatUser[];
  onOpenDm: (u: ChatUser) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <h3 className="mb-3 font-display text-base font-bold">Diretórios</h3>
      <div className="mb-4 flex items-center gap-2 rounded-md border border-border px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pessoas…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {users.length === 0
            ? "Ainda não há outras pessoas conhecidas neste chat."
            : "Nenhuma pessoa encontrada."}
        </p>
      ) : (
        <div className="space-y-1">
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => onOpenDm(u)}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: u.avatarColor }}
              >
                {initials(u.name)}
              </span>
              <div>
                <p className="text-sm font-semibold">{u.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PresenceDot online={u.online} /> {u.online ? "online" : "offline"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- New channel modal ---------------- */

function NewChannelModal({
  onCreate,
  onClose,
}: {
  onCreate: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Criar canal</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onCreate(name.trim());
              onClose();
            }
          }}
          className="mt-4 space-y-3"
        >
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="nome-do-canal"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
            Criar canal
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Main chat app ---------------- */

const MUTED_ROOMS_KEY = "atlasdesk_muted_rooms";

export function ChatApp() {
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem(SOUND_PREF_KEY) !== "off";
    } catch {
      return true;
    }
  });
  const [mutedRooms, setMutedRooms] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(MUTED_ROOMS_KEY);
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      return new Set();
    }
  });
  const chat = useChat({ soundEnabled: soundOn, mutedRooms });
  const { dark, toggle: toggleDark } = useDarkMode();
  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [channelOptionsOpen, setChannelOptionsOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [channelDetailsOpen, setChannelDetailsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const circle = useCircle(chat.currentUser);
  const [view, setView] = useState<"room" | "activity" | "files" | "directory">("room");
  const [sidebarFilter, setSidebarFilter] = useState<"all" | "dms">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggleSound() {
    setSoundOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_PREF_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleMuteRoom(key: string) {
    setMutedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(MUTED_ROOMS_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length]);

  useEffect(() => {
    if (circle.joined) circle.leave();
    setChannelOptionsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.activeRoom?.id, chat.activeRoom?.type]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!chat.currentUser) {
    return (
      <LoginGate
        onSignIn={chat.signIn}
        onSignUp={chat.signUp}
        connecting={chat.connecting}
        error={chat.serverError}
        authConfigured={chat.isAuthConfigured}
      />
    );
  }

  const user = chat.currentUser;
  const knownUserList = Object.values(chat.users).filter((u) => u.id !== user.id);

  const channelKey = (id: string) => `channel:${id}`;
  const dmKey = (otherUserId: string) =>
    `dm:${chat.roomIdFor({ type: "dm", id: otherUserId, label: "" })}`;

  const favoriteChannels = chat.channels.filter((c) => chat.favorites.has(channelKey(c.id)));
  const favoriteUsers = knownUserList.filter((u) => chat.favorites.has(dmKey(u.id)));

  const visibleChannels = chat.channels
    .filter((c) => !chat.favorites.has(channelKey(c.id)))
    .filter((c) => !unreadOnly || (chat.unreadByRoom[channelKey(c.id)] ?? 0) > 0);
  const visibleUsers = knownUserList
    .filter((u) => !chat.favorites.has(dmKey(u.id)))
    .filter((u) => !unreadOnly || (chat.unreadByRoom[dmKey(u.id)] ?? 0) > 0);

  const totalUnread = Object.values(chat.unreadByRoom).reduce((a, b) => a + b, 0);

  const filesForPanel = Object.values(chat.allMessages)
    .flat()
    .filter((m) => m.fileUrl)
    .sort((a, b) => b.createdAt - a.createdAt);

  function goToChannel(c: (typeof chat.channels)[number]) {
    chat.selectChannel(c);
    setView("room");
  }

  function goToDm(u: ChatUser) {
    chat.selectDm(u);
    setView("room");
  }

  function handleComposerChange() {
    chat.startTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => chat.stopTyping(), 2500);
  }

  function handleSend(
    text: string,
    extra?: { fileUrl?: string; fileName?: string; fileType?: string },
  ) {
    chat.sendMessage(text, extra);
    chat.stopTyping();
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Barra de ícones */}
      <aside className="flex w-16 shrink-0 flex-col items-center bg-primary py-3 text-primary-foreground">
        <img src="/brand/atlasdesk-icon.png" alt="AtlasDesk" className="mb-3 h-8 w-8 rounded-md" />
        <RailButton
          icon={<Home className="h-[18px] w-[18px]" />}
          label="Início"
          active={view === "room" && sidebarFilter === "all"}
          onClick={() => {
            setView("room");
            setSidebarFilter("all");
          }}
        />
        <RailButton
          icon={<MessagesSquare className="h-[18px] w-[18px]" />}
          label="MDs"
          active={sidebarFilter === "dms"}
          onClick={() => {
            setView("room");
            setSidebarFilter("dms");
          }}
        />
        <RailButton
          icon={<Bell className="h-[18px] w-[18px]" />}
          label="Atividade"
          active={view === "activity"}
          badge={chat.notifications.length}
          onClick={() => setView("activity")}
        />
        <RailButton
          icon={<Files className="h-[18px] w-[18px]" />}
          label="Arquivos"
          active={view === "files"}
          onClick={() => setView("files")}
        />
        <div className="flex-1" />
        <div className="relative">
          <RailButton
            icon={<MoreHorizontal className="h-[18px] w-[18px]" />}
            label="Mais"
            active={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
          />
          {moreOpen && (
            <MoreMenu
              onPreferences={() => setSettingsOpen(true)}
              onShortcuts={() => setShortcutsOpen(true)}
              onHelp={() => setHelpOpen(true)}
              onClose={() => setMoreOpen(false)}
            />
          )}
        </div>
        <RailButton
          icon={<UserPlus className="h-[18px] w-[18px]" />}
          label="Convidar"
          onClick={() => setInviteOpen(true)}
        />
        <div className="relative">
          <RailButton
            icon={<Plus className="h-[18px] w-[18px]" />}
            label="Criar"
            active={createOpen}
            onClick={() => setCreateOpen((v) => !v)}
          />
          {createOpen && (
            <CreateMenu
              onNewChannel={() => setNewChannelOpen(true)}
              onNewMessage={() => {
                setView("room");
                setSidebarFilter("dms");
              }}
              onClose={() => setCreateOpen(false)}
            />
          )}
        </div>
        <RailButton
          icon={
            dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
          }
          label={dark ? "Modo claro" : "Modo escuro"}
          onClick={toggleDark}
        />
        <RailButton
          icon={<Settings className="h-[18px] w-[18px]" />}
          label="Administrador"
          active={settingsOpen}
          onClick={() => setSettingsOpen(true)}
        />
        <button
          onClick={chat.logout}
          title="Sair"
          className="mt-2 grid h-9 w-9 place-items-center rounded-md text-[11px] font-bold text-white hover:opacity-80"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initials(user.name)}
        </button>
      </aside>

      {/* Barra de canais */}
      <aside className="flex w-64 shrink-0 flex-col bg-primary/95 text-primary-foreground">
        <div className="flex items-center gap-2 px-4 py-4">
          <span className="font-display text-sm font-bold">AtlasDesk Chat</span>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="mx-3 mb-2 flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-1.5 text-xs text-primary-foreground/70 hover:bg-primary-foreground/15"
        >
          <Search className="h-3.5 w-3.5" />
          Pesquisar mensagens…
        </button>

        <button
          onClick={() => setView("directory")}
          className={`mx-3 mb-2 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold ${
            view === "directory"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-primary-foreground/10"
          }`}
        >
          <Contact className="h-3.5 w-3.5" />
          Diretórios
        </button>

        <button
          onClick={() => setUnreadOnly((v) => !v)}
          className={`mx-3 mb-3 flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold ${
            unreadOnly ? "bg-accent text-accent-foreground" : "hover:bg-primary-foreground/10"
          }`}
        >
          <span>Não lidas</span>
          {totalUnread > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>

        <nav className="flex-1 overflow-y-auto px-2 text-sm">
          {(favoriteChannels.length > 0 || favoriteUsers.length > 0) && (
            <>
              <p className="mt-1 flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
                <Star className="h-3 w-3" /> Favoritos
              </p>
              {favoriteChannels.map((c) => (
                <SidebarRoomButton
                  key={`fav-c-${c.id}`}
                  active={chat.activeRoom?.type === "channel" && chat.activeRoom.id === c.id}
                  onClick={() => goToChannel(c)}
                  onToggleFavorite={() => chat.toggleFavorite(channelKey(c.id))}
                  isFavorite
                  icon={<Hash className="h-4 w-4 opacity-80" />}
                  label={c.name}
                  unread={chat.unreadByRoom[channelKey(c.id)]}
                />
              ))}
              {favoriteUsers.map((u) => (
                <SidebarRoomButton
                  key={`fav-u-${u.id}`}
                  active={chat.activeRoom?.type === "dm" && chat.activeRoom.id === u.id}
                  onClick={() => goToDm(u)}
                  onToggleFavorite={() => chat.toggleFavorite(dmKey(u.id))}
                  isFavorite
                  icon={
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {initials(u.name)}
                    </span>
                  }
                  label={u.name}
                  presence={u.online}
                  unread={chat.unreadByRoom[dmKey(u.id)]}
                />
              ))}
            </>
          )}

          {sidebarFilter === "all" && (
            <>
              <div className="mt-3 flex items-center justify-between px-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
                  Canais
                </p>
                <button
                  onClick={() => setNewChannelOpen(true)}
                  className="grid h-5 w-5 place-items-center rounded hover:bg-primary-foreground/10"
                  title="Criar canal"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {visibleChannels.map((c) => (
                <SidebarRoomButton
                  key={c.id}
                  active={chat.activeRoom?.type === "channel" && chat.activeRoom.id === c.id}
                  onClick={() => goToChannel(c)}
                  onToggleFavorite={() => chat.toggleFavorite(channelKey(c.id))}
                  icon={<Hash className="h-4 w-4 opacity-80" />}
                  label={c.name}
                  unread={chat.unreadByRoom[channelKey(c.id)]}
                />
              ))}
            </>
          )}

          <p className="mt-4 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
            Mensagens diretas
          </p>
          {knownUserList.length === 0 && (
            <p className="px-2 py-1 text-xs text-primary-foreground/50">
              Ainda não há outras pessoas conectadas.
            </p>
          )}
          {visibleUsers.map((u) => (
            <SidebarRoomButton
              key={u.id}
              active={chat.activeRoom?.type === "dm" && chat.activeRoom.id === u.id}
              onClick={() => goToDm(u)}
              onToggleFavorite={() => chat.toggleFavorite(dmKey(u.id))}
              icon={
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: u.avatarColor }}
                >
                  {initials(u.name)}
                </span>
              }
              label={u.name}
              presence={u.online}
              unread={chat.unreadByRoom[dmKey(u.id)]}
            />
          ))}

          <p className="mt-4 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
            Apps
          </p>
          <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-gradient-brand text-white">
              <Bot className="h-3 w-3" />
            </span>
            <span className="truncate">Assistente IA</span>
          </div>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-primary-foreground/70 hover:bg-primary-foreground/10">
            <Plus className="h-4 w-4" />
            Conectar apps
          </button>
        </nav>

        <button
          onClick={() => setInviteOpen(true)}
          className="mx-3 mb-3 rounded-md border border-primary-foreground/25 py-2 text-xs font-bold hover:bg-primary-foreground/10"
        >
          Convidar colegas de equipe
        </button>

        <div className="flex items-center gap-2 border-t border-primary-foreground/10 px-3 py-3">
          <span
            className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-bold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{user.name}</p>
            <p className="flex items-center gap-1 text-[10px] text-primary-foreground/60">
              <PresenceDot online /> online
            </p>
          </div>
          <button
            onClick={chat.logout}
            title="Sair"
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-primary-foreground/10"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {chat.serverError && (
          <div className="flex items-center gap-2 border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {chat.serverError}
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {view === "room" && chat.activeRoom && (
              <button
                onClick={() =>
                  chat.toggleFavorite(
                    chat.activeRoom!.type === "channel"
                      ? channelKey(chat.activeRoom!.id)
                      : dmKey(chat.activeRoom!.id),
                  )
                }
                className="text-muted-foreground hover:text-foreground"
                title="Favoritar"
              >
                <Star
                  className={`h-4 w-4 ${
                    chat.favorites.has(
                      chat.activeRoom.type === "channel"
                        ? channelKey(chat.activeRoom.id)
                        : dmKey(chat.activeRoom.id),
                    )
                      ? "fill-current text-amber-400"
                      : ""
                  }`}
                />
              </button>
            )}
            <h3 className="truncate font-display text-base font-bold">
              {view === "activity"
                ? "Atividade"
                : view === "files"
                  ? "Arquivos"
                  : view === "directory"
                    ? "Diretórios"
                    : (chat.activeRoom?.label ?? "Selecione uma conversa")}
            </h3>
            {view === "room" && chat.activeRoom?.type === "channel" && (
              <button
                onClick={() => setRenameOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                title="Renomear canal"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {view === "room" && chat.activeRoom && (
              <button
                onClick={() => {
                  if (circle.joined) circle.leave();
                  else circle.join(chat.activeRoom!.id, chat.activeRoom!.type);
                }}
                className={`mr-1 flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-bold ${
                  circle.joined
                    ? "border-destructive text-destructive"
                    : "border-border text-foreground hover:bg-muted"
                }`}
                title={circle.joined ? "Sair do Círculo" : "Iniciar Círculo (áudio)"}
              >
                <Headphones className="h-3.5 w-3.5" />
                <ChevronDown className="h-3 w-3" />
              </button>
            )}
            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Pesquisar"
            >
              <Search className="h-4 w-4" />
            </button>
            <NotificationBell
              notifications={chat.notifications}
              users={chat.users}
              onDismiss={chat.dismissNotification}
              onOpen={(n) => {
                setView("room");
                if (n.message.roomType === "channel") {
                  const ch = chat.channels.find((c) => c.id === n.message.roomId);
                  if (ch) chat.selectChannel(ch);
                }
              }}
            />
            {view === "room" && chat.activeRoom && (
              <div className="relative">
                <button
                  onClick={() => setChannelOptionsOpen((v) => !v)}
                  className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Mais opções"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {channelOptionsOpen && (
                  <ChannelOptionsMenu
                    isFavorite={chat.favorites.has(
                      chat.activeRoom.type === "channel"
                        ? channelKey(chat.activeRoom.id)
                        : dmKey(chat.activeRoom.id),
                    )}
                    onToggleFavorite={() =>
                      chat.toggleFavorite(
                        chat.activeRoom!.type === "channel"
                          ? channelKey(chat.activeRoom!.id)
                          : dmKey(chat.activeRoom!.id),
                      )
                    }
                    onDetails={() => setChannelDetailsOpen(true)}
                    onRename={() => setRenameOpen(true)}
                    isMuted={mutedRooms.has(
                      chat.activeRoom.type === "channel"
                        ? channelKey(chat.activeRoom.id)
                        : dmKey(chat.activeRoom.id),
                    )}
                    onToggleMute={() =>
                      toggleMuteRoom(
                        chat.activeRoom!.type === "channel"
                          ? channelKey(chat.activeRoom!.id)
                          : dmKey(chat.activeRoom!.id),
                      )
                    }
                    onClose={() => setChannelOptionsOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {circle.joined && view === "room" && chat.activeRoom && (
          <CircleCall
            roomLabel={chat.activeRoom.label}
            connecting={circle.connecting}
            muted={circle.muted}
            cameraOn={circle.cameraOn}
            localStream={circle.localStream}
            peers={circle.peers}
            error={circle.error}
            currentUserName={user.name}
            onToggleMute={circle.toggleMute}
            onToggleCamera={circle.toggleCamera}
            onLeave={circle.leave}
          />
        )}

        {view === "activity" && (
          <ActivityPanel notifications={chat.notifications} users={chat.users} />
        )}
        {view === "files" && <FilesPanel messages={filesForPanel} users={chat.users} />}
        {view === "directory" && (
          <DirectoryView
            users={knownUserList}
            onOpenDm={(u) => {
              goToDm(u);
            }}
          />
        )}

        {view === "room" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
              {chat.messages.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Diga oi! 👋
                </p>
              )}
              {chat.messages.map((m: ChatMessage) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  author={chat.users[m.authorId]}
                  currentUserId={user.id}
                  users={chat.users}
                  onReact={(emoji) => chat.toggleReaction(m, emoji)}
                  onOpenThread={() => chat.openThread(m)}
                  onVisible={() => chat.markRead(m)}
                />
              ))}
            </div>

            <TypingIndicator names={chat.typing.map((t) => t.name ?? "Alguém")} />

            <div className="p-4">
              <MessageComposer
                key={chat.activeRoom ? `${chat.activeRoom.type}:${chat.activeRoom.id}` : "none"}
                placeholder={
                  chat.activeRoom
                    ? `Mensagem para ${chat.activeRoom.label}`
                    : "Selecione uma conversa"
                }
                onChange={handleComposerChange}
                onSend={handleSend}
                leftSlot={
                  <>
                    <FileUploadButton
                      onUploaded={(file) =>
                        handleSend("", {
                          fileUrl: file.url,
                          fileName: file.name,
                          fileType: file.type,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!chat.activeRoom) return;
                        if (!circle.joined)
                          await circle.join(chat.activeRoom.id, chat.activeRoom.type);
                        if (!circle.cameraOn) circle.toggleCamera();
                      }}
                      title="Iniciar Círculo em vídeo"
                      className="hover:text-foreground"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!chat.activeRoom) return;
                        if (!circle.joined) circle.join(chat.activeRoom.id, chat.activeRoom.type);
                      }}
                      title="Iniciar Círculo em áudio"
                      className="hover:text-foreground"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </>
                }
              />
            </div>
          </>
        )}
      </div>

      {chat.threadParent && (
        <ThreadPanel
          parent={chat.threadParent}
          replies={chat.threadReplies}
          users={chat.users}
          currentUserId={user.id}
          onClose={chat.closeThread}
          onSendReply={chat.sendThreadReply}
          onReact={(m, emoji) => chat.toggleReaction(m, emoji)}
        />
      )}

      {newChannelOpen && (
        <NewChannelModal onCreate={chat.createChannel} onClose={() => setNewChannelOpen(false)} />
      )}

      {searchOpen && (
        <SearchModal
          users={chat.users}
          onSearch={chat.search}
          onClose={() => setSearchOpen(false)}
          onJumpTo={(m) => {
            if (m.roomType === "channel") {
              const ch = chat.channels.find((c) => c.id === m.roomId);
              if (ch) chat.selectChannel(ch);
            }
            setSearchOpen(false);
          }}
        />
      )}

      {inviteOpen && (
        <InvitePeopleModal workspaceName="AtlasDesk" onClose={() => setInviteOpen(false)} />
      )}

      {settingsOpen && (
        <SettingsModal
          soundOn={soundOn}
          onToggleSound={toggleSound}
          dark={dark}
          onToggleDark={toggleDark}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {renameOpen &&
        chat.activeRoom?.type === "channel" &&
        (() => {
          const ch = chat.channels.find((c) => c.id === chat.activeRoom!.id);
          return (
            <RenameChannelModal
              currentName={ch?.name ?? chat.activeRoom.id}
              onRename={(name) => chat.renameChannel(chat.activeRoom!.id, name)}
              onClose={() => setRenameOpen(false)}
            />
          );
        })()}

      {channelDetailsOpen &&
        chat.activeRoom?.type === "channel" &&
        (() => {
          const ch = chat.channels.find((c) => c.id === chat.activeRoom!.id);
          return ch ? (
            <ChannelDetailsModal
              channel={ch}
              memberCount={ch.memberIds.length || 1}
              onClose={() => setChannelDetailsOpen(false)}
            />
          ) : null;
        })()}

      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
