import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Hash,
  Lock,
  Sparkles,
  ListChecks,
  ArrowRight,
  X,
  Search,
  Phone,
  Ticket,
  Bell,
  Bot,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Header, Footer, CTA, Msg } from "./index";

export const Route = createFileRoute("/canais")({
  head: () => ({
    meta: [
      { title: "Canais — AtlasDesk" },
      {
        name: "description",
        content:
          "Traga os chamados e as conversas da sua escola para canais organizados, com IA ao seu lado. Suporte à secretaria, coordenação, TI e responsáveis, tudo em um só lugar.",
      },
    ],
  }),
  component: CanaisPage,
});

function CanaisPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <IntroSplit />
        <IntegrationFeature />
        <AiHighlightsFeature />
        <ConnectFeature />
        <TrustGrid />
        <StartsWithChannel />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-soft pb-20 pt-14 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Canais</p>
      <h1 className="mx-auto mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Trabalhe sem limites nos <span className="text-primary">canais</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Os canais reúnem as pessoas e as informações certas. Discuta qualquer assunto da escola,
        compartilhe conhecimento coletivo e tome decisões com a IA ao seu lado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/onboarding"
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-elegant hover:brightness-110"
        >
          Começar
        </Link>
        <a
          href="#entrar"
          className="inline-flex items-center rounded-md border-2 border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
        >
          Falar com nosso time
        </a>
      </div>
    </section>
  );
}

/* ---------------- Intro split ---------------- */

function IntroSplit() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Canais</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Traga os chamados para um ambiente mais colaborativo e transparente.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Os canais são espaços flexíveis e transparentes para a equipe trabalhar em conjunto.
          Discuta solicitações, compartilhe arquivos e automatize processos de atendimento — tudo em
          um canal. E você pode criar quantos a sua escola precisar.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
        <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-primary-foreground">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-1 text-xs">
            <Search className="h-3 w-3" />
            Pesquisar Colégio Batista Brasilero
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr] text-sm">
          <div className="border-r border-border p-4">
            <p className="flex items-center gap-1.5 font-bold text-foreground">
              <Hash className="h-4 w-4 text-muted-foreground" /> secretaria
            </p>
            <div className="mt-3 space-y-3">
              <Msg
                who="Marcos Souza"
                text="Aqui estão as prioridades da equipe para o semestre:"
                tone="left"
              />
              <div className="ml-1 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-2 text-xs font-semibold">
                <ListChecks className="h-3.5 w-3.5 text-primary" />
                Metas da secretaria — Ano letivo 2026
              </div>
              <Msg
                who="AtlasBot"
                text="Postem suas atualizações semanais na conversa 📎"
                tone="bot"
              />
            </div>
          </div>
          <div className="p-4">
            <p className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              Conversa
              <X className="h-3.5 w-3.5" />
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">3 respostas</p>
            <div className="mt-3 space-y-3">
              <Msg who="Lisa Correia" text="" tone="left" />
              <Msg who="Sara da Silva" text="" tone="left" />
              <Msg who="Maurício Rodrigues" text="" tone="left" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Integração com o sistema acadêmico ---------------- */

function IntegrationFeature() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft lg:order-1">
        <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
          <Hash className="h-3.5 w-3.5" /> secretaria
          <span className="ml-auto rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-bold">
            Conta
          </span>
        </div>
        <div className="p-4 text-sm">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" /> Registrar contato
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                Reunião de acompanhamento — Beatriz Ramos
              </div>
              <div className="h-8 rounded-md bg-muted/60" />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <span className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                Cancelar
              </span>
              <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                Enviar
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Disponível agora — canais do sistema acadêmico
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Tenha a visão mais completa dos responsáveis e alunos.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Os canais do sistema acadêmico levam os dados de matrícula, financeiro e frequência para o
          AtlasDesk — e o AtlasDesk para o sistema acadêmico. Receba atualizações em tempo real,
          planeje atendimentos e edite cadastros, tudo em um canal colaborativo.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          Saiba mais <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

/* ---------------- Destaques da IA ---------------- */

