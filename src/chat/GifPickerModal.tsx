import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Heart, Flame, Grid3x3, Star, Loader2, Send, AlertTriangle } from "lucide-react";
import {
  gifsApi,
  getFavoriteGifs,
  toggleFavoriteGif,
  type GifResult,
  type GifCategory,
} from "./gifs";

type Tab = "trending" | "categories" | "favorites";

export function GifPickerModal({
  onPick,
  onClose,
}: {
  onPick: (gif: GifResult) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("trending");
  const [results, setResults] = useState<GifResult[]>([]);
  const [nextPos, setNextPos] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [categories, setCategories] = useState<GifCategory[]>([]);
  const [favorites, setFavorites] = useState<GifResult[]>(() => getFavoriteGifs());
  const [previewGif, setPreviewGif] = useState<GifResult | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  const isSearching = query.trim().length > 0;

  /* -------- busca em tempo real (com debounce) + tendências -------- */

  useEffect(() => {
    if (tab === "favorites") return;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    const t = setTimeout(
      async () => {
        try {
          const page = isSearching ? await gifsApi.search(query.trim()) : await gifsApi.trending();
          if (requestId.current !== id) return;
          setResults(page.results);
          setNextPos(page.next);
          setProvider(page.provider);
        } catch (err) {
          if (requestId.current !== id) return;
          setError(err instanceof Error ? err.message : "Falha ao carregar GIFs.");
          setResults([]);
          setNextPos(null);
        } finally {
          if (requestId.current === id) setLoading(false);
        }
      },
      isSearching ? 350 : 0,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tab]);

  useEffect(() => {
    if (tab !== "categories" || categories.length > 0) return;
    gifsApi
      .categories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [tab, categories.length]);

  /* -------- scroll infinito (lazy loading de páginas) -------- */

  async function loadMore() {
    if (!nextPos || loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const page = isSearching
        ? await gifsApi.search(query.trim(), nextPos)
        : await gifsApi.trending(nextPos);
      setResults((prev) => [...prev, ...page.results]);
      setNextPos(page.next);
    } catch {
      /* silencioso: o usuário já tem resultados na tela */
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || tab === "favorites") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, nextPos, loadingMore, loading, tab, isSearching, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (previewGif) setPreviewGif(null);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, previewGif]);

  function refreshFavorites() {
    setFavorites(getFavoriteGifs());
  }

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  const gridItems = tab === "favorites" ? favorites : results;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[32rem] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: busca */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar GIFs (ex: bom dia)"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs: só fazem sentido quando não está pesquisando por texto */}
        {!isSearching && (
          <div className="flex border-b border-border text-xs font-semibold">
            <TabButton
              icon={<Flame className="h-3.5 w-3.5" />}
              label="Em alta"
              active={tab === "trending"}
              onClick={() => setTab("trending")}
            />
            <TabButton
              icon={<Grid3x3 className="h-3.5 w-3.5" />}
              label="Categorias"
              active={tab === "categories"}
              onClick={() => setTab("categories")}
            />
            <TabButton
              icon={<Heart className="h-3.5 w-3.5" />}
              label="Favoritos"
              active={tab === "favorites"}
              onClick={() => {
                refreshFavorites();
                setTab("favorites");
              }}
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-2">
          {tab === "categories" && !isSearching ? (
            <div className="grid grid-cols-2 gap-2">
              {categories.length === 0 && (
                <p className="col-span-2 py-8 text-center text-xs text-muted-foreground">
                  Carregando categorias…
                </p>
              )}
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setQuery(c.name)}
                  className="relative h-20 overflow-hidden rounded-md border border-border bg-muted/40 hover:opacity-90"
                >
                  {c.previewUrl && (
                    <img
                      src={c.previewUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-1.5 text-left text-[11px] font-bold capitalize text-white">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              {loading && (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-xs text-muted-foreground">
                  <AlertTriangle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {!loading && !error && tab === "favorites" && gridItems.length === 0 && (
                <p className="px-4 py-10 text-center text-xs text-muted-foreground">
                  Toque na estrela de um GIF para favoritá-lo. Eles aparecem aqui.
                </p>
              )}

              {!loading && !error && tab !== "favorites" && gridItems.length === 0 && (
                <p className="px-4 py-10 text-center text-xs text-muted-foreground">
                  Nenhum GIF encontrado{isSearching ? ` para "${query}"` : ""}.
                </p>
              )}

              {!loading && !error && gridItems.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5">
                  {gridItems.map((gif) => (
                    <div
                      key={gif.id}
                      className="group relative overflow-hidden rounded-md border border-border bg-muted/40"
                    >
                      <button
                        onClick={() => setPreviewGif(gif)}
                        className="block h-24 w-full"
                        title={gif.title}
                      >
                        <img
                          src={gif.previewUrl}
                          alt={gif.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:opacity-80"
                        />
                      </button>
                      <button
                        onClick={() => {
                          toggleFavoriteGif(gif);
                          refreshFavorites();
                        }}
                        title="Favoritar"
                        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${favoriteIds.has(gif.id) ? "fill-current text-red-400" : ""}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tab !== "favorites" && <div ref={sentinelRef} className="h-6" />}
              {loadingMore && (
                <div className="flex items-center justify-center py-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border px-3 py-1.5 text-right text-[10px] text-muted-foreground">
          {provider === "tenor"
            ? "Fornecido por Tenor"
            : provider === "giphy"
              ? "Fornecido por GIPHY"
              : "GIFs"}
        </div>
      </div>

      {/* Pré-visualização antes de enviar */}
      {previewGif && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewGif(null)}
        >
          <div
            className="w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewGif.url}
              alt={previewGif.title}
              className="max-h-72 w-full object-contain bg-black/5"
            />
            <div className="flex items-center justify-between gap-2 p-3">
              <button
                onClick={() => {
                  toggleFavoriteGif(previewGif);
                  refreshFavorites();
                }}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                title="Favoritar"
              >
                <Star
                  className={`h-4 w-4 ${favoriteIds.has(previewGif.id) ? "fill-current text-amber-400" : ""}`}
                />
              </button>
              <div className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => setPreviewGif(null)}
                  className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-bold hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onPick(previewGif);
                    setPreviewGif(null);
                    onClose();
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                >
                  <Send className="h-3.5 w-3.5" />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
