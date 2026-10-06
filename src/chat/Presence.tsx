export function PresenceDot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ring-2 ring-card ${
        online ? "bg-emerald-500" : "bg-muted-foreground/40"
      }`}
      title={online ? "Online" : "Offline"}
    />
  );
}

export function TypingIndicator({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  const text =
    names.length === 1
      ? `${names[0]} está digitando…`
      : names.length === 2
        ? `${names[0]} e ${names[1]} estão digitando…`
        : `${names.length} pessoas estão digitando…`;
  return (
    <div className="flex items-center gap-1.5 px-6 py-1 text-xs italic text-muted-foreground">
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground" />
      </span>
      {text}
    </div>
  );
}
