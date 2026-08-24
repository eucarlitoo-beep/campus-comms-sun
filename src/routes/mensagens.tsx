import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Hash,
  Lock,
  Layers,
  Compass,
  Mic,
  Video,
  Star,
  Inbox,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Header, Footer, CTA, Msg } from "./index";
import { pickApps } from "@/lib/app-icons";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens — AtlasDesk" },
      {
        name: "description",
        content:
          "Um chat simples para o suporte de verdade. Converse com a secretaria, a coordenação, a TI e os responsáveis, com contexto e histórico organizados.",
      },
    ],
  }),
  component: MensagensPage,
});

function MensagensPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ChannelDemo />
        <ConnectEverywhere />
        <ContextApps />
        <SecurityColumns />
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
    <section className="overflow-hidden bg-gradient-soft pb-24 pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            App de mensagens para a escola
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Um chat simples para o suporte de verdade
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Use as mensagens a seu favor. Uma comunicação eficiente e organizada ajuda a secretaria,
            a coordenação e a TI a resolverem chamados melhor, juntas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
        </div>

        <div className="relative mx-auto h-72 w-full max-w-sm">
          <div className="absolute left-0 top-0 grid h-28 w-28 place-items-center rounded-full bg-gradient-brand text-3xl font-bold text-primary-foreground shadow-elegant">
            AL
          </div>
          <div className="absolute left-24 top-24 grid h-20 w-20 place-items-center rounded-full bg-accent text-xl font-bold text-accent-foreground shadow-elegant">
            MS
          </div>
          <div className="absolute right-0 top-6 grid h-16 w-16 place-items-center rounded-full bg-primary/80 text-sm font-bold text-primary-foreground shadow-elegant">
            CV
          </div>

          <div className="absolute -top-2 right-0 max-w-[220px] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant">
            Aqui está o plano para o 3º bimestre.
          </div>
          <div className="absolute left-1 top-32 flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold shadow-card-soft">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Planejamento.docx
          </div>
          <div className="absolute right-4 bottom-8 rounded-2xl rounded-br-none bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow-elegant">
            Está ótimo!
          </div>
          <div className="absolute bottom-0 left-10 rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-card-soft">
            Adicionei alguns comentários!
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Channel demo + escolha de estilo ---------------- */

function ChannelDemo() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
        <div className="grid grid-cols-[190px_1fr] text-sm">
          <aside className="space-y-4 bg-primary p-4 text-primary-foreground">
            <p className="font-display text-sm font-bold">Colégio Batista Brasilero</p>
            <nav className="space-y-1 text-xs">
              <p className="flex items-center gap-1.5 opacity-90">
                <Inbox className="h-3.5 w-3.5" /> Não lidas
              </p>
              <p className="flex items-center gap-1.5 opacity-90">
                <MessageSquare className="h-3.5 w-3.5" /> Conversas
              </p>
              <p className="flex items-center gap-1.5 opacity-90">Rascunhos e enviados</p>
            </nav>
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide opacity-70">
                <Star className="h-3 w-3" /> Favoritos
              </p>
              <p className="opacity-90"># comunicados</p>
              <p className="opacity-90"># matriculas</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide opacity-70">
                Canais
              </p>
              <p className="opacity-90"># duvidas-financeiro</p>
              <p className="opacity-90"># suporte-pais</p>
              <p className="flex items-center gap-1 rounded bg-primary-foreground/15 px-1.5 py-0.5 font-bold">
                <Lock className="h-3 w-3" /> equipe-secretaria
              </p>
            </div>
          </aside>
          <div className="flex flex-col">
            <p className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 font-bold">
              <Hash className="h-4 w-4 text-muted-foreground" /> equipe-secretaria
            </p>
            <div className="flex-1 space-y-3 p-4">
              <Msg
                who="Maurício Rodrigues"
                text="Olá, @equipe. Tenho novidades: a proposta de calendário do 4º bimestre está pronta! Se algo estiver faltando, falem comigo."
                tone="left"
              />
              <div className="ml-1 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-2 text-xs font-semibold">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Calendário letivo — 4º bimestre
              </div>
              <Msg
                who="Carmen Veiga"
                text="Excelente trabalho, @Maurício. Acho que dá pra adiantar o conselho de classe em uma semana."
                tone="left"
              />
            </div>
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
                <span className="h-4 w-4 rounded-full border border-border" />
                Enviar mensagem para #equipe-secretaria
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Escolha o estilo de comunicação que funciona para você
        </h2>
        <p className="mt-4 text-muted-foreground">
          O suporte não se limita a texto. Use Círculos de voz e vídeo, mensagens rápidas e
          conversas em thread para transmitir sua mensagem do jeito certo, em cada situação.
        </p>
        <div className="mt-6 flex gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card-soft">
            <Mic className="h-4 w-4 text-primary" /> Áudio
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card-soft">
            <Video className="h-4 w-4 text-primary" /> Círculos
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Conecte-se com as pessoas ---------------- */

