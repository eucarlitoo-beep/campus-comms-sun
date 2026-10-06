import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Link2,
  Pencil,
  Search,
  Bell,
  Plus,
  Hash,
  Home,
  Files,
  MoreHorizontal,
  Headphones,
  Star,
  X,
  Video,
  MessageSquare,
  MessagesSquare,
  FileText,
  ListFilter,
  Bot,
  ChevronDown,
  Settings,
  Moon,
  Sun,
  Contact,
  Volume2,
  VolumeX,
  Keyboard,
  HelpCircle,
  Puzzle,
  UserPlus,
  PhoneOff,
} from "lucide-react";
import { MessageComposer, initials } from "@/lib/chat-ui";
import { useDarkMode } from "@/chat/useDarkMode";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Configurar sua escola — AtlasDesk" },
      {
        name: "description",
        content:
          "Configure sua conta AtlasDesk: crie o workspace da sua escola, convide colegas e comece a atender chamados.",
      },
    ],
  }),
  component: OnboardingPage,
});

type Step = "welcome" | "name" | "you" | "invite" | "plan" | "app";

function OnboardingPage() {
  const search = Route.useSearch() as { email?: string };
  const email = search.email || "voce@escola.edu.br";
  const [step, setStep] = useState<Step>("welcome");
  const [workspaceName, setWorkspaceName] = useState("Colégio Batista Brasileiro");
  const [userName, setUserName] = useState("Carlos Silva");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/95 via-primary to-primary/80">
      {step === "welcome" && <WelcomeStep email={email} onCreate={() => setStep("name")} />}
      {step === "name" && (
        <NameWorkspaceStep
          value={workspaceName}
          onChange={setWorkspaceName}
          onNext={() => setStep("you")}
        />
      )}
      {step === "you" && (
        <YourNameStep
          value={userName}
          onChange={setUserName}
          workspaceName={workspaceName}
          onNext={() => setStep("invite")}
        />
      )}
      {step === "invite" && (
        <InviteStep
          workspaceName={workspaceName}
          userName={userName}
          onNext={() => setStep("plan")}
        />
      )}
      {step === "plan" && <PlanStep onDone={() => setStep("app")} />}
      {step === "app" && <AppStep workspaceName={workspaceName} userName={userName} />}
    </div>
  );
}

/* ---------------- 0. Welcome / already have an account ---------------- */

function WelcomeStep({ email, onCreate }: { email: string; onCreate: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-card p-8 shadow-elegant sm:p-12">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Logo />
          <span className="font-display text-2xl font-bold tracking-tight">AtlasDesk</span>
        </div>

        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Parece que você entrou <br /> no AtlasDesk há pouco tempo
            </h1>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Não há convites nem contas do AtlasDesk para{" "}
              <strong className="text-foreground">{email}</strong>. Se sua escola ainda não está no
              AtlasDesk, você pode criar um workspace para ela.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:brightness-110"
              >
                Criar um workspace
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
              >
                Tentar um e-mail diferente
              </Link>
            </div>
          </div>

          <MascotIllustration />
        </div>
      </div>
    </div>
  );
}

function MascotIllustration() {
  return (
    <div className="relative mx-auto grid h-52 w-52 place-items-center rounded-full bg-accent/70 sm:h-64 sm:w-64">
      <span className="text-7xl sm:text-8xl">👋</span>
    </div>
  );
}

/* ---------------- 1. Name workspace ---------------- */

function NameWorkspaceStep({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <StepShell
      progress={1}
      preview={<SidebarPreview workspaceName={value} highlight="canais" userName="Seu nome" />}
    >
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        Nomear o workspace da escola
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Escolha algo que sua equipe reconheça, como o nome da escola ou da rede. Você pode atualizar
        isso depois.
      </p>

      <div className="mt-8">
        <div className="relative">
          <input
            value={value}
            maxLength={50}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 w-full rounded-lg border-2 border-primary bg-card px-4 pr-16 text-base font-medium text-foreground outline-none ring-4 ring-primary/15 transition focus:ring-primary/25"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {50 - value.length}
          </span>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:brightness-110 disabled:opacity-50"
      >
        Próximo
      </button>
    </StepShell>
  );
}

/* ---------------- 2. Your name ---------------- */

