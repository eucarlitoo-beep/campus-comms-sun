import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, CardGrid } from "@/components/site-chrome";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos e central de ajuda — EduDesk" },
      {
        name: "description",
        content:
          "Guias, modelos de chamado, integrações e boas práticas para montar o suporte de T.I. da sua escola.",
      },
      { property: "og:title", content: "Recursos e central de ajuda — EduDesk" },
      { property: "og:description", content: "Guias, modelos de chamado e integrações para a equipe escolar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell
      eyebrow="Recursos"
      title="Aprenda e implante com a gente"
      subtitle="Material pronto para treinar a equipe e padronizar o atendimento da escola."
    >
      <Section title="Guias rápidos">
        <CardGrid
          items={[
            { badge: "5 min", title: "Como abrir um chamado", body: "O caminho que o professor percorre para pedir suporte." },
            { badge: "8 min", title: "Definindo prioridades", body: "Como classificar urgência sem travar a fila." },
            { badge: "10 min", title: "Montando canais", body: "Estrutura recomendada de canais por setor." },
            { badge: "6 min", title: "SLA na prática", body: "Prazos realistas para uma equipe pequena de T.I." },
            { badge: "12 min", title: "Relatórios para a direção", body: "Quais números apresentar na reunião mensal." },
            { badge: "4 min", title: "Convidando a equipe", body: "Onboarding dos professores em um dia." },
          ]}
        />
      </Section>

      <Section title="Modelos de chamado" description="Formulários prontos por categoria, é só ativar.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Equipamento com defeito",
            "Sem internet na sala",
            "Acesso e senha",
            "Instalação de software",
            "Reserva de laboratório",
            "Manutenção predial",
            "Documento escolar",
            "Ocorrência pedagógica",
            "Solicitação de compra",
          ].map((m) => (
            <div key={m} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold">
              {m}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Integrações">
        <CardGrid
          items={[
            { title: "E-mail", body: "Notificações de novos chamados e respostas." },
            { title: "Google Workspace", body: "Entrada com a conta institucional da escola." },
            { title: "WhatsApp", body: "Avisos de chamado resolvido para responsáveis." },
            { title: "Planilhas", body: "Exportação dos chamados para análise." },
            { title: "Calendário", body: "Agendamento de visitas técnicas." },
            { title: "Sistema acadêmico", body: "Importação de turmas e salas." },
          ]}
        />
      </Section>
    </PageShell>
  );
}
