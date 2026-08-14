import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell, Section } from "@/components/site-chrome";

export const Route = createFileRoute("/precos")({
  head: () => ({
    meta: [
      { title: "Preços — EduDesk Helpdesk Escolar" },
      {
        name: "description",
        content:
          "Planos que cabem no orçamento da escola: gratuito para começar, Pro para equipes de T.I. e Rede para várias unidades.",
      },
      { property: "og:title", content: "Preços — EduDesk Helpdesk Escolar" },
      { property: "og:description", content: "Comece grátis e cresça conforme a escola precisar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    note: "para sempre",
    features: ["Até 3 canais", "Chamados ilimitados", "Histórico de 90 dias", "2 técnicos"],
  },
  {
    name: "Pro",
    price: "R$ 29",
    note: "por usuário / mês",
    highlight: true,
    features: [
      "Canais ilimitados",
      "SLA e prazos por categoria",
      "Automações e roteamento",
      "Relatórios e exportação",
      "Histórico ilimitado",
      "Integração com e-mail",
    ],
  },
  {
    name: "Rede",
    price: "Fale com a gente",
    note: "várias unidades",
    features: [
      "Multi-unidades",
      "Login institucional (SSO)",
      "Painel consolidado da rede",
      "Suporte prioritário",
      "Treinamento da equipe",
    ],
  },
];

function Page() {
  return (
    <PageShell
      eyebrow="Preços"
      title="Preços que cabem no orçamento da escola"
      subtitle="Comece grátis, sem cartão de crédito. Troque de plano quando quiser."
    >
      <Section title="Planos">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.highlight
                  ? "border-primary bg-card shadow-elegant ring-2 ring-primary/20"
                  : "border-border bg-card shadow-card-soft"
              }`}
            >
              {p.highlight && (
                <span className="mb-3 inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                  Mais escolhido
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="pb-1 text-sm text-muted-foreground">{p.note}</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-6 inline-flex w-full justify-center rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wider ${
                  p.highlight
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "border-2 border-primary text-primary"
                }`}
              >
                Começar agora
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Perguntas frequentes">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { q: "Preciso de cartão para testar?", a: "Não. O plano gratuito é permanente e não pede cartão." },
            { q: "Posso trocar de plano depois?", a: "Sim, a qualquer momento, sem perder o histórico dos chamados." },
            { q: "Professores contam como usuário pago?", a: "No plano Pro, só a equipe de atendimento é cobrada." },
            { q: "Vocês atendem escolas públicas?", a: "Sim. Fale com a gente para condições especiais." },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