function YourNameStep({
  value,
  onChange,
  workspaceName,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  workspaceName: string;
  onNext: () => void;
}) {
  return (
    <StepShell
      progress={2}
      preview={
        <SidebarPreview workspaceName={workspaceName} highlight="dm" userName={value || "Você"} />
      }
    >
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        Qual é o seu nome?
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Adicione seu nome e sua foto de perfil para que a equipe reconheça você e se conecte com
        mais facilidade.
      </p>

      <div className="mt-8">
        <div className="relative">
          <input
            value={value}
            maxLength={50}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 w-full rounded-lg border-2 border-primary bg-card px-4 pr-16 text-base font-medium text-foreground outline-none ring-4 ring-primary/15 transition focus:ring-primary/25"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {50 - value.length}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-bold text-foreground">
          Adicione uma foto <span className="font-normal text-muted-foreground">(opcional)</span>
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-2xl font-bold text-primary-foreground">
              {initials(value)}
            </div>
            <button className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:brightness-110 disabled:opacity-50"
      >
        Próximo
      </button>
    </StepShell>
  );
}

/* ---------------- 3. Invite ---------------- */

function InviteStep({
  workspaceName,
  userName,
  onNext,
}: {
  workspaceName: string;
  userName: string;
  onNext: () => void;
}) {
  const [emails, setEmails] = useState("");
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [copied, setCopied] = useState(false);
  const canNext = emails.trim().length > 0;

  return (
    <StepShell
      progress={3}
      preview={
        <SidebarPreview workspaceName={workspaceName} highlight="invite" userName={userName} />
      }
    >
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        Convide seus colegas
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        O AtlasDesk funciona melhor com mais pessoas. Adicione a secretaria, coordenação e equipe
        pedagógica.
      </p>

      <div className="mt-8 flex items-center justify-between">
        <label className="text-sm font-bold text-foreground">Adicionar colega por e-mail</label>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <GoogleIcon />
          Adicionar dos Contatos do Google
        </button>
      </div>

      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={4}
        placeholder="Ex. ana@escola.edu.br, coordenacao@escola.edu.br"
        className="mt-3 w-full rounded-lg border-2 border-primary bg-card px-4 py-3 text-sm text-foreground outline-none ring-4 ring-primary/15 transition focus:ring-primary/25"
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          disabled={!canNext}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          Próximo
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              `${window.location.origin}/onboarding?convite=${encodeURIComponent(workspaceName)}`,
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
        >
          <Link2 className="h-4 w-4" />
          {copied ? "Link copiado!" : "Copiar link de convite"}
        </button>
        <button
          onClick={() => setConfirmSkip(true)}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Ignorar esta etapa
        </button>
      </div>

      {confirmSkip && <SkipModal onCancel={() => setConfirmSkip(false)} onSkip={onNext} />}
    </StepShell>
  );
}

