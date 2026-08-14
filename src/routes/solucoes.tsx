import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, CardGrid } from "@/components/site-chrome";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções por setor — EduDesk" },
      {
        name: "description",
        content:
          "Fluxos prontos para suporte de T.I., secretaria, manutenção, coordenação e financeiro da escola.",
      },
      { property: "og:title", content: "Soluções por setor — EduDesk" },
      { property: "og:description", content: "Um fluxo de atendimento para cada setor da escola." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const flows = [
  {
    name: "Suporte de T.I.",
    items: [
      "Chromebook / notebook não liga",
      "Laboratório de informática sem internet",
      "Projetor ou lousa digital com falha",
      "Acesso ao Google Workspace / e-mail",
      "Impressora da sala dos professores",
    ],
  },
  {
    name: "Secretaria",
    items: [
      "Solicitação de declaração e histórico",
      "Dúvidas de matrícula e rematrícula",
      "Atualização de dados do aluno",
      "Emissão de segunda via de boleto",
    ],
  },
  {
    name: "Manutenção",
    items: [
      "Ar-condicionado da sala",
      "Lâmpada queimada / tomada",
      "Carteira ou porta quebrada",
      "Limpeza emergencial",
    ],
  },
  {
    name: "Coordenação",
    items: [
      "Registro de ocorrência do aluno",
      "Reserva de sala e recurso",
      "Solicitação de material pedagógico",
      "Comunicado para responsáveis",
    ],
  },
];

function Page() {
  return (
    <PageShell
      eyebrow="Soluções"
      title="Um fluxo para cada setor da escola"
      subtitle="Categorias, prioridades e responsáveis já pensados para a rotina escolar brasileira."
    >
      <Section title="Fluxos prontos" description="Ative os que fizerem sentido para a sua escola.">
        <div className="grid gap-4 md:grid-cols-2">
          {flows.map((f) => (
            <div key={f.name} className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <h3 className="font-display text-lg font-bold">{f.name}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {f.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Papéis e permissões" description="Cada pessoa vê exatamente o que precisa.">
        <CardGrid
          items={[
            { title: "Direção", body: "Visão geral dos indicadores e dos chamados críticos." },
            { title: "Coordenação", body: "Chamados do seu segmento e das suas turmas." },
            { title: "Técnico de T.I.", body: "Fila de atendimento, prioridade e histórico do equipamento." },
            { title: "Professor", body: "Abre chamado em segundos e acompanha o andamento." },
            { title: "Secretaria", body: "Atendimento a responsáveis com respostas padronizadas." },
            { title: "Responsáveis", body: "Recebem retorno claro sobre cada solicitação." },
          ]}
        />
      </Section>
    </PageShell>
  );
}
