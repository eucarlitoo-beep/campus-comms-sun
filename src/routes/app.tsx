import { createFileRoute } from "@tanstack/react-router";
import { ChatApp } from "@/chat/ChatApp";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Chat — AtlasDesk" },
      {
        name: "description",
        content: "Bate-papo em tempo real do AtlasDesk: canais, mensagens diretas, threads e mais.",
      },
    ],
  }),
  component: ChatApp,
});