function SkipModal({ onCancel, onSkip }: { onCancel: () => void; onSkip: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-7 shadow-elegant">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-bold text-foreground">Pular sem convidar?</h3>
          <button
            onClick={onCancel}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Sem convidar sua equipe, você perde o que torna o AtlasDesk especial, incluindo:
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/60 text-accent-foreground">
              <MessageSquare className="h-4 w-4" />
            </span>
            Mensagens em tempo real com pais e responsáveis
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/60 text-accent-foreground">
              <Video className="h-4 w-4" />
            </span>
            Chamadas de vídeo com a coordenação
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/60 text-accent-foreground">
              <FileText className="h-4 w-4" />
            </span>
            Compartilhamento de documentos escolares
          </li>
        </ul>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-muted"
          >
            Voltar
          </button>
          <button
            onClick={onSkip}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:brightness-110"
          >
            Não convidar ninguém
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 4. Plan ---------------- */

function PlanStep({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-elegant">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-12">
            <p className="font-bold text-primary">Workspace criado 🎉</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Começar com o plano Escola +
            </h1>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <p className="font-bold text-foreground">Histórico ilimitado de chamados</p>
                  <p className="text-muted-foreground">
                    Mantenha o acesso a tickets e mensagens com mais de 90 dias.
                  </p>
                </div>
              </li>
              <PlanBullet>EduBot com IA e sugestões de resposta</PlanBullet>
              <PlanBullet>Portal do responsável com SLA</PlanBullet>
              <PlanBullet>Integrações de app ilimitadas</PlanBullet>
            </ul>

            <a
              href="#"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              Comparar planos <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <div className="mt-8 rounded-xl bg-accent/25 p-4">
              <p className="text-sm font-bold text-primary">40% de desconto*</p>
              <p className="text-lg font-bold text-foreground">R$ 209 por escola/mês</p>
              <button className="mt-3 w-full rounded-lg bg-gradient-brand px-5 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:brightness-110">
                Começar com o plano Escola +
              </button>
              <p className="mt-2 text-[11px] text-muted-foreground">
                *Oferta por tempo limitado sujeita a alterações a critério do AtlasDesk.
              </p>
            </div>

            <button
              onClick={onDone}
              className="mt-4 w-full rounded-lg border border-border bg-card px-5 py-3 text-sm font-bold text-foreground hover:bg-muted"
            >
              Continuar com o plano gratuito
            </button>
          </div>

          <div className="relative hidden bg-accent/25 md:block">
            <div className="absolute inset-0 grid place-items-center p-8">
              <div className="w-full max-w-sm rounded-xl bg-card p-4 shadow-elegant">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-1/3 rounded bg-muted" />
                        <div className="h-2 w-5/6 rounded bg-muted/70" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 rounded-lg border border-border p-2">
                  <div className="h-2 w-24 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-sm text-foreground">
      <ArrowRight className="h-4 w-4 text-primary" />
      {children}
    </li>
  );
}

/* ---------------- 5. App ---------------- */

function AppStep({ workspaceName, userName }: { workspaceName: string; userName: string }) {
  const [channels, setChannels] = useState([
    "novo-canal",
    "secretaria",
    "ti-suporte",
    "toda-a-escola",
  ]);
  const [active, setActive] = useState(channels[0]);
  const [view, setView] = useState<"channel" | "compose" | "drafts" | "activity" | "files">(
    "channel",
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [connectAppsOpen, setConnectAppsOpen] = useState(false);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [directoriesOpen, setDirectoriesOpen] = useState(false);
  const [circleActive, setCircleActive] = useState(false);
  const [favoriteChannels, setFavoriteChannels] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const { dark, toggle: toggleDark } = useDarkMode();
  const [localMessages, setLocalMessages] = useState<
    Record<
      string,
      {
        id: string;
        text: string;
        time: string;
        fileUrl?: string;
        fileName?: string;
        fileType?: string;
      }[]
    >
  >({});

  function handleSend(
    text: string,
    extra?: { fileUrl?: string; fileName?: string; fileType?: string },
  ) {
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setLocalMessages((prev) => ({
      ...prev,
      [active]: [
        ...(prev[active] ?? []),
        { id: `${Date.now()}-${Math.random()}`, text, time, ...extra },
      ],
    }));
  }

  const allFiles = Object.values(localMessages)
    .flat()
    .filter((m) => m.fileUrl);

  return (
    <div className="flex min-h-screen flex-col bg-primary text-foreground">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-primary/40 bg-primary px-4 py-2 text-primary-foreground">
        <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-1.5 text-sm">
          <Search className="h-4 w-4 opacity-80" />
          <span className="opacity-80">Pesquisar {workspaceName}</span>
        </div>
        <Link
          to="/app"
          className="hidden items-center gap-1.5 rounded-md border border-primary-foreground/25 px-2.5 py-1 text-xs font-semibold text-primary-foreground/90 hover:bg-primary-foreground/10 sm:inline-flex"
          title="Abrir o chat real (conectado por Socket.IO)"
        >
          Abrir chat real
        </Link>
        <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground text-xs font-bold">
          {initials(userName)}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Rail */}
        <aside className="hidden w-16 flex-col items-center gap-3 border-r border-primary/40 bg-primary py-4 text-primary-foreground sm:flex">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-sm font-bold">
            {initials(workspaceName, 2)}
          </div>
          <RailIcon
            icon={<Home className="h-5 w-5" />}
            label="Início"
            active={view === "channel"}
            onClick={() => setView("channel")}
          />
          <RailIcon
            icon={<MessagesSquare className="h-5 w-5" />}
            label="MDs"
            onClick={() => {
              setView("channel");
              document.getElementById("mensagens-diretas")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <RailIcon
            icon={<Bell className="h-5 w-5" />}
            label="Atividade"
            active={view === "activity"}
            onClick={() => setView("activity")}
          />
          <RailIcon
            icon={<Files className="h-5 w-5" />}
            label="Arquivos"
            active={view === "files"}
            onClick={() => setView("files")}
          />
          <div className="relative">
            <RailIcon
              icon={<MoreHorizontal className="h-5 w-5" />}
              label="Mais"
              active={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            />
            {moreOpen && <RailMoreMenu onClose={() => setMoreOpen(false)} />}
          </div>
          <div className="flex-1" />
          <RailIcon
            icon={dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            label={dark ? "Modo claro" : "Modo escuro"}
            onClick={toggleDark}
          />
          <RailIcon
            icon={<Settings className="h-5 w-5" />}
            label="Administrador"
            active={settingsOpen}
            onClick={() => setSettingsOpen(true)}
          />
          <div
            className="mt-1 grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground"
            title={userName}
          >
            {initials(userName)}
          </div>
        </aside>

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-primary/40 bg-primary/90 text-primary-foreground">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-display text-base font-bold">{workspaceName}</h2>
            <button
              onClick={() => setView("compose")}
              title="Nova mensagem"
              className="grid h-7 w-7 place-items-center rounded-md hover:bg-primary-foreground/10"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mx-3 mb-4 flex items-center gap-2 rounded-md bg-accent/20 px-3 py-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Uma oferta aguarda por você
          </div>

          <nav className="px-2 text-sm">
            <SidebarItem
              icon={<Headphones className="h-4 w-4" />}
              label="Círculos"
              onClick={() => setCircleActive(true)}
            />
            <button
              onClick={() => setView("drafts")}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left ${
                view === "drafts"
                  ? "bg-accent text-accent-foreground font-bold"
                  : "hover:bg-primary-foreground/10"
              }`}
            >
              <FileText className="h-4 w-4" />
              Rascunhos e enviados
            </button>
            <SidebarItem
              icon={<Contact className="h-4 w-4" />}
              label="Diretórios"
              onClick={() => setDirectoriesOpen(true)}
            />

            <div className="my-3 border-t border-primary-foreground/10" />

            <p className="flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
              <Star className="h-3 w-3" /> Favoritos
            </p>
            {favoriteChannels.length === 0 ? (
              <p className="px-2 pb-1 text-xs text-primary-foreground/50">
                Clique na estrela de um canal para favoritá-lo
              </p>
            ) : (
              favoriteChannels.map((c) => (
                <button
                  key={`fav-${c}`}
                  onClick={() => {
                    setActive(c);
                    setView("channel");
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left ${
                    view === "channel" && active === c
                      ? "bg-accent text-accent-foreground font-bold"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <Hash className="h-4 w-4 opacity-80" />
                  {c}
                </button>
              ))
            )}

            <div className="mt-3 flex items-center justify-between px-2">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
                Canais
              </p>
              <div className="relative">
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground/60 hover:bg-primary-foreground/10"
                >
                  <ListFilter className="h-3 w-3" />
                  Somente ativos
                  <ChevronDown className="h-3 w-3" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 top-6 z-20 w-56 rounded-lg border border-border bg-card p-1 text-foreground shadow-elegant">
                    <button className="block w-full rounded-md px-3 py-1.5 text-left text-xs font-semibold hover:bg-muted">
                      Filtrar e classificar
                    </button>
                    <button className="block w-full rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">
                      Somente ativos
                    </button>
                    <button className="block w-full rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">
                      Mensagens lidas diárias
                    </button>
                    <button className="block w-full rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">
                      Minha equipe
                    </button>
                    <button className="block w-full rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">
                      Comunicados
                    </button>
                  </div>
                )}
              </div>
            </div>
            {channels.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setActive(c);
                  setView("channel");
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left ${
                  view === "channel" && active === c
                    ? "bg-accent text-accent-foreground font-bold"
                    : "hover:bg-primary-foreground/10"
                }`}
              >
                <Hash className="h-4 w-4 opacity-80" />
                {c}
              </button>
            ))}
            <button
              onClick={() => setAddChannelOpen(true)}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10"
            >
              <Plus className="h-4 w-4" />
              Adicionar canais
            </button>

            <p
              id="mensagens-diretas"
              className="mt-4 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60"
            >
              Mensagens diretas
            </p>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <span className="grid h-5 w-5 place-items-center rounded bg-accent text-[10px] font-bold text-accent-foreground">
                {initials(userName)}
              </span>
              <span className="font-semibold">{userName}</span>
              <span className="text-xs text-primary-foreground/60">você</span>
            </div>
            <button
              onClick={() => setInviteOpen(true)}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10"
            >
              <Plus className="h-4 w-4" />
              Convidar pessoas
            </button>

            <p className="mt-4 px-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/60">
              Agentes e apps
            </p>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <span className="grid h-5 w-5 place-items-center rounded bg-gradient-brand text-[10px] font-bold text-primary-foreground">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold">Assistente IA</span>
            </div>
            <button
              onClick={() => setConnectAppsOpen(true)}
              className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10"
            >
              <Plus className="h-4 w-4" />
              Conectar apps
            </button>
          </nav>

          <div className="mx-3 mb-3 rounded-md bg-primary-foreground/5 px-3 py-2 text-xs text-primary-foreground/70">
            O AtlasDesk funciona melhor quando você o usa de forma conjunta.
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-md border border-primary-foreground/25 py-2 text-xs font-bold hover:bg-primary-foreground/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Convidar colegas de equipe
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-card text-foreground">
          {view === "compose" && (
            <ComposeView channels={channels} onClose={() => setView("channel")} />
          )}

          {view === "drafts" && <DraftsView onClose={() => setView("channel")} />}

          {view === "activity" && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h3 className="mb-3 font-display text-base font-bold">Atividade</h3>
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma atividade ainda. Menções e respostas vão aparecer aqui.
              </p>
            </div>
          )}

          {view === "files" && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h3 className="mb-3 font-display text-base font-bold">Arquivos</h3>
              {allFiles.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Nenhum arquivo compartilhado ainda. Anexos e GIFs enviados nos canais aparecem
                  aqui.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {allFiles.map((m) => (
                    <div
                      key={m.id}
                      className="overflow-hidden rounded-lg border border-border bg-card shadow-card-soft"
                    >
                      {m.fileType?.startsWith("image/") ? (
                        <img
                          src={m.fileUrl}
                          alt={m.fileName ?? ""}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-28 w-full place-items-center bg-muted/50">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="truncate p-2 text-xs font-semibold">
                        {m.fileName ?? "Arquivo"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "channel" && (
            <>
              <div className="flex items-center justify-between border-b border-border px-6 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setFavoriteChannels((prev) =>
                        prev.includes(active)
                          ? prev.filter((c) => c !== active)
                          : [...prev, active],
                      )
                    }
                    title="Favoritar"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        favoriteChannels.includes(active)
                          ? "fill-current text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  <h3 className="font-display text-base font-bold">
                    <span className="text-muted-foreground">#</span> {active}
                  </h3>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCircleActive(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-bold hover:bg-muted"
                    title="Iniciar Círculo"
                  >
                    <Headphones className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" /> Convidar colegas
                  </button>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {circleActive && (
                <div className="flex items-center justify-between border-b border-border bg-accent/15 px-6 py-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <Headphones className="h-4 w-4 text-primary" />
                    Círculo em #{active}
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {initials(userName)}
                    </span>
                  </span>
                  <button
                    onClick={() => setCircleActive(false)}
                    className="flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-bold text-destructive-foreground"
                  >
                    <PhoneOff className="h-3.5 w-3.5" /> Sair
                  </button>
                </div>
              )}

              <div className="mx-auto max-w-3xl p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <WelcomeCard title="Convide colegas" sub="Adicione toda a equipe" tone="accent" />
                  <WelcomeCard
                    title="Configure canais"
                    sub="Secretaria, TI, coordenação"
                    tone="primary-soft"
                  />
                  <WelcomeCard title="Conecte apps" sub="Sistema acadêmico, e-mail" tone="muted" />
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    Hoje
                  </span>
                </div>

                <div className="mt-6 flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-brand text-sm font-bold text-primary-foreground">
                    {initials(userName)}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">{userName}</span>{" "}
                      <span className="text-muted-foreground">agora</span>
                    </p>
                    <p className="text-sm text-muted-foreground">entrou em #{active}.</p>
                  </div>
                </div>

                {(localMessages[active] ?? []).map((m) => (
                  <div key={m.id} className="mt-4 flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-brand text-sm font-bold text-primary-foreground">
                      {initials(userName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-bold">{userName}</span>{" "}
                        <span className="text-xs text-muted-foreground">{m.time}</span>
                      </p>
                      {m.fileUrl && m.fileType?.startsWith("image/") ? (
                        <img
                          src={m.fileUrl}
                          alt={m.fileName ?? "GIF"}
                          loading="lazy"
                          className="mt-1 max-h-64 rounded-lg border border-border object-contain"
                        />
                      ) : m.fileUrl ? (
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"
                        >
                          📎 {m.fileName ?? "Arquivo anexado"}
                        </a>
                      ) : null}
                      {m.text && (
                        <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
                          {m.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <MessageComposer
                    key={active}
                    placeholder={`Enviar mensagem para #${active}`}
                    onSend={handleSend}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {settingsOpen && (
        <SettingsModal
          dark={dark}
          onToggleDark={toggleDark}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((v) => !v)}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}

      {connectAppsOpen && (
        <SimpleInfoModal
          title="Conectar apps"
          message="Em breve você vai poder conectar o AtlasDesk a outras ferramentas da escola direto por aqui."
          onClose={() => setConnectAppsOpen(false)}
        />
      )}

      {directoriesOpen && (
        <SimpleInfoModal
          title="Diretórios"
          message="Aqui vai aparecer a lista de pessoas da escola, com cargo e canais em comum. Em breve!"
          onClose={() => setDirectoriesOpen(false)}
        />
      )}

      {addChannelOpen && (
        <AddChannelModal
          onCreate={(name) => {
            const clean = name
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            if (clean && !channels.includes(clean)) {
              setChannels((prev) => [...prev, clean]);
              setActive(clean);
              setView("channel");
            }
          }}
          onClose={() => setAddChannelOpen(false)}
        />
      )}

      {/* Fixed exit */}
      <Link
        to="/"
        className="fixed bottom-4 right-4 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow-elegant hover:brightness-105"
      >
        Voltar ao site
      </Link>
    </div>
  );
}

function RailMoreMenu({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: <Keyboard className="h-4 w-4" />, label: "Atalhos de teclado" },
    { icon: <HelpCircle className="h-4 w-4" />, label: "Ajuda" },
  ];
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bottom-16 left-16 w-56 rounded-lg border border-border bg-card p-1.5 text-foreground shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it) => (
          <button
            key={it.label}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsModal({
  dark,
  onToggleDark,
  soundOn,
  onToggleSound,
  onClose,
}: {
  dark: boolean;
  onToggleDark: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-foreground shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Preferências</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-1">
          <button
            onClick={onToggleDark}
            className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2.5">
              {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Tema {dark ? "escuro" : "claro"}
            </span>
            <span
              className={`h-5 w-9 rounded-full p-0.5 transition ${dark ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-card transition ${dark ? "translate-x-4" : ""}`}
              />
            </span>
          </button>
          <button
            onClick={onToggleSound}
            className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2.5">
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Som de notificações
            </span>
            <span
              className={`h-5 w-9 rounded-full p-0.5 transition ${soundOn ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-card transition ${soundOn ? "translate-x-4" : ""}`}
              />
            </span>
          </button>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Um painel de administração completo (papéis, permissões, cobrança) ainda não existe nesta
          prévia.
        </p>
      </div>
    </div>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined" ? `${window.location.origin}/app` : "https://atlasdesk.app/app";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-foreground shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Convidar colegas de equipe</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Compartilhe este link — quem abrir entra direto no chat real do AtlasDesk.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
          <span className="flex-1 truncate">{link}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SimpleInfoModal({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-foreground shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <Puzzle className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      </div>
    </div>
  );
}

function AddChannelModal({
  onCreate,
  onClose,
}: {
  onCreate: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-foreground shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold">Criar canal</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onCreate(name.trim());
              onClose();
            }
          }}
          className="mt-4 space-y-3"
        >
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="nome-do-canal"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="w-full rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
            Criar canal
          </button>
        </form>
      </div>
    </div>
  );
}

function ComposeView({ channels, onClose }: { channels: string[]; onClose: () => void }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const suggestions = channels.slice(0, 3);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h3 className="font-display text-base font-bold">Nova mensagem</h3>
        <button
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-border px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Para:</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="#um-canal, @alguém ou alguém@exemplo.com"
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        {to.length > 0 && (
          <div className="mt-2 space-y-1 rounded-lg border border-border bg-background p-1">
            {suggestions
              .filter((c) => c.toLowerCase().includes(to.toLowerCase().replace("#", "")))
              .map((c) => (
                <button
                  key={c}
                  onClick={() => setTo(`#${c}`)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {c}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        {message.length === 0 && to.length === 0 && (
          <div className="max-w-sm text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              Fazer rascunho de uma mensagem, sem distrações
            </p>
            <p className="mt-1 text-xs">
              Aqui você pode enviar mensagens para qualquer colega ou canal.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <MessageComposer
          placeholder="Inicie uma nova mensagem"
          onChange={setMessage}
          onSend={() => onClose()}
        />
      </div>
    </div>
  );
}

function DraftsView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h3 className="font-display text-base font-bold">Rascunhos e enviados</h3>
        <button
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <FileText className="h-8 w-8 text-muted-foreground opacity-40" />
        <p className="mt-3 text-sm font-semibold">Nenhum rascunho por aqui ainda</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Mensagens que você começar a escrever e não enviar aparecem aqui, junto com o que você já
          enviou.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Message composer, emoji & GIF pickers ---------------- */
/* Now shared via src/lib/chat-ui.tsx (also used by the real chat app at /app) */

function WelcomeCard({
  title,
  sub,
  tone,
}: {
  title: string;
  sub: string;
  tone: "accent" | "primary-soft" | "muted";
}) {
  const bg =
    tone === "accent" ? "bg-accent/30" : tone === "primary-soft" ? "bg-primary/10" : "bg-muted";
  return (
    <div className={`rounded-2xl p-4 ${bg}`}>
      <p className="font-display text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      <div className="mt-4 h-16 rounded-lg bg-card/70" />
    </div>
  );
}

function RailIcon({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
        active ? "text-primary-foreground" : "text-primary-foreground/70"
      }`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-lg ${
          active ? "bg-primary-foreground/15" : "hover:bg-primary-foreground/10"
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-primary-foreground/10"
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------------- Shared shell / previews ---------------- */

function StepShell({
  progress,
  preview,
  children,
}: {
  progress: 1 | 2 | 3;
  preview: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-6xl">
        <div className="rounded-2xl bg-card shadow-elegant">
          <div className="grid md:grid-cols-[1.15fr_1fr]">
            <div className="p-8 sm:p-12">
              <div className="mb-8 flex items-center gap-2">
                <ProgressPill active={progress >= 1} />
                <ProgressPill active={progress >= 2} />
                <ProgressPill active={progress >= 3} />
              </div>
              {children}
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 rounded-r-2xl bg-gradient-to-br from-primary/95 to-primary" />
              <div className="absolute inset-0 grid place-items-center p-8">{preview}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressPill({ active }: { active?: boolean }) {
  return <span className={`h-1.5 w-12 rounded-full ${active ? "bg-primary" : "bg-muted"}`} />;
}

function SidebarPreview({
  workspaceName,
  highlight,
  userName,
}: {
  workspaceName: string;
  highlight: "canais" | "dm" | "invite";
  userName: string;
}) {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-xl bg-primary/80 text-primary-foreground shadow-elegant">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="grid h-7 w-7 place-items-center rounded bg-accent text-[10px] font-bold text-accent-foreground">
          {initials(workspaceName, 2)}
        </div>
        <div className="text-sm font-bold">{workspaceName || "Sua escola"}</div>
      </div>
      <div className="px-3 pb-3 text-xs">
        <div className="mt-2 space-y-1 opacity-90">
          <p>Não lidas</p>
          <p>Conversas</p>
        </div>
        <p className="mt-3 font-bold">Canais</p>
        <p className={`ml-2 ${highlight === "canais" ? "font-bold text-accent" : ""}`}>
          # novo-canal
        </p>
        <p className="ml-2">+ Adicionar canais</p>
        <p className="mt-3 font-bold">Mensagens diretas</p>
        <p className={`ml-2 ${highlight === "dm" ? "font-bold text-accent" : ""}`}>
          {userName} <span className="opacity-70">você</span>
        </p>
        <p className={`ml-2 ${highlight === "invite" ? "font-bold text-accent" : ""}`}>
          Seu colega de equipe
        </p>
        <p className="ml-2 opacity-70">+ Adicionar colegas</p>
      </div>
      <div className="border-t border-primary-foreground/15 bg-card p-3 text-xs text-foreground">
        <p className="text-muted-foreground">Enviar mensagem</p>
      </div>
    </div>
  );
}

function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src="/brand/atlasdesk-icon.png"
      alt="AtlasDesk"
      className={`${className} object-contain`}
    />
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
