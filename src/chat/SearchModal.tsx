import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { initials } from "@/lib/chat-ui";
import type { ChatMessage, ChatUser } from "./types";

export function SearchModal({
  users,
  onSearch,
  onClose,
  onJumpTo,
}: {
  users: Record<string, ChatUser>;
  onSearch: (query: string) => Promise<ChatMessage[]>;
  onClose: () => void;
  onJumpTo: (message: ChatMessage) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await onSearch(query);
      setResults(r);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar mensagens…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">Buscando…</p>
          )}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">
              Nenhuma mensagem encontrada.
            </p>
          )}
          {results.map((m) => {
            const author = users[m.authorId];
            return (
              <button
                key={m.id}
                onClick={() => onJumpTo(m)}
                className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-muted"
              >
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
                  style={{ backgroundColor: author?.avatarColor ?? "#999" }}
                >
                  {initials(author?.name ?? "?")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">
                    {author?.name ?? "Alguém"}{" "}
                    <span className="font-normal text-muted-foreground">
                      em {m.roomType === "channel" ? `#${m.roomId}` : "mensagem direta"}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{m.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
