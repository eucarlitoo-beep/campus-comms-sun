import { CHAT_SERVER_URL } from "./api";

export interface GifResult {
  id: string;
  title: string;
  previewUrl: string;
  url: string;
  width: number;
  height: number;
}

export interface GifCategory {
  name: string;
  previewUrl: string | null;
}

interface GifPage {
  provider: string | null;
  results: GifResult[];
  next: string | null;
}

/* ---------------------------------------------------------------- */
/* Cache em memória (client-side)                                    */
/* ---------------------------------------------------------------- */
/* Sobrevive enquanto a aba estiver aberta (é um Map fora do React),  */
/* então reabrir o seletor de GIF ou repetir uma busca não bate na    */
/* rede de novo dentro da janela de alguns minutos.                  */

const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;
const clientCache = new Map<string, { at: number; value: GifPage }>();

function cacheGet(key: string): GifPage | null {
  const hit = clientCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CLIENT_CACHE_TTL_MS) {
    clientCache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key: string, value: GifPage) {
  clientCache.set(key, { at: Date.now(), value });
}

async function request(path: string): Promise<GifPage> {
  const res = await fetch(`${CHAT_SERVER_URL}${path}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      json?.error ||
        "Não foi possível carregar GIFs agora. Confira se o servidor de chat está rodando.",
    );
  }
  return json;
}

export const gifsApi = {
  status: () => fetch(`${CHAT_SERVER_URL}/api/gifs/status`).then((r) => r.json()),

  trending: async (pos?: string): Promise<GifPage> => {
    const key = `trending:${pos ?? ""}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const page = await request(`/api/gifs/trending${pos ? `?pos=${encodeURIComponent(pos)}` : ""}`);
    cacheSet(key, page);
    return page;
  },

  search: async (query: string, pos?: string): Promise<GifPage> => {
    const key = `search:${query.toLowerCase()}:${pos ?? ""}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const params = new URLSearchParams({ query });
    if (pos) params.set("pos", pos);
    const page = await request(`/api/gifs/search?${params.toString()}`);
    cacheSet(key, page);
    return page;
  },

  categories: async (): Promise<GifCategory[]> => {
    const key = "categories";
    const cachedRaw = clientCache.get(key);
    if (cachedRaw && Date.now() - cachedRaw.at < CLIENT_CACHE_TTL_MS) {
      return (cachedRaw.value as unknown as { categories: GifCategory[] }).categories;
    }
    const res = await fetch(`${CHAT_SERVER_URL}/api/gifs/categories`);
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Não foi possível carregar categorias.");
    clientCache.set(key, { at: Date.now(), value: json as unknown as GifPage });
    return json.categories as GifCategory[];
  },
};

/* ---------------------------------------------------------------- */
/* Favoritos (guardados no navegador — não há contas de verdade      */
/* ainda no produto, então isso é por dispositivo, não por pessoa)   */
/* ---------------------------------------------------------------- */

const FAVORITES_KEY = "atlasdesk_gif_favorites";

export function getFavoriteGifs(): GifResult[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as GifResult[]) : [];
  } catch {
    return [];
  }
}

export function isFavoriteGif(id: string): boolean {
  return getFavoriteGifs().some((g) => g.id === id);
}

export function toggleFavoriteGif(gif: GifResult): GifResult[] {
  const current = getFavoriteGifs();
  const exists = current.some((g) => g.id === gif.id);
  const next = exists ? current.filter((g) => g.id !== gif.id) : [gif, ...current].slice(0, 60);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}
