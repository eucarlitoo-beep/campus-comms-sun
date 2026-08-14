import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section, CardGrid } from "@/components/site-chrome";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title: "Para escolas e redes de ensino — EduDesk" },
      {
        name: "description",
        content:
          "Da escola de bairro à rede com várias unidades: implantação guiada, treinamento da equipe e suporte em português.",
      },
      { property: "og:title", content: "Para escolas e redes de ensino — EduDesk" },
      { property: "og:description", content: "Implantação em uma semana, com treinamento e suporte em português." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell
      eyebrow="Escolas"
      title="Feito para a realidade da escola brasileira"
      subtitle="Educação infantil, fundamental, médio, técnico e redes com várias unidades."
    >
      <Section title="Etapas da implantação" description="Sua escola em operação em até uma semana.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { n: "1", t: "Espaço da escola", d: "Criamos o workspace e os canais por setor." },
            { n: "2", t: "Equipe", d: "Convide técnicos, secretaria e coordenação por e-mail." },
            { n: "3", t: "Categorias", d: "Definimos categorias, prioridades e prazos." },
            { n: "4", t: "Operação", d: "Professores abrem chamados e a fila começa a girar." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="mt-3 font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Por segmento">
        <CardGrid
          items={[
            { badge: "Infantil", title: "Comunicação com famílias", body: "Solicitações de responsáveis com retorno rastreável." },
            { badge: "Fundamental", title: "Sala de aula funcionando", body: "Projetor, tablet e internet sem parar a aula." },
            { badge: "Médio", title: "Laboratórios", body: "Gestão de equipamentos e agendamento de recursos." },
            { badge: "Técnico", title: "Parque de máquinas", body: "Histórico por equipamento e reincidência." },
            { badge: "Redes", title: "Multi-unidades", body: "Um espaço por unidade, com padrão de atendimento." },
            { badge: "Pública", title: "Orçamento enxuto", body: "Plano gratuito para começar sem custo." },
          ]}
        />
        <div className="mt-8">
          <Link
            to="/precos"
            className="inline-flex rounded-md border-2 border-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary"
          >
            Ver preços
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
