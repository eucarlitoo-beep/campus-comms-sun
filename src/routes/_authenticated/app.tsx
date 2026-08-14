import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  MessageSquare,
  Bell,
  Files,
  MoreHorizontal,
  Search,
  Hash,
  Plus,
  Ticket,
  Send,
  Users,
  ChevronDown,
  Settings,
  LogOut,
  Loader2,
  Bold,
  Italic,
  Link2,
  List,
  Smile,
  AtSign,
  Mic,
  Video,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Espaço da escola — EduDesk" },
      {
        name: "description",
        content: "Canais, mensagens em tempo real e chamados de suporte de T.I. da sua escola.",
      },
      { property: "og:title", content: "Espaço da escola — EduDesk" },
      { property: "og:description", content: "Canais e chamados de suporte escolar em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

type Channel = { id: string; name: string; description: string | null };
type Message = { id: string; body: string; user_id: string; created_at: string };
type Ticket = {
  id: string;
  code: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  requester_id: string;
  created_at: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

function Workspace() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const userQ = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });
  const userId = userQ.data?.id;

  const wsQ = useQuery({
    queryKey: ["workspaces", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, slug, created_at")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const [wsId, setWsId] = useState<string | null>(null);
  const workspace = wsQ.data?.find((w) => w.id === wsId) ?? wsQ.data?.[0] ?? null;

  const channelsQ = useQuery({
    queryKey: ["channels", workspace?.id],
    enabled: !!workspace,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("channels")
        .select("id, name, description")
        .eq("workspace_id", workspace!.id)
        .order("name");
      if (error) throw error;
      return data as Channel[];
    },
  });

  const [channelId, setChannelId] = useState<string | null>(null);
  const channel = channelsQ.data?.find((c) => c.id === channelId) ?? channelsQ.data?.[0] ?? null;
  const [tab, setTab] = useState<"mensagens" | "chamados">("mensagens");

  const membersQ = useQuery({
    queryKey: ["members", workspace?.id],
    enabled: !!workspace,
    queryFn: async () => {
      const { data: mem, error } = await supabase
        .from("workspace_members")
        .select("user_id, role")
        .eq("workspace_id", workspace!.id);
      if (error) throw error;
      const ids = (mem ?? []).map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, job_title")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      return (mem ?? []).map((m) => ({
        ...m,
        name: profiles?.find((p) => p.id === m.user_id)?.full_name ?? "Colega de equipe",
        job_title: profiles?.find((p) => p.id === m.user_id)?.job_title ?? null,
      }));
    },
  });

  const nameOf = (id: string) => membersQ.data?.find((m) => m.user_id === id)?.name ?? "Colega";

  const messagesQ = useQuery({
    queryKey: ["messages", channel?.id],
    enabled: !!channel,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, body, user_id, created_at")
        .eq("channel_id", channel!.id)
        .order("created_at");
      if (error) throw error;
      return data as Message[];
    },
  });

  const ticketsQ = useQuery({
    queryKey: ["tickets", workspace?.id],
    enabled: !!workspace,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("id, code, title, description, category, priority, status, requester_id, created_at")
        .eq("workspace_id", workspace!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Ticket[];
    },
  });

  useEffect(() => {
    if (!channel) return;
    const ch = supabase
      .channel(`messages-${channel.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        qc.invalidateQueries({ queryKey: ["messages", channel.id] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [channel, qc]);

  const sendMessage = useMutation({
    mutationFn: async (body: string) => {
      const { error } = await supabase.from("messages").insert({ channel_id: channel!.id, user_id: userId!, body });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", channel?.id] }),
  });

  const createChannel = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("channels")
        .insert({ workspace_id: workspace!.id, name: slugify(name), created_by: userId! });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels", workspace?.id] }),
  });

  const createTicket = useMutation({
    mutationFn: async (t: { title: string; description: string; category: string; priority: string }) => {
      const { error } = await supabase.from("tickets").insert({
        workspace_id: workspace!.id,
        channel_id: channel?.id ?? null,
        requester_id: userId!,
        ...t,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets", workspace?.id] }),
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, string> }) => {
      const { error } = await supabase.from("tickets").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets", workspace?.id] }),
  });

  const createWorkspace = useMutation({
    mutationFn: async (name: string) => {
      const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
      const { data: ws, error } = await supabase
        .from("workspaces")
        .insert({ name, slug, owner_id: userId! })
        .select("id")
        .single();
      if (error) throw error;
      await supabase.from("workspace_members").insert({ workspace_id: ws.id, user_id: userId!, role: "admin" });
      await supabase.from("channels").insert(
        ["suporte-ti", "secretaria", "manutencao", "geral"].map((n) => ({
          workspace_id: ws.id,
          name: n,
          created_by: userId!,
        })),
      );
      return ws.id;
    },
    onSuccess: (id) => {
      setWsId(id);
      qc.invalidateQueries({ queryKey: ["workspaces", userId] });
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (userQ.isLoading || wsQ.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!wsQ.data?.length) {
    return <CreateWorkspace onCreate={(n) => createWorkspace.mutate(n)} pending={createWorkspace.isPending} />;
  }

  const myName = nameOf(userId ?? "");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-primary text-sm">
      {/* Top bar */}
      <div className="flex h-11 shrink-0 items-center gap-3 px-3 text-primary-foreground">
        <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-md bg-black/20 px-3 py-1.5">
          <Search className="h-4 w-4 opacity-80" />
          <span className="text-xs opacity-80">Buscar em {workspace?.name}</span>
        </div>
        <button onClick={signOut} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-black/20">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Rail */}
        <nav className="hidden w-[74px] shrink-0 flex-col items-center gap-1 py-2 text-primary-foreground sm:flex">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            {initials(workspace?.name ?? "Escola")}
          </div>
          {[
            { icon: Home, label: "Início" },
            { icon: MessageSquare, label: "MDs" },
            { icon: Bell, label: "Atividade" },
            { icon: Files, label: "Arquivos" },
            { icon: MoreHorizontal, label: "Mais" },
          ].map((r, i) => (
            <button key={r.label} className="flex w-full flex-col items-center gap-1 rounded-lg py-2 hover:bg-black/20">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  i === 0 ? "bg-white/20" : "bg-transparent"
                }`}
              >
                <r.icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-semibold">{r.label}</span>
            </button>
          ))}
          <div className="mt-auto flex flex-col items-center gap-2 pb-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/20">
              <Settings className="h-4 w-4" />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">
              {initials(myName)}
            </span>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col rounded-tl-xl bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-3">
            <button className="flex items-center gap-1 font-display text-base font-bold">
              {workspace?.name} <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 py-3">
            <div className="rounded-lg border border-accent/50 bg-accent/20 px-3 py-2 text-xs font-semibold text-accent-foreground">
              Plano gratuito ativo — chamados ilimitados
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" /> Encontrar uma conversa...
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <SectionLabel icon={Hash} label="Canais" />
            {channelsQ.data?.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setChannelId(c.id);
                  setTab("mensagens");
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left ${
                  channel?.id === c.id
                    ? "bg-accent font-bold text-accent-foreground"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <Hash className="h-4 w-4 opacity-70" /> {c.name}
              </button>
            ))}
            <AddChannel onAdd={(n) => createChannel.mutate(n)} pending={createChannel.isPending} />

            <div className="mt-4">
              <SectionLabel icon={Ticket} label="Chamados" />
              <button
                onClick={() => setTab("chamados")}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 ${
                  tab === "chamados" ? "bg-accent font-bold text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 opacity-70" /> Fila de atendimento
                </span>
                <span className="rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground">
                  {ticketsQ.data?.filter((t) => t.status !== "resolvido").length ?? 0}
                </span>
              </button>
            </div>

            <div className="mt-4">
              <SectionLabel icon={MessageSquare} label="Mensagens diretas" />
              {membersQ.data?.map((m) => (
                <div key={m.user_id} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-foreground/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                    {initials(m.name)}
                  </span>
                  {m.name}
                  {m.user_id === userId && <span className="text-xs text-muted-foreground">você</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border p-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-xs font-bold hover:bg-muted">
              <Users className="h-4 w-4" /> Convidar colegas de equipe
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col border-l border-border bg-background">
          <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-4">
            <h1 className="flex items-center gap-1 font-display text-base font-bold">
              {tab === "mensagens" ? (
                <>
                  <Hash className="h-4 w-4" /> {channel?.name ?? "sem-canal"}
                </>
              ) : (
                <>
                  <Ticket className="h-4 w-4" /> Fila de chamados
                </>
              )}
            </h1>
            <div className="flex gap-1">
              {(["mensagens", "chamados"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize ${
                    tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </header>

          {tab === "mensagens" ? (
            <ChannelView
              channel={channel}
              messages={messagesQ.data ?? []}
              nameOf={nameOf}
              onSend={(b) => sendMessage.mutate(b)}
              sending={sendMessage.isPending}
            />
          ) : (
            <TicketsView
              tickets={ticketsQ.data ?? []}
              nameOf={nameOf}
              onCreate={(t) => createTicket.mutate(t)}
              onUpdate={(id, patch) => updateTicket.mutate({ id, patch })}
              creating={createTicket.isPending}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, label }: { icon: typeof Hash; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </div>
  );
}

function AddChannel({ onAdd, pending }: { onAdd: (n: string) => void; pending: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-foreground/70 hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Adicionar canais
      </button>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name);
        setName("");
        setOpen(false);
      }}
      className="px-2 py-1"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="nome-do-canal"
        className="w-full rounded-md border border-border px-2 py-1.5 text-xs outline-none focus:border-primary"
      />
      <button
        disabled={pending}
        className="mt-1 w-full rounded-md bg-primary py-1.5 text-xs font-bold text-primary-foreground"
      >
        Criar canal
      </button>
    </form>
  );
}

function ChannelView({
  channel,
  messages,
  nameOf,
  onSend,
  sending,
}: {
  channel: Channel | null;
  messages: Message[];
  nameOf: (id: string) => string;
  onSend: (body: string) => void;
  sending: boolean;
}) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {channel && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-xl font-bold">
              Bem-vindo ao canal #{channel.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use este canal para registrar solicitações, combinar atendimentos e acompanhar chamados do setor.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3 py-2">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {initials(nameOf(m.user_id))}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{nameOf(m.user_id)}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-foreground/90">{m.body}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() || !channel) return;
          onSend(text.trim());
          setText("");
        }}
        className="m-4 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 border-b border-border px-3 py-2 text-muted-foreground">
          {[Bold, Italic, Link2, List].map((I, i) => (
            <I key={i} className="h-4 w-4" />
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder={`Enviar mensagem para #${channel?.name ?? ""}`}
          className="w-full resize-none bg-transparent px-3 py-2 outline-none"
        />
        <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground">
          {[Plus, Smile, AtSign, Video, Mic].map((I, i) => (
            <I key={i} className="h-4 w-4" />
          ))}
          <button
            disabled={sending}
            className="ml-auto flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
          >
            <Send className="h-3.5 w-3.5" /> Enviar
          </button>
        </div>
      </form>
    </>
  );
}

const statuses = ["aberto", "em-andamento", "aguardando", "resolvido"];
const priorities = ["baixa", "media", "alta", "urgente"];
const categories = ["ti", "secretaria", "manutencao", "pedagogico", "financeiro"];

function TicketsView({
  tickets,
  nameOf,
  onCreate,
  onUpdate,
  creating,
}: {
  tickets: Ticket[];
  nameOf: (id: string) => string;
  onCreate: (t: { title: string; description: string; category: string; priority: string }) => void;
  onUpdate: (id: string, patch: Record<string, string>) => void;
  creating: boolean;
}) {
  const [form, setForm] = useState({ title: "", description: "", category: "ti", priority: "media" });
  const [filter, setFilter] = useState<string>("todos");
  const list = useMemo(
    () => (filter === "todos" ? tickets : tickets.filter((t) => t.status === filter)),
    [tickets, filter],
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return;
          onCreate(form);
          setForm({ title: "", description: "", category: "ti", priority: "media" });
        }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <h2 className="font-display text-base font-bold">Abrir novo chamado</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex.: Projetor da sala 12 não liga"
            className="rounded-md border border-border px-3 py-2 outline-none focus:border-primary sm:col-span-2"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o problema, sala e horário"
            rows={2}
            className="resize-none rounded-md border border-border px-3 py-2 outline-none focus:border-primary sm:col-span-2"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-md border border-border px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Categoria: {c}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="rounded-md border border-border px-3 py-2"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                Prioridade: {p}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={creating}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
        >
          Abrir chamado
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {["todos", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
              filter === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
            }`}
          >
            {s.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum chamado nesta visão.</p>}
        {list.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">#{t.code}</span>
              <h3 className="font-bold">{t.title}</h3>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                  t.priority === "urgente" || t.priority === "alta"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.priority}
              </span>
            </div>
            {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Categoria: {t.category}</span>
              <span>·</span>
              <span>Solicitante: {nameOf(t.requester_id)}</span>
              <span>·</span>
              <span>{new Date(t.created_at).toLocaleDateString("pt-BR")}</span>
              <select
                value={t.status}
                onChange={(e) => onUpdate(t.id, { status: e.target.value })}
                className="ml-auto rounded-md border border-border px-2 py-1 text-xs font-bold text-foreground"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateWorkspace({ onCreate, pending }: { onCreate: (n: string) => void; pending: boolean }) {
  const [name, setName] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onCreate(name.trim());
        }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant"
      >
        <h1 className="font-display text-2xl font-bold">Qual é o nome da sua escola?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vamos criar o espaço com os canais #suporte-ti, #secretaria, #manutencao e #geral.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Colégio Batista Brasileiro"
          className="mt-5 w-full rounded-lg border-2 border-border px-4 py-3 outline-none focus:border-primary"
        />
        <button
          disabled={pending}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Criar espaço
        </button>
      </form>
    </div>
  );
}
