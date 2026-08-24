import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Hash,
  Zap,
  Ticket,
  ArrowRight,
  Building2,
  Users,
  GraduationCap,
  Wrench,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Header, Footer, CTA, Msg } from "./index";
import { APP_CATALOG } from "@/lib/app-icons";

export const Route = createFileRoute("/ti-suporte")({
  head: () => ({
    meta: [
      { title: "AtlasDesk para TI e Suporte" },
      {
        name: "description",
        content:
          "Centralize chamados técnicos, automatize triagens e resolva mais rápido — tudo em canais organizados por prioridade, com IA ao lado da equipe de TI.",
      },
    ],
  }),
  component: TiSuportePage,
});

function TiSuportePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <FeatureSplit
          eyebrow="Opere com velocidade e eficiência"
          heading="Conheça uma forma mais rápida de resolver chamados"
          bullets={[
            "Trabalhe com eficiência, do chamado aberto à resolução",
            "Automatize a triagem por prioridade e setor responsável",
            "Conecte-se instantaneamente com Círculos de áudio e vídeo",
          ]}
          mock={<TicketChannelMock />}
        />
        <FeatureSplit
          reverse
          eyebrow="Alcance parceiros e fornecedores"
          heading="Concentre-se no que é importante e resolva junto com fornecedores"
          bullets={[
            "Traga fornecedores de tecnologia para dentro da conversa",
            "Ganhe visibilidade dos chamados em andamento com o AtlasDesk Connect",
            "Documente decisões e anexos no mesmo lugar do atendimento",
          ]}
          mock={<VendorConnectMock />}
        />
        <FeatureSplit
          eyebrow="Priorize o que os professores e a secretaria precisam"
          heading="Priorize os chamados e as economias de tempo"
          bullets={[
            "Solucione tíquetes mais rápido com fluxos automáticos",
            "Fortaleça o relacionamento com quem abre o chamado",
            "Encontre respostas antigas com a busca com IA",
          ]}
          mock={<CaseAutomationMock />}
        />
        <IntegrationsGrid />
        <TeamsGrid />
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
    <section className="overflow-hidden bg-gradient-soft pb-20 pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            AtlasDesk para TI e suporte
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Aumente a produtividade, transforme o suporte da escola
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Equipes de TI e suporte que centralizam chamados em canais organizados resolvem mais
            rápido — com automações simples e conhecimento sempre à mão, em vez de espalhado em
            e-mails e planilhas.
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

        <div className="grid place-items-center">
          <div className="grid h-52 w-52 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant sm:h-64 sm:w-64">
            <Wrench className="h-20 w-20 opacity-90 sm:h-24 sm:w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Bloco de recurso (imagem + texto, lado alternado) ---------------- */

function FeatureSplit({
  eyebrow,
  heading,
  bullets,
  mock,
  reverse,
}: {
  eyebrow: string;
  heading: string;
  bullets: string[];
  mock: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "order-2 lg:order-1" : ""}>
        {reverse ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
            {mock}
          </div>
        ) : null}
      </div>
      <div className={reverse ? "order-1 lg:order-2" : ""}>
        {!reverse && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft lg:hidden">
            {mock}
          </div>
        )}
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        <ul className="mt-5 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      {!reverse && (
        <div className="order-3 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft lg:col-start-1 lg:row-start-1 lg:block">
          {mock}
        </div>
      )}
    </section>
  );
}

/* ---------------- Mockups ---------------- */

function TicketChannelMock() {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
        <Hash className="h-3.5 w-3.5" /> ti-suporte
      </div>
      <div className="space-y-3 p-4">
        <Msg
          who="Sara da Silva"
          text="@aqui abrimos o chamado do projetor da sala 12, alguém pode olhar hoje?"
          tone="left"
        />
        <div className="ml-1 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-2 text-xs font-semibold">
          <Ticket className="h-3.5 w-3.5 text-primary" />
          Chamado #482 — Prioridade: alta
        </div>
        <Msg
          who="AtlasBot"
          text="Chamado atribuído a Maurício Rodrigues (TI). Prazo: hoje."
          tone="bot"
        />
      </div>
    </div>
  );
}

function VendorConnectMock() {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
        <Hash className="h-3.5 w-3.5" /> fornecedor-redes
        <span className="ml-auto flex items-center gap-1 rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-bold">
          <Building2 className="h-3 w-3" /> Externo
        </span>
      </div>
      <div className="space-y-3 p-4">
        <Msg
          who="Maurício Rodrigues"
          text="O link da secretaria caiu de novo hoje de manhã. Podem verificar?"
          tone="left"
        />
        <Msg
          who="Rede Fibra (externo)"
          text="Identificamos instabilidade no nó local. Equipe já está a caminho."
          tone="right"
        />
      </div>
    </div>
  );
}

function CaseAutomationMock() {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
        <Hash className="h-3.5 w-3.5" /> caso-manutencao-118
      </div>
      <div className="p-4">
        <div className="rounded-xl border border-border bg-muted/40 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Wrench className="h-3.5 w-3.5 text-primary" /> Solicitação de manutenção
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Ar-condicionado da sala dos professores sem gelar. Aberto por Carmen Veiga.
          </p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md border border-border px-3 py-1.5 text-[11px] font-semibold">
              Ver chamado
            </span>
            <span className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">
              Concluir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Integrações ---------------- */

function IntegrationsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        Mais de 16 tipos de integração, com mais chegando
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        O AtlasDesk se conecta às ferramentas que a equipe de TI já usa, como Google Drive,
        Microsoft 365 e Zoom.
      </p>
      <div className="mt-10 grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-8">
        {APP_CATALOG.map((app) => (
          <div key={app.name} className="flex flex-col items-center gap-2">
            <span
              className={`grid h-14 w-14 place-items-center rounded-xl shadow-card-soft ${app.tone}`}
            >
              {app.icon}
            </span>
            <p className="text-[11px] font-semibold leading-tight text-muted-foreground">
              {app.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Para todos os tipos de equipe ---------------- */

function TeamsGrid() {
  const teams = [
    { icon: <Wrench className="h-5 w-5" />, label: "TI" },
    { icon: <Building2 className="h-5 w-5" />, label: "Secretaria" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Pedagógico" },
    { icon: <Users className="h-5 w-5" />, label: "Atendimento a responsáveis" },
  ];
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Para todos os setores da escola
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Não importa o setor, é possível organizar o atendimento e ganhar tempo.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => (
            <a
              key={t.label}
              href="/canais"
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-card-soft hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <span className="flex items-center gap-3 font-display text-sm font-bold">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  {t.icon}
                </span>
                {t.label}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQ_ITEMS = [
  {
    q: "Como o AtlasDesk organiza os chamados de TI?",
    a: "Cada chamado pode virar um canal ou uma thread dedicada, com prioridade, responsável e histórico — em vez de se perder numa caixa de e-mail compartilhada.",
  },
  {
    q: "Dá para conectar fornecedores externos (internet, sistemas, hardware)?",
    a: "Sim, com o AtlasDesk Connect você cria um canal compartilhado com o fornecedor, mantendo o controle de quem participa.",
  },
  {
    q: "O AtlasBot ajuda a equipe de TI a resolver mais rápido?",
    a: "Sim — ele pode resumir canais inteiros, responder perguntas com base em conversas e documentos anteriores, e apontar a fonte de cada resposta.",
  },
  {
    q: "O AtlasDesk substitui o sistema de gestão escolar que já usamos?",
    a: "Não. O AtlasDesk se conecta ao sistema acadêmico que sua escola já usa, trazendo os dados para dentro da conversa em vez de duplicar cadastros.",
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
