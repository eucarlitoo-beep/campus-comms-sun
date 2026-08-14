import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section, CardGrid } from "@/components/site-chrome";

export const Route = createFileRoute("/funcionalidades")({
  head: () => ({
    meta: [
      { title: "Funcionalidades — EduDesk Helpdesk Escolar" },
      {
        name: "description",
        content:
          "Canais por setor, chamados com SLA, automações, base de conhecimento e relatórios para o suporte de T.I. da sua escola.",
      },
      { property: "og:title", content: "Funcionalidades — EduDesk Helpdesk Escolar" },
      {
        property: "og:description",
        content: "Tudo que a equipe de T.I. e a secretaria precisam para atender chamados escolares.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell
      eyebrow="Funcionalidades"
      title="Conversa e chamado no mesmo lugar"
      subtitle="O EduDesk junta o bate-papo por canais com um sistema completo de chamados de suporte de T.I. e serviços escolares."
    >
      <Section
        title="Comunicação organizada por canais"
        description="Cada setor da escola tem seu espaço, com histórico pesquisável e chamados vinculados."
      >
        <CardGrid
          items={[
            { badge: "Canais", title: "#suporte-ti", body: "Chromebooks, laboratório, rede Wi-Fi, projetores e impressoras — tudo registrado." },
            { badge: "Canais", title: "#secretaria", body: "Matrículas, boletos, declarações e atendimento a responsáveis." },
            { badge: "Canais", title: "#manutencao", body: "Ordens de serviço da infraestrutura: elétrica, ar-condicionado, mobiliário." },
            { badge: "Mensagens", title: "Tempo real", body: "Mensagens aparecem instantaneamente para toda a equipe conectada." },
            { badge: "Mensagens diretas", title: "Conversas 1:1", body: "Fale direto com o técnico responsável sem sair do sistema." },
            { badge: "Círculos", title: "Áudio rápido", body: "Resolva dúvidas rápidas por chamada, com resumo no canal." },
          ]}
        />
      </Section>

      <Section
        title="Chamados com controle de verdade"
        description="Cada solicitação vira um ticket com número, prioridade, prazo e responsável."
      >
        <CardGrid
          items={[
            { title: "Prioridade e SLA", body: "Baixa, média, alta e urgente com prazo de resposta por categoria." },
            { title: "Fila por responsável", body: "Atribua chamados ao técnico certo e acompanhe a carga de cada um." },
            { title: "Status claro", body: "Aberto, em andamento, aguardando e resolvido — visível para todos." },
            { title: "Categorias escolares", body: "T.I., secretaria, manutenção, pedagógico e financeiro." },
            { title: "Histórico completo", body: "Comentários e decisões ficam anexados ao chamado para auditoria." },
            { title: "Relatórios", body: "Volume, tempo médio de solução e reincidência por sala ou setor." },
          ]}
        />
        <div className="mt-8">
          <Link
            to="/auth"
            className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-elegant"
          >
            Criar meu espaço da escola
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
