import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Apple, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/site-chrome";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — EduDesk Helpdesk Escolar" },
      {
        name: "description",
        content: "Acesse o espaço da sua escola no EduDesk para acompanhar canais e chamados de suporte.",
      },
      { property: "og:title", content: "Entrar — EduDesk Helpdesk Escolar" },
      { property: "og:description", content: "Acesse o espaço da sua escola no EduDesk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.1 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9c4.4-4.1 6.6-10.1 6.6-17.5z" />
      <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 019.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 000 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.5-5.9l-7.6-5.9c-2 1.4-4.7 2.4-7.9 2.4-6.4 0-11.7-3.6-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
      });
      if (err) setError(err.message);
      else if (data.session) navigate({ to: "/app" });
      else setMessage("Confira seu e-mail para confirmar a conta e depois entre por aqui.");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError("E-mail ou senha inválidos.");
      else navigate({ to: "/app" });
    }
    setLoading(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setError("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  }

  async function apple() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin });
    if (result.error) {
      setError("Não foi possível entrar com a Apple.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-xl font-bold">EduDesk</span>
        </Link>

        <h1 className="mt-10 text-center text-3xl font-bold sm:text-4xl">
          {mode === "signin" ? "Entre no espaço da sua escola" : "Crie sua conta EduDesk"}
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Sugerimos usar o <strong>e-mail institucional</strong> que você já utiliza na escola.
        </p>

        <form onSubmit={submit} className="mt-8 w-full space-y-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@escola.com.br"
            required
            className="w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            minLength={6}
            className="w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-elegant disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Entrar" : "Continuar"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
        {message && <p className="mt-3 text-sm font-semibold text-primary">{message}</p>}

        <div className="my-6 flex w-full items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> Outras opções <span className="h-px flex-1 bg-border" />
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={google}
            className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            <GoogleIcon /> Entrar com o Google
          </button>
          <button
            onClick={apple}
            className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            <Apple className="h-5 w-5" /> Entrar com a Apple
          </button>
        </div>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-8 text-sm text-muted-foreground"
        >
          {mode === "signin" ? (
            <>
              Ainda não tem conta? <span className="font-semibold text-primary">Criar espaço da escola</span>
            </>
          ) : (
            <>
              Já tem conta? <span className="font-semibold text-primary">Entrar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
