import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Ticket,
  Users,
  Zap,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Check,
  GraduationCap,
  Bell,
  Bot,
  Clock,
  ChevronDown,
  Apple,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduDesk — Helpdesk para Gestão Escolar" },
      {
        name: "description",
        content:
          "Central de chamados e atendimento para escolas. Gerencie tickets de pais, alunos e equipe pedagógica em um só lugar.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <AppShowcase />
        <Features />

        <TicketPreview />
        <Workflow />
        <Pricing />
        <Signup />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header() {
  const navItems: { label: string; hasMenu?: boolean; href?: string }[] = [
    { label: "Funcionalidades", hasMenu: true },
    { label: "Soluções", hasMenu: true },
    { label: "Escolas", href: "#" },
    { label: "Recursos", hasMenu: true },
    { label: "Preços", href: "#precos" },
  ];

  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      if (y > 80 && goingDown) setHidden(true);
      else if (!goingDown) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <Logo />
          <div className="leading-none">
            <span className="font-display text-lg font-bold tracking-tight">EduDesk</span>
            <div className="text-[10px] font-medium text-muted-foreground">from Gestão Escolar</div>
          </div>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href ?? "#"}
              className="group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-muted hover:text-foreground"
            >
              {item.label}
              {item.hasMenu && (
                <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:translate-y-0.5" />
              )}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#entrar"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted sm:inline-flex"
          >
            Entrar
          </a>
          <a
            href="#entrar"
            className="hidden rounded-md border-2 border-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/5 sm:inline-flex"
          >
            Solicitar demo
          </a>
          <a
            href="#entrar"
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-elegant transition hover:brightness-110 sm:px-4 sm:py-2"
          >
            Começar
          </a>
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <div className="grid h-9 w-9 grid-cols-2 grid-rows-2 gap-0.5">
      <span className="rounded-tl-md bg-primary" />
      <span className="rounded-tr-md bg-accent" />
      <span className="rounded-bl-md bg-accent" />
      <span className="rounded-br-md bg-primary" />
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-soft" />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
            <GraduationCap className="h-3.5 w-3.5" />
            Helpdesk feito para escolas
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Suporte escolar <span className="text-gradient-brand">sem caos</span>, do primeiro chamado ao encerramento.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Centralize dúvidas de pais, solicitações da secretaria e chamados de TI em uma única plataforma —
            com canais, automações e SLA para toda a comunidade escolar.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#precos"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110"
            >
              Testar grátis por 14 dias
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#recursos"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Ver recursos
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sem cartão de crédito • Configuração em minutos
          </p>
        </div>

        <div className="mt-14">
          <HeroMock />
        </div>
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-border bg-card p-2 shadow-elegant">
      <div
        className="absolute -inset-2 -z-10 rounded-[2rem] opacity-30 blur-2xl"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {/* window bar */}
        <div className="flex items-center gap-2 bg-primary px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
          <div className="mx-auto w-1/2 rounded-full bg-primary-foreground/15 py-1 text-center text-xs text-primary-foreground/80">
            edudesk.escola.app
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-border bg-primary/95 p-3 text-primary-foreground sm:p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 gap-0.5">
                <span className="rounded-tl-sm bg-primary-foreground" />
                <span className="rounded-tr-sm bg-accent" />
                <span className="rounded-bl-sm bg-accent" />
                <span className="rounded-br-sm bg-primary-foreground" />
              </div>
              <span className="text-sm font-bold">EduDesk</span>
            </div>
            <SideItem icon={<Ticket className="h-4 w-4" />} label="Chamados" badge="12" active />
            <SideItem icon={<MessageSquare className="h-4 w-4" />} label="Canais" />
            <SideItem icon={<Users className="h-4 w-4" />} label="Alunos & Pais" />
            <SideItem icon={<Bell className="h-4 w-4" />} label="Notificações" badge="3" />
            <SideItem icon={<BarChart3 className="h-4 w-4" />} label="Relatórios" />
            <div className="mt-5 border-t border-primary-foreground/15 pt-4 text-[11px] uppercase tracking-wider text-primary-foreground/60">
              Filas
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <QueueItem color="bg-accent" label="Secretaria" />
              <QueueItem color="bg-emerald-300" label="TI / Sistemas" />
              <QueueItem color="bg-pink-300" label="Pedagógico" />
              <QueueItem color="bg-orange-300" label="Financeiro" />
            </div>
          </aside>

          {/* Content */}
          <section className="col-span-9 flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <h3 className="font-display text-base font-semibold">#chamados-secretaria</h3>
                <p className="text-xs text-muted-foreground">42 tickets ativos • SLA médio 2h13</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/60 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  Prioridade alta
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 p-5">
              <TicketRow
                initials="MC"
                name="Mariana Costa"
                meta="Mãe do aluno João P. • 6º ano B"
                subject="Segunda via do boleto de setembro"
                tag="Financeiro"
                tone="accent"
                time="há 3 min"
              />
              <TicketRow
                initials="RF"
                name="Prof. Rafael Faria"
                meta="Sala dos professores"
                subject="Projetor da sala 204 não liga"
                tag="TI"
                tone="primary"
                time="há 12 min"
              />
              <TicketRow
                initials="AI"
                name="EduBot"
                meta="Resposta automática"
                subject="Declaração de matrícula enviada para o e-mail cadastrado ✅"
                tag="Automação"
                tone="muted"
                time="há 20 min"
              />
            </div>

            <div className="border-t border-border bg-muted/40 px-5 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Responder a #chamados-secretaria…
                <span className="ml-auto rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                  Enviar
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon,
  label,
  badge,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm ${
        active ? "bg-primary-foreground/15 font-semibold" : "text-primary-foreground/85 hover:bg-primary-foreground/10"
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
          {badge}
        </span>
      )}
    </div>
  );
}

function QueueItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-primary-foreground/85 hover:bg-primary-foreground/10">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function TicketRow({
  initials,
  name,
  meta,
  subject,
  tag,
  tone,
  time,
}: {
  initials: string;
  name: string;
  meta: string;
  subject: string;
  tag: string;
  tone: "primary" | "accent" | "muted";
  time: string;
}) {
  const toneCls =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "accent"
      ? "bg-accent/50 text-accent-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition hover:shadow-card-soft">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-muted-foreground">{meta}</span>
          <span className="ml-auto text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="mt-0.5 text-sm text-foreground/90">{subject}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${toneCls}`}>{tag}</span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            #EDU-{Math.floor(Math.random() * 900 + 100)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- App Showcase (animated Slack-like demo) ---------------- */

function AppShowcase() {
  const scenes = [
    {
      channel: "lançamento-produto",
      subtitle: "Canvas atualizado",
      author: "Marcos Souza",
      canvasName: "Rastreador de lançamento",
      showLive: false,
      typing: "",
      reactions: [{ emoji: "🎯", count: 6 }],
    },
    {
      channel: "lançamento-produto",
      subtitle: "Canvas atualizado",
      author: "Marcos Souza",
      canvasName: "Rastreador de lançamento",
      showLive: true,
      typing: "Ótimo trabalho, equipe! Parec",
      reactions: [{ emoji: "🎯", count: 6 }],
    },
    {
      channel: "preparação-lançamento",
      subtitle: "Canvas",
      author: "Maurício Rodrigues",
      canvasName: "Atualização de lançamento do produto",
      showLive: false,
      typing: "",
      reactions: [
        { emoji: "💬", count: 8 },
        { emoji: "✅", count: 3 },
      ],
    },
  ];

  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % scenes.length), 3500);
    return () => clearInterval(t);
  }, [scenes.length]);
  const s = scenes[i];

  const sidebarChannels = [
    { name: "lançamento-produto", key: "lançamento-produto" },
    { name: "preparação-lançamento", key: "preparação-lançamento" },
    { name: "rastreamento-lançamento", key: "rastreamento-lançamento" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Demonstração
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Sua equipe escolar, em um só lugar
          </h2>
          <p className="mt-3 text-muted-foreground">
            Canais por assunto, canvas colaborativo e chamadas ao vivo — tudo dentro do EduDesk.
          </p>
        </div>

        {/* Browser-style window */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-300/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
            <div className="mx-auto flex h-7 w-1/2 items-center gap-2 rounded-md bg-white/15 px-3 text-xs text-white/80">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Pesquisar EduDesk — Escola Modelo
            </div>
            <span className="h-6 w-6 rounded-md bg-accent" />
          </div>

          <div className="grid grid-cols-12">
            {/* Rail */}
            <aside className="col-span-2 hidden flex-col items-center gap-5 bg-primary py-5 text-white sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary font-bold">E</div>
              {[
                { l: "Início" },
                { l: "MDs" },
                { l: "Atividade" },
                { l: "Arquivos" },
                { l: "Mais" },
              ].map((it) => (
                <div key={it.l} className="flex flex-col items-center gap-1 text-[10px] text-white/80">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">•</span>
                  {it.l}
                </div>
              ))}
              <div className="mt-auto h-9 w-9 rounded-full bg-accent/80 ring-2 ring-accent" />
            </aside>

            {/* Channel list */}
            <aside className="col-span-4 border-r border-border bg-secondary/60 p-3 text-sm">
              <div className="flex items-center gap-2 pb-3">
                <span className="font-display font-bold">Escola Modelo</span>
                <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>≡ Não lidas</li>
                <li>💬 Conversas</li>
                <li>✉ Rascunhos e enviados</li>
              </ul>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-foreground">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                Plano de atendimento
              </div>
              <ul className="mt-2 space-y-1">
                {sidebarChannels.map((c) => {
                  const active = c.key === s.channel;
                  return (
                    <li
                      key={c.key}
                      className={`truncate rounded-md px-2 py-1 transition-colors ${
                        active
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      # {c.name}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 text-xs font-semibold">Canais</div>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li># comunicados</li>
                <li># geral</li>
                <li># pesquisa</li>
              </ul>
            </aside>

            {/* Main pane */}
            <section key={i} className="col-span-12 min-h-[360px] animate-fade-in p-5 sm:col-span-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold"># {s.channel}</span>
                  <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-md border border-border px-2 py-1">👥 35</span>
                  <span className="rounded-md border border-border px-2 py-1">🎧</span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <span className="h-8 w-8 flex-shrink-0 rounded-md bg-accent" />
                  <div>
                    <div className="text-sm font-semibold">{s.subtitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.author} fez edições no
                    </div>
                    <a className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      📋 {s.canvasName}
                    </a>
                    <div className="mt-2 flex gap-1.5">
                      {s.reactions.map((r) => (
                        <span
                          key={r.emoji}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-xs"
                        >
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {s.showLive && (
                  <div className="flex animate-fade-in gap-3">
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-md bg-green-500/15 text-green-600">
                      🎧
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        Um círculo está acontecendo
                        <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          Ao vivo
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sara da Silva e outras 5 pessoas estão nele.{" "}
                        <a className="font-semibold text-primary underline">Participar</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <span className="text-muted-foreground">＋</span>
                <span className={s.typing ? "text-foreground" : "text-muted-foreground"}>
                  {s.typing || "Mensagem para " + s.channel}
                  {s.typing && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" />}
                </span>
                <span className="ml-auto text-primary">➤</span>
              </div>
            </section>
          </div>
        </div>

        {/* Scene dots */}
        <div className="mt-6 flex justify-center gap-2">
          {scenes.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Cena ${k + 1}`}
              className={`h-2 rounded-full transition-all ${
                k === i ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust bar ---------------- */


function TrustBar() {
  const items = [
    "Colégio Horizonte",
    "Escola Ipê",
    "Instituto Aurora",
    "Rede Bem-Ensinar",
    "Colégio Vértice",
    "Escola Nova Era",
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-xs">+ de 200 escolas confiam:</span>
        {items.map((i) => (
          <span key={i} className="opacity-70 hover:opacity-100">
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */

function Features() {
  const items = [
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Tickets organizados por fila",
      desc: "Separe chamados de secretaria, TI, pedagógico e financeiro com regras automáticas.",
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "EduBot com IA",
      desc: "Responde dúvidas frequentes de pais e alunos 24/7 usando a base da sua escola.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "SLA e prioridades",
      desc: "Defina prazos por tipo de solicitação e receba alertas antes de atrasar.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Perfis por papel",
      desc: "Pais, alunos, professores e coordenadores veem apenas o que faz sentido para eles.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Relatórios em tempo real",
      desc: "Acompanhe volume, tempo de resposta e satisfação por setor e período.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Segurança LGPD",
      desc: "Controle de acesso granular e trilha de auditoria para dados dos estudantes.",
    },
  ];
  return (
    <section id="recursos" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tudo o que sua escola precisa para <span className="text-gradient-brand">atender melhor</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Menos e-mails perdidos, menos grupos de WhatsApp, mais resolução.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-card-soft"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
              {f.icon}
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Ticket preview split ---------------- */

function TicketPreview() {
  return (
    <section className="bg-gradient-soft">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
            <Zap className="h-3.5 w-3.5" /> Novidade
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Do WhatsApp da diretora para um <span className="text-gradient-brand">painel único</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Conecte e-mail, formulário do site e portal do aluno. Todo pedido vira um ticket rastreável — e
            ninguém mais fica "esperando resposta".
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Atribuição automática por categoria",
              "Histórico completo do aluno no ticket",
              "Respostas prontas em português",
              "Aprovações em um clique",
            ].map((x) => (
              <li key={x} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm">{x}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 -z-10 rounded-3xl opacity-40 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ticket #EDU-482
                </p>
                <h4 className="mt-1 font-display text-lg font-semibold">
                  Solicitação de transferência escolar
                </h4>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                Em andamento
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <MiniStat label="Solicitante" value="Fernanda L." />
              <MiniStat label="Aluno" value="Pedro L. — 9º" />
              <MiniStat label="SLA" value="4h restantes" />
            </div>

            <div className="mt-5 space-y-3">
              <Msg
                who="Fernanda L. (Responsável)"
                text="Preciso do histórico escolar do Pedro para matrícula em outra escola. Podem enviar?"
                tone="left"
              />
              <Msg
                who="Ana — Secretaria"
                text="Oi Fernanda! Já iniciei o processo. Você recebe por e-mail em até 24h."
                tone="right"
              />
              <Msg
                who="EduBot"
                text="✅ Documento gerado automaticamente e anexado ao ticket."
                tone="bot"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Msg({ who, text, tone }: { who: string; text: string; tone: "left" | "right" | "bot" }) {
  const bubble =
    tone === "right"
      ? "bg-primary text-primary-foreground ml-auto"
      : tone === "bot"
      ? "bg-accent/60 text-accent-foreground"
      : "bg-muted";
  return (
    <div className="max-w-[85%]" style={{ marginLeft: tone === "right" ? "auto" : 0 }}>
      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{who}</p>
      <div className={`rounded-2xl px-3.5 py-2 text-sm ${bubble}`}>{text}</div>
    </div>
  );
}

/* ---------------- Workflow ---------------- */

function Workflow() {
  const steps = [
    { n: "01", t: "Receba", d: "Pais e alunos abrem chamados pelo portal, e-mail ou app." },
    { n: "02", t: "Classifique", d: "Regras enviam o ticket para a fila e responsável certos." },
    { n: "03", t: "Resolva", d: "Equipe responde, aciona a IA e cumpre o SLA." },
    { n: "04", t: "Aprenda", d: "Relatórios mostram gargalos e satisfação por setor." },
  ];
  return (
    <section id="fluxo" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Um fluxo simples, do começo ao fim.
        </h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6">
            <span className="font-display text-4xl font-bold text-gradient-brand">{s.n}</span>
            <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

function Pricing() {
  const plans = [
    {
      name: "Essencial",
      price: "R$ 149",
      unit: "/ mês por escola",
      desc: "Para escolas começando a organizar o atendimento.",
      features: ["Até 3 agentes", "2 filas de chamados", "Portal do responsável", "Suporte por e-mail"],
      cta: "Começar grátis",
      highlight: false,
    },
    {
      name: "Escola +",
      price: "R$ 349",
      unit: "/ mês por escola",
      desc: "Nossa opção mais popular — completo para escolas em crescimento.",
      features: [
        "Agentes ilimitados",
        "Filas ilimitadas + SLA",
        "EduBot com IA",
        "Integração com sistema acadêmico",
        "Relatórios avançados",
      ],
      cta: "Testar 14 dias",
      highlight: true,
    },
    {
      name: "Rede",
      price: "Sob consulta",
      unit: "para redes e grupos",
      desc: "Para redes com múltiplas unidades e SSO corporativo.",
      features: ["Multi-unidade", "SSO / SAML", "Gerente de sucesso", "SLA contratual"],
      cta: "Falar com vendas",
      highlight: false,
    },
  ];
  return (
    <section id="precos" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Preços que cabem no orçamento da escola.
        </h2>
        <p className="mt-3 text-muted-foreground">Sem taxa por aluno. Cancele quando quiser.</p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-7 ${
              p.highlight
                ? "border-transparent bg-gradient-brand text-primary-foreground shadow-elegant"
                : "border-border bg-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                Mais escolhido
              </span>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <p className={`mt-1 text-sm ${p.highlight ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className={`text-sm ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {p.unit}
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full ${
                      p.highlight ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                p.highlight
                  ? "bg-accent text-accent-foreground hover:brightness-105"
                  : "bg-primary text-primary-foreground hover:brightness-110"
              }`}
            >
              {p.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Signup / Entry form ---------------- */

function Signup() {
  return (
    <section id="entrar" className="relative overflow-hidden border-y border-border bg-gradient-soft">
      <div
        className="absolute -top-24 left-1/2 -z-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex items-center justify-center gap-2">
          <Logo />
          <span className="font-display text-2xl font-bold tracking-tight">EduDesk</span>
        </div>

        <h2 className="mt-10 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Primeiro, insira seu e-mail
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Recomendamos usar o <strong className="text-foreground">e-mail institucional da escola</strong>.
        </p>

        <form
          className="mx-auto mt-8 max-w-md space-y-3 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sr-only" htmlFor="signup-email">
            E-mail
          </label>
          <input
            id="signup-email"
            type="email"
            required
            placeholder="nome@escola.edu.br"
            className="h-14 w-full rounded-xl border-2 border-primary/60 bg-card px-4 text-base text-foreground shadow-sm outline-none ring-4 ring-primary/10 transition placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
          />
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-elegant transition hover:brightness-110"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mx-auto mt-8 flex max-w-md items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Outras opções
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mx-auto mt-5 grid max-w-md gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <Apple className="h-4 w-4 fill-current" />
            Apple
          </button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Já usa o EduDesk?{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Entrar em uma escola existente
          </a>
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#34A853"
        d="M3.6 7.5l3.2 2.3C7.6 8 9.6 6.2 12 6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.3 12 2.3 8.1 2.3 4.7 4.4 3.6 7.5z"
        opacity=".9"
      />
    </svg>
  );
}

/* ---------------- CTA ---------------- */

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero px-8 py-16 text-center text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_20%_20%,var(--color-accent)_0%,transparent_40%)]" />
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Comece a atender sua comunidade escolar hoje.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Leva menos de 10 minutos para configurar o EduDesk na sua escola.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-elegant hover:brightness-105"
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/20"
          >
            Falar com um consultor
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-lg font-bold">EduDesk</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Helpdesk pensado para a rotina da gestão escolar.
          </p>
        </div>
        <FooterCol
          title="Produto"
          items={["Recursos", "Preços", "Integrações", "Novidades"]}
        />
        <FooterCol title="Escolas" items={["Educação Infantil", "Ensino Fundamental", "Ensino Médio", "Redes"]} />
        <FooterCol title="Empresa" items={["Sobre", "Blog", "Contato", "Central de ajuda"]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} EduDesk. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-foreground">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