function ConnectEverywhere() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Conecte-se com as pessoas onde quer que elas estejam trabalhando.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Reúna todas as pessoas da sua escola em um lugar só para se comunicar e colaborar. De
          conversas individuais a chats em grupo, você terá a sensação de estar na secretaria,
          esteja você onde estiver.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
        <div className="grid grid-cols-[170px_1fr] text-xs">
          <aside className="space-y-3 bg-primary p-3 text-primary-foreground">
            <p className="font-display text-xs font-bold">Colégio Batista Brasilero</p>
            <p className="opacity-90">Não lidas</p>
            <p className="opacity-90">Conversas</p>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide opacity-70">
                Favoritos
              </p>
              <p className="opacity-90"># comunicados</p>
              <p className="opacity-90"># matriculas</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide opacity-70">
                Canais
              </p>
              <p className="opacity-90"># duvidas-financeiro</p>
              <p className="rounded bg-primary-foreground/15 px-1 py-0.5 font-bold">
                # status-suporte
              </p>
            </div>
          </aside>
          <div className="p-3">
            <p className="mb-2 flex items-center gap-1 font-bold text-foreground">
              <Hash className="h-3 w-3" /> status-suporte
            </p>
            <div className="space-y-2 text-[11px] text-foreground/90">
              <p className="font-semibold">Carmen Veiga · 09:01</p>
              <p className="text-muted-foreground">Ontem</p>
              <p>• Recesso escolar no dia 15</p>
              <p className="text-muted-foreground">Hoje</p>
              <p>• Conferência dos boletos do mês</p>
              <p className="mt-2 font-semibold">Marcos Souza · 09:17</p>
              <p>• Parece que o recesso mudou de data</p>
              <p>• Resultados da pesquisa com responsáveis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Adicione contexto à conversa ---------------- */

function ContextApps() {
  const apps = pickApps(["Google Drive", "Sistema Acadêmico", "Google Classroom", "Microsoft 365"]);
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Adicione contexto à conversa
          </h2>
          <p className="mt-4 text-muted-foreground">
            Receba atualizações importantes, discuta-as e tome decisões, tudo sem alternar entre
            telas. Ao conectar outras ferramentas da escola ao AtlasDesk, você tem conversas mais
            completas e informadas.
          </p>
          <a
            href="/canais"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Ver funcionalidades de plataforma <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card-soft"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${app.tone}`}>
                {app.icon}
              </span>
              <div>
                <p className="text-sm font-bold">{app.name}</p>
                <p className="text-xs text-muted-foreground">{app.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Segurança / colunas ---------------- */

function SecurityColumns() {
  const items = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Organize conversas",
      desc: "Nomeie e organize seus canais por turma, setor ou assunto que faça sentido para a sua escola. Toda conversa tem um lugar e um ponto para seguir adiante.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Faça um bom uso do histórico",
      desc: "Otimize o atendimento consultando mensagens privadas ou conversas em canais da escola, todas salvas automaticamente e pesquisáveis.",
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: "Sempre ao seu alcance",
      desc: "Fique por dentro de todas as conversas e continue se comunicando em qualquer lugar, pelo computador ou pelo celular.",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 text-center">
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        Converse com segurança, com comunicação aberta ou privada
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Grande parte das conversas no AtlasDesk acontece nos canais, espaços abertos e organizados
        para mensagens, arquivos e pessoas — mas sempre é possível ter um lugar privado, com canais
        restritos e mensagens diretas.
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

/* ---------------- FAQ ---------------- */

const FAQ_ITEMS = [
  {
    q: "Por que o AtlasDesk é melhor do que e-mails para o suporte da escola?",
    a: "Diferente do e-mail, as conversas no AtlasDesk ficam organizadas por canal, com histórico pesquisável e contexto sempre à mão — sem correntes de e-mail intermináveis entre secretaria, coordenação e responsáveis.",
  },
  {
    q: "As mensagens privadas do AtlasDesk são realmente privadas?",
    a: "Sim. Mensagens diretas e canais privados só ficam visíveis para quem participa da conversa. A administração da escola pode definir políticas de retenção e acesso conforme a necessidade.",
  },
  {
    q: "Como eu envio uma mensagem para alguém de fora da escola?",
    a: "Use o AtlasDesk Connect para criar um canal compartilhado com fornecedores, editoras ou parceiros externos, mantendo o controle de quem participa.",
  },
  {
    q: "O que é um app de mensagens para equipes escolares?",
    a: "É uma ferramenta de comunicação pensada para o dia a dia de uma escola: canais por turma ou setor, histórico organizado, integrações com o sistema acadêmico e IA para resumir o que você perdeu.",
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
