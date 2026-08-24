import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  Code,
  Link2,
  Plus,
  Smile,
  Film,
  Send,
  X,
} from "lucide-react";
import { GifPickerModal } from "@/chat/GifPickerModal";
import type { GifResult } from "@/chat/gifs";

/**
 * Shared chat UI primitives.
 *
 * These were originally defined inline inside `src/routes/onboarding.tsx`.
 * They now live here so both the onboarding preview and the real chat app
 * (`/app`) can reuse the exact same composer, emoji picker and GIF picker
 * without duplicating code. Behavior is unchanged.
 */

/* ---------------- initials helper ---------------- */

export function initials(name: string, max = 2) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, max)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/* ---------------- Emoji picker ---------------- */

export const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: "Frequentes", emojis: ["👍", "❤️", "😂", "🎉", "👏", "🙌", "🔥", "✅"] },
  {
    label: "Caras e pessoas",
    emojis: ["😀", "😃", "😄", "😁", "😅", "😊", "🙂", "😉", "😍", "🤔", "😴", "🥳"],
  },
  { label: "Gestos", emojis: ["👋", "🤝", "🙏", "💪", "👌", "✌️", "🤞", "👀"] },
  { label: "Comida e bebida", emojis: ["☕", "🍕", "🍎", "🍰", "🍫", "🥪"] },
];

export function EmojiPicker({
  onSelect,
  onClose,
}: {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(0);
  return (
    <div className="absolute bottom-10 left-0 z-30 w-72 rounded-lg border border-border bg-card shadow-elegant">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-xs font-bold text-foreground">Emojis para sua equipe</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setTab(i)}
            className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold ${
              tab === i ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 p-2">
        {EMOJI_CATEGORIES[tab].emojis.map((e) => (
          <button
            key={e}
            onClick={() => onSelect(e)}
            className="grid h-8 w-8 place-items-center rounded-md text-lg hover:bg-muted"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- GIF picker ---------------- */

/* O seletor de GIF é um modal completo em src/chat/GifPickerModal.tsx
   (busca em tempo real, tendências, categorias, favoritos, pré-visualização,
   cache e scroll infinito). */

/* ---------------- Toolbar button ---------------- */

export function ToolbarButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"
    >
      {icon}
    </button>
  );
}

/* ---------------- Message composer ---------------- */

export function MessageComposer({
  placeholder,
  onSend,
  onChange,
  leftSlot,
}: {
  placeholder: string;
  onSend?: (
    text: string,
    extra?: { fileUrl?: string; fileName?: string; fileType?: string },
  ) => void;
  onChange?: (text: string) => void;
  /** Extra buttons rendered before the emoji/gif icons (e.g. file upload). */
  leftSlot?: React.ReactNode;
}) {
  const [text, setTextRaw] = useState("");
  const setText = (updater: string | ((t: string) => string)) => {
    setTextRaw((prev) => {
      const next =
        typeof updater === "function" ? (updater as (t: string) => string)(prev) : updater;
      onChange?.(next);
      return next;
    });
  };
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(before: string, after: string = before) {
    const el = textareaRef.current;
    if (!el) {
      setText((t) => t + before + after);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const selected = text.slice(start, end);
    const next = text.slice(0, start) + before + selected + after + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  function insertEmoji(emoji: string) {
    setText((t) => t + emoji);
    setEmojiOpen(false);
  }

  function selectGif(gif: GifResult) {
    setGifOpen(false);
    onSend?.("", { fileUrl: gif.url, fileName: gif.title, fileType: "image/gif" });
  }

  return (
    <div className="rounded-xl border border-border">
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5 text-muted-foreground">
        <ToolbarButton
          icon={<Bold className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("**")}
        />
        <ToolbarButton
          icon={<Italic className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("_")}
        />
        <ToolbarButton
          icon={<Strikethrough className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("~~")}
        />
        <ToolbarButton
          icon={<Underline className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("<u>", "</u>")}
        />
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton
          icon={<List className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("\n• ", "")}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("\n1. ", "")}
        />
        <ToolbarButton icon={<Code className="h-3.5 w-3.5" />} onClick={() => wrapSelection("`")} />
        <ToolbarButton
          icon={<Link2 className="h-3.5 w-3.5" />}
          onClick={() => wrapSelection("[", "](url)")}
        />
      </div>
      <textarea
        ref={textareaRef}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!text.trim()) return;
            onSend?.(text);
            setText("");
          }
        }}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent px-4 py-3 text-sm outline-none"
      />
      <div className="relative flex items-center justify-between border-t border-border px-3 py-2 text-muted-foreground">
        <div className="flex items-center gap-3">
          {leftSlot ?? <Plus className="h-4 w-4" />}
          <button
            onClick={() => {
              setEmojiOpen((v) => !v);
              setGifOpen(false);
            }}
            className="hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setGifOpen((v) => !v);
              setEmojiOpen(false);
            }}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Film className="h-4 w-4" />
            <span className="text-[10px] font-bold">GIF</span>
          </button>
          {emojiOpen && <EmojiPicker onSelect={insertEmoji} onClose={() => setEmojiOpen(false)} />}
          {gifOpen && <GifPickerModal onPick={selectGif} onClose={() => setGifOpen(false)} />}
        </div>
        <button
          onClick={() => {
            if (!text.trim()) return;
            onSend?.(text);
            setText("");
          }}
          disabled={!text.trim()}
          className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