function AiHighlightsFeature() {
  const channels = [
    "chat-equipe-pedagogica",
    "comunicados",
    "coordenacao",
    "financeiro",
    "geral",
    "matriculas",
    "secretaria",
    "suporte-ti",
    "ti-manutencao",
  ];
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Destaques da IA
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Resuma os canais e economize tempo com a IA ao seu lado.
        </h2>
        <p className="mt-4 text-muted-foreground">
          O AtlasBot trabalha junto com sua equipe, nos canais e nas conversas. Receba destaques
          diários de canais inteiros, fique por dentro de tudo com resumos inteligentes e dedique
          tempo aos atendimentos mais importantes.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          Comece a economizar tempo com a IA do AtlasDesk <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
        <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
          <GraduationHat /> Colégio Batista Brasilero
        </div>
        <div className="grid grid-cols-[1fr_1.2fr] text-xs">
          <div className="border-r border-border p-3">
            <p className="mb-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 font-bold text-primary">
              <ListChecks className="h-3.5 w-3.5" /> Destaque
            </p>
            <ul className="space-y-1.5 text-muted-foreground">
              {channels.map((c) => (
                <li key={c} className="truncate">
                  # {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">10 mensagens resumidas</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Marcado como lido
              </span>
            </div>
            <div className="mt-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                # secretaria
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <div className="h-2 w-full rounded bg-border" />
                </div>
                <div className="h-2 w-4/5 rounded bg-border" />
                <div className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <div className="h-2 w-full rounded bg-border" />
                </div>
                <div className="h-2 w-3/5 rounded bg-border" />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">16 mensagens resumidas</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GraduationHat() {
  return <Sparkles className="h-3.5 w-3.5" />;
}

/* ---------------- AtlasDesk Connect ---------------- */

function ConnectFeature() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft lg:order-1">
        <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
          <Hash className="h-3.5 w-3.5" /> editora-didaticos
          <span className="ml-auto flex items-center gap-1 rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-bold">
            <Users className="h-3 w-3" /> Externo
          </span>
        </div>
        <div className="space-y-3 p-4">
          <Msg
            who="Marcos Souza"
            text="Podemos fechar o pedido de material do 6º ano?"
            tone="left"
          />
          <Msg who="Editora ABC (externo)" text="Sim! Envio o contrato ainda hoje." tone="right" />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          AtlasDesk Connect
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Trabalhe com pessoas de fora da escola, diretamente do AtlasDesk.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Os canais do AtlasDesk Connect permitem que você trabalhe com fornecedores, editoras e
          parceiros mais valiosos de forma tão próxima e produtiva quanto com a própria equipe — com
          segurança e controle total de quem participa.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Trust grid ---------------- */

function TrustGrid() {
  const items = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "É mais seguro do que troca de e-mails",
      desc: "Todas as informações são criptografadas com segurança de nível empresarial e estão em conformidade com a LGPD.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Aproveite a memória da sua escola",
      desc: "Desenvolva o conhecimento coletivo e preserve a memória institucional, desbloqueando-a por meio da pesquisa com IA.",
    },
    {
      icon: <ListChecks className="h-6 w-6" />,
      title: "Obtenha o resumo com a ajuda da IA",
      desc: "Precisou fazer uma pausa? Com os destaques e os resumos, você fica por dentro das conversas que perdeu.",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 text-center">
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        Seguro. Pesquisável. Inteligente.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Não importa se você tem uma equipe de 5 ou 500 pessoas, com os canais é possível fazer o
        atendimento avançar mais rapidamente.
      </p>
      <div className="mt-14 grid gap-10 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="text-left sm:text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant sm:mx-auto">
              {it.icon}
            </div>
            <h3 className="mt-4 font-display text-base font-bold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Tudo começa com um canal ---------------- */

function StartsWithChannel() {
  const cards = [
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Central de chamados",
      tone: "bg-blue-50 text-blue-700",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Comunicados da secretaria",
      tone: "bg-amber-50 text-amber-700",
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Turmas e projetos",
      tone: "bg-fuchsia-50 text-fuchsia-700",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Responsáveis e financeiro",
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        Tudo no AtlasDesk começa com um canal.
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-card-soft"
          >
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tone}`}>{c.icon}</div>
            <p className="font-display text-sm font-bold">{c.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQ_ITEMS = [
  {
    q: "Qual é a diferença entre mensagens diretas e canais?",
    a: "Mensagens diretas são conversas privadas entre você e outra pessoa (ou um pequeno grupo). Canais são espaços organizados por assunto, turma ou setor, onde toda a equipe envolvida pode acompanhar e participar.",
  },
  {
    q: "Como me conecto com um fornecedor ou parceiro externo?",
    a: "Use o AtlasDesk Connect para criar um canal compartilhado com pessoas de fora da sua escola, como editoras, fornecedores ou prestadores de serviço, mantendo o controle de quem tem acesso.",
  },
  {
    q: "Quando devo usar um canal de suporte em vez de um canal padrão?",
    a: "Canais de suporte são indicados quando o assunto envolve abertura, acompanhamento e resolução de chamados — como manutenção, TI ou secretaria — já que trazem automações e um fluxo de atendimento dedicado.",
  },
  {
    q: "Como configuro canais para a minha escola?",
    a: "Durante a configuração inicial, sugerimos canais como #secretaria, #ti-suporte e #comunicados. Você pode criar quantos canais quiser depois, a qualquer momento.",
  },
  {
    q: "Em que idioma o conteúdo da IA será exibido?",
    a: "O AtlasBot responde no mesmo idioma da sua escola — por padrão, em português do Brasil.",
  },
  {
    q: "O que significa integração com o sistema acadêmico?",
    a: "É a conexão entre o AtlasDesk e o sistema que sua escola já usa para matrículas, notas e financeiro, trazendo esses dados para dentro da conversa, sem precisar trocar de tela.",
  },
];

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Perguntas frequentes
      </h2>
      <Accordion type="single" collapsible className="mt-10">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-base font-bold">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
