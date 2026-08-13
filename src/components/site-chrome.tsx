import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export function Logo() {
  return (
    <div className="grid h-9 w-9 grid-cols-2 grid-rows-2 gap-0.5">
      <span className="rounded-tl-md bg-primary" />
      <span className="rounded-tr-md bg-accent" />
      <span className="rounded-bl-md bg-accent" />
      <span className="rounded-br-md bg-primary" />
    </div>
  );
}

type MenuLink = { label: string; to: string; desc: string };

const menus: Record<string, MenuLink[]> = {
  Funcionalidades: [
    { label: "Canais de atendimento", to: "/funcionalidades", desc: "Organize por setor: T.I., secretaria, pedagógico." },
    { label: "Chamados e SLA", to: "/funcionalidades", desc: "Prioridade, prazo e responsável em cada ticket." },
    { label: "Automações", to: "/funcionalidades", desc: "Roteamento automático e respostas prontas." },
    { label: "Relatórios", to: "/funcionalidades", desc: "Tempo de resposta, reincidência e volume." },
  ],
  Soluções: [
    { label: "Suporte de T.I.", to: "/solucoes", desc: "Laboratórios, Chromebooks, rede e projetores." },
    { label: "Secretaria", to: "/solucoes", desc: "Matrículas, documentos e atendimento a pais." },
    { label: "Manutenção", to: "/solucoes", desc: "Ordens de serviço da infraestrutura escolar." },
    { label: "Coordenação", to: "/solucoes", desc: "Solicitações pedagógicas e ocorrências." },
  ],
  Recursos: [
    { label: "Central de ajuda", to: "/recursos", desc: "Guias passo a passo para a equipe." },
    { label: "Modelos de chamado", to: "/recursos", desc: "Formulários prontos por categoria." },
    { label: "Integrações", to: "/recursos", desc: "E-mail, WhatsApp, Google Workspace." },
    { label: "Blog e novidades", to: "/recursos", desc: "Boas práticas de suporte escolar." },
  ],
};

const navItems: { label: string; to: string }[] = [
  { label: "Funcionalidades", to: "/funcionalidades" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Escolas", to: "/escolas" },
  { label: "Recursos", to: "/recursos" },
  { label: "Preços", to: "/precos" },
];

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

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
      onMouseLeave={() => setOpen(null)}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <div className="leading-none">
            <span className="font-display text-lg font-bold tracking-tight">EduDesk</span>
            <div className="text-[10px] font-medium text-muted-foreground">from Gestão Escolar</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const menu = menus[item.label];
            return (
              <div key={item.label} className="relative" onMouseEnter={() => setOpen(menu ? item.label : null)}>
                <Link
                  to={item.to}
                  className="group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                  {menu && <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:translate-y-0.5" />}
                </Link>
                {menu && open === item.label && (
                  <div className="absolute left-0 top-full w-80 rounded-xl border border-border bg-card p-2 shadow-card-soft">
                    {menu.map((m) => (
                      <Link
                        key={m.label}
                        to={m.to}
                        className="block rounded-lg px-3 py-2 hover:bg-muted"
                        onClick={() => setOpen(null)}
                      >
                        <div className="text-sm font-semibold">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            to="/precos"
            className="hidden rounded-md border-2 border-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/5 sm:inline-flex"
          >
            Solicitar demo
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-elegant transition hover:brightness-110 sm:px-4 sm:py-2"
          >
            Começar
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg font-bold">EduDesk</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:ml-auto">
          <Link to="/funcionalidades" className="hover:text-foreground">Funcionalidades</Link>
          <Link to="/solucoes" className="hover:text-foreground">Soluções</Link>
          <Link to="/escolas" className="hover:text-foreground">Escolas</Link>
          <Link to="/recursos" className="hover:text-foreground">Recursos</Link>
          <Link to="/precos" className="hover:text-foreground">Preços</Link>
          <Link to="/auth" className="hover:text-foreground">Entrar</Link>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-gradient-soft">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function CardGrid({
  items,
}: {
  items: { title: string; body: string; badge?: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.title} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
          {i.badge && (
            <span className="mb-3 inline-flex rounded-full bg-accent/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
              {i.badge}
            </span>
          )}
          <h3 className="text-base font-bold">{i.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
        </div>
      ))}
    </div>
  );
}
