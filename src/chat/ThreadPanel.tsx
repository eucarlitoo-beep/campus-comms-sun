import { X } from "lucide-react";
import { MessageComposer } from "@/lib/chat-ui";
import { MessageItem } from "./MessageItem";
import type { ChatMessage, ChatUser } from "./types";

export function ThreadPanel({
  parent,
  replies,
  users,
  currentUserId,
  onClose,
  onSendReply,
  onReact,
}: {
  parent: ChatMessage;
  replies: ChatMessage[];
  users: Record<string, ChatUser>;
  currentUserId: string;
  onClose: () => void;
  onSendReply: (text: string) => void;
  onReact: (message: ChatMessage, emoji: string) => void;
}) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h4 className="font-display text-sm font-bold">Thread</h4>
          <p className="text-xs text-muted-foreground">
            {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <MessageItem
          message={parent}
          author={users[parent.authorId]}
          currentUserId={currentUserId}
          users={users}
          onReact={(emoji) => onReact(parent, emoji)}
          showThreadEntry={false}
        />
        <div className="my-3 flex items-center gap-2 px-2 text-[11px] font-semibold text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
          <span className="h-px flex-1 bg-border" />
        </div>
        {replies.map((r) => (
          <MessageItem
            key={r.id}
            message={r}
            author={users[r.authorId]}
            currentUserId={currentUserId}
            users={users}
            onReact={(emoji) => onReact(r, emoji)}
            showThreadEntry={false}
          />
        ))}
      </div>

      <div className="border-t border-border p-3">
        <MessageComposer placeholder="Responder na thread…" onSend={onSendReply} />
      </div>
    </aside>
  );
}
