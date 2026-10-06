import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Ticket,
  ClipboardList,
  Users,
  Megaphone,
  Wrench,
  Briefcase,
  Calendar,
  MessageSquare,
  Target,
  UserPlus,
  Building2,
  FileText,
  LifeBuoy,
  Laptop,
  Hash,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Header, Footer, CTA } from "./index";

export const Route = createFileRoute("/modelos")({
  head: () => ({
    meta: [
      { title: "Modelos — AtlasDesk" },
      {
        name: "description",
        content:
          "Comece qualquer chamado, comunicado ou processo da escola com um modelo pronto: canais, canvas e listas pré-configurados para a sua equipe.",
      },
    ],
  }),
  component: ModelosPage,
});

interface Template {
  title: string;
  category: string;
  icon: React.ReactNode;
  tone: string;
}

const CATEGORIES = [
  { key: "atendimento", label: "Atendimento e suporte", icon: <LifeBuoy className="h-5 w-5" /> },
  { key: "pedagogico", label: "Planejamento pedagógico", icon: <Calendar className="h-5 w-5" /> },
  { key: "equipe", label: "Gestão de equipe", icon: <Users className="h-5 w-5" /> },
  { key: "familia", label: "Comunicação com a família", icon: <Megaphone className="h-5 w-5" /> },
  { key: "produtividade", label: "Produtividade", icon: <ClipboardList className="h-5 w-5" /> },
];

const FEATURED: Template[] = [
  {
    title: "Central de chamados",
    category: "atendimento",
    icon: <Ticket className="h-7 w-7" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Matrícula passo a passo",
    category: "pedagogico",
    icon: <FileText className="h-7 w-7" />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Integração de novos professores",
    category: "equipe",
    icon: <UserPlus className="h-7 w-7" />,
    tone: "bg-fuchsia-50 text-fuchsia-700",
  },
  {
    title: "Comunicado aos responsáveis",
    category: "familia",
    icon: <Megaphone className="h-7 w-7" />,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Registro de manutenção",
    category: "atendimento",
    icon: <Wrench className="h-7 w-7" />,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    title: "Kit inicial para a secretaria",
    category: "produtividade",
    icon: <Briefcase className="h-7 w-7" />,
    tone: "bg-indigo-50 text-indigo-700",
  },
];

const ALL_TEMPLATES: Template[] = [
  ...FEATURED,
  {
    title: "Planejamento do bimestre",
    category: "pedagogico",
    icon: <Calendar className="h-6 w-6" />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Metas da secretaria",
    category: "produtividade",
    icon: <Target className="h-6 w-6" />,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Acompanhamento de equipe",
    category: "equipe",
    icon: <Users className="h-6 w-6" />,
    tone: "bg-fuchsia-50 text-fuchsia-700",
  },
  {
    title: "Reunião individual (1:1)",
    category: "equipe",
    icon: <MessageSquare className="h-6 w-6" />,
    tone: "bg-fuchsia-50 text-fuchsia-700",
  },
  {
    title: "Kit para parceiros externos",
    category: "atendimento",
    icon: <Building2 className="h-6 w-6" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Boletim informativo mensal",
    category: "familia",
    icon: <Megaphone className="h-6 w-6" />,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Solicitação de responsáveis",
    category: "atendimento",
    icon: <Ticket className="h-6 w-6" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Planejamento de eventos",
    category: "pedagogico",
    icon: <Calendar className="h-6 w-6" />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Pauta de reunião pedagógica",
    category: "pedagogico",
    icon: <ClipboardList className="h-6 w-6" />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Guia de recursos para pais",
    category: "familia",
    icon: <FileText className="h-6 w-6" />,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Solicitação de suporte de TI",
    category: "atendimento",
    icon: <Laptop className="h-6 w-6" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Diretrizes de comunicação",
    category: "familia",
    icon: <Megaphone className="h-6 w-6" />,
    tone: "bg-amber-50 text-amber-700",
  },
];

function ModelosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <EasyStart />
        <FeaturedTemplates />
        <CategoriesAndExplore />
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
            Modelos
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A maneira mais rápida e eficiente de atender, do início ao fim.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Tenha uma vantagem para cada chamado, processo e comunicado com os modelos do AtlasDesk.
          </p>
          <a
            href="#destaque"
            className="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-elegant hover:brightness-110"
          >
            Ver modelos
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
          <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-primary-foreground">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <p className="ml-2 text-xs font-bold">Modelos</p>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {FEATURED.slice(0, 6).map((t) => (
              <div key={t.title} className="rounded-lg border border-border bg-background p-2">
                <div className={`grid h-10 w-10 place-items-center rounded-md ${t.tone}`}>
                  {t.icon}
                </div>
                <p className="mt-1.5 text-[10px] font-semibold leading-tight">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Fácil e eficiente ---------------- */

function EasyStart() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Fácil e eficiente
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Uma maneira mais simples de começar a atender.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Às vezes, a parte mais difícil do trabalho é começar. Com modelos, seus canais, canvas e
          listas vêm pré-criados e prontos para a sua equipe começar o atendimento na hora.
        </p>
        <a
          href="#explorar"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          Navegar por todos os modelos <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
        <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-2.5 text-xs text-primary-foreground">
          <Hash className="h-3.5 w-3.5" /> matricula-2026
        </div>
        <div className="space-y-3 p-4 text-sm">
          <p className="text-xs font-semibold text-muted-foreground">Visibilidade</p>
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
            🔒 Restrito à secretaria
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold">
              <FileText className="h-3.5 w-3.5 text-primary" /> Visão geral da matrícula
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Descrição do processo, documentos e prazos.
            </p>
          </div>
          <button className="w-full rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground">
            Criar canal com este modelo
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Modelos em destaque ---------------- */

function FeaturedTemplates() {
  return (
    <section id="destaque" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Modelos em destaque</h2>
      <p className="mt-2 text-muted-foreground">
        Modelos selecionados para as necessidades da sua escola.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((t) => (
          <TemplateCard key={t.title} template={t} />
        ))}
      </div>
    </section>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className={`flex h-28 items-center justify-center ${template.tone}`}>
        {template.icon}
      </div>
      <div className="p-4">
        <p className="font-display text-sm font-bold">{template.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {CATEGORIES.find((c) => c.key === template.category)?.label}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Categorias + explorar todos ---------------- */

function CategoriesAndExplore() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = activeCategory
    ? ALL_TEMPLATES.filter((t) => t.category === activeCategory)
    : ALL_TEMPLATES;
  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section id="explorar" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Navegar por categoria</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button
          onClick={() => {
            setActiveCategory(null);
            setShowAll(false);
          }}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-xs font-bold transition ${
            activeCategory === null
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setActiveCategory(c.key);
              setShowAll(false);
            }}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-xs font-bold transition ${
              activeCategory === c.key
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h3 className="text-xl font-bold">Explorar todos os modelos…</h3>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {filtered.length} modelos
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((t) => (
          <TemplateCard key={t.title} template={t} />
        ))}
      </div>

      {!showAll && filtered.length > visible.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-md border-2 border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
          >
            Carregar mais modelos
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQ_ITEMS = [
  {
    q: "O que são os modelos do AtlasDesk?",
    a: "São canais, canvas e listas pré-configurados para tarefas comuns da escola — como abrir um chamado de manutenção, organizar uma matrícula ou comunicar os responsáveis — prontos para usar em segundos.",
  },
  {
    q: "Os modelos do AtlasDesk são gratuitos?",
    a: "Sim, os modelos ficam disponíveis para todas as equipes da escola, sem custo adicional.",
  },
  {
    q: "Como posso impulsionar a produtividade com os modelos do AtlasDesk?",
    a: "Em vez de montar um canal do zero toda vez, comece com um modelo pronto para o tipo de atendimento — isso padroniza o processo e economiza o tempo da sua equipe.",
  },
  {
    q: "Posso personalizar um modelo para a minha escola?",
    a: "Sim. Use qualquer modelo como ponto de partida e ajuste os campos, canais e automações conforme a realidade da sua escola.",
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
