import { useEffect, useRef, useState } from "react";
import { MessageSquare, Paperclip, Check, CheckCheck, SmilePlus } from "lucide-react";
import { EmojiPicker, initials } from "@/lib/chat-ui";
import { chatApi } from "./api";
import type { ChatMessage, ChatUser } from "./types";

function renderText(text: string, users: Record<string, ChatUser>) {
  // Realça @menções (nomes conhecidos) e deixa **negrito**/_itálico_/~~tachado~~
  // simples, sem trazer uma lib de markdown inteira pra isso.
  const knownNames = Object.values(users).map((u) => u.name);
  const parts: (string | { mention: string })[] = [];
  let rest = text;
  const mentionRegex = /@([a-zA-Z0-9._-]+(?:\s[a-zA-Z0-9._-]+)?)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = mentionRegex.exec(text))) {
    const isKnown = knownNames.some((n) => n.toLowerCase().startsWith(match![1].toLowerCase()));
    if (isKnown) {
      parts.push(text.slice(lastIndex, match.index));
      parts.push({ mention: match[0] });
      lastIndex = match.index + match[0].length;
    }
  }
  parts.push(text.slice(lastIndex));
  rest = "";

  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <span key={i} className="rounded bg-primary/10 px-1 font-semibold text-primary">
        {p.mention}
      </span>
    ),
  );
}

export function MessageItem({
  message,
  author,
  currentUserId,
  users,
  onReact,
  onOpenThread,
  onVisible,
  showThreadEntry = true,
}: {
  message: ChatMessage;
  author?: ChatUser;
  currentUserId: string;
  users: Record<string, ChatUser>;
  onReact: (emoji: string) => void;
  onOpenThread?: () => void;
  onVisible?: () => void;
  showThreadEntry?: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onVisible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  const time = new Date(message.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isMine = message.authorId === currentUserId;
  const readByOthers = message.readBy.filter((id) => id !== message.authorId);

  return (
    <div
      ref={ref}
      className="group flex items-start gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40"
    >
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-xs font-bold text-white"
        style={{ backgroundColor: author?.avatarColor ?? "#999" }}
      >
        {initials(author?.name ?? "?")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 text-sm">
          <span className="font-bold text-foreground">{author?.name ?? "Alguém"}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </p>
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
            {renderText(message.text, users)}
          </p>
        )}
        {message.fileUrl &&
          (message.fileType?.startsWith("image/") ? (
            <img
              src={
                message.fileUrl.startsWith("http")
                  ? message.fileUrl
                  : chatApi.fileUrl(message.fileUrl)
              }
              alt={message.fileName ?? "imagem"}
              loading="lazy"
              className="mt-1.5 max-h-64 rounded-lg border border-border object-contain"
            />
          ) : (
            <a
              href={
                message.fileUrl.startsWith("http")
                  ? message.fileUrl
                  : chatApi.fileUrl(message.fileUrl)
              }
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              <Paperclip className="h-3.5 w-3.5" />
              {message.fileName ?? "Arquivo anexado"}
            </a>
          ))}

        {Object.keys(message.reactions).length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                  userIds.includes(currentUserId)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <span>{emoji}</span>
                <span className="font-semibold">{userIds.length}</span>
              </button>
            ))}
          </div>
        )}

        {showThreadEntry && (message.replyCount ?? 0) > 0 && (
          <button
            onClick={onOpenThread}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {message.replyCount} {message.replyCount === 1 ? "resposta" : "respostas"}
          </button>
        )}

        {isMine && readByOthers.length > 0 && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <CheckCheck className="h-3 w-3 text-primary" />
            Visto
          </p>
        )}
        {isMine && readByOthers.length === 0 && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Check className="h-3 w-3" />
            Enviado
          </p>
        )}
      </div>

      <div className="relative flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Reagir"
        >
          <SmilePlus className="h-4 w-4" />
        </button>
        {showThreadEntry && (
          <button
            onClick={onOpenThread}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Responder em thread"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        )}
        {pickerOpen && (
          <div className="absolute right-0 top-8 z-30">
            <EmojiPicker
              onSelect={(emoji) => {
                onReact(emoji);
                setPickerOpen(false);
              }}
              onClose={() => setPickerOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
