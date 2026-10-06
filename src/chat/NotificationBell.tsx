import { useState } from "react";
import { Bell } from "lucide-react";
import { initials } from "@/lib/chat-ui";
import type { ChatUser, Notification } from "./types";

export function NotificationBell({
  notifications,
  users,
  onDismiss,
  onOpen,
}: {
  notifications: Notification[];
  users: Record<string, ChatUser>;
  onDismiss: (index: number) => void;
  onOpen: (n: Notification) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-80 rounded-lg border border-border bg-card shadow-elegant">
          <div className="border-b border-border px-3 py-2">
            <p className="text-xs font-bold">Notificações</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                Você está em dia! Nada novo por aqui.
              </p>
            )}
            {notifications.map((n, i) => {
              const author = users[n.message.authorId];
              return (
                <button
                  key={`${n.message.id}-${i}`}
                  onClick={() => {
                    onOpen(n);
                    onDismiss(i);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-2 border-b border-border/60 px-3 py-2.5 text-left last:border-0 hover:bg-muted"
                >
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: author?.avatarColor ?? "#999" }}
                  >
                    {initials(author?.name ?? "?")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs">
                      <span className="font-bold">{author?.name ?? "Alguém"}</span> mencionou você
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{n.message.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
