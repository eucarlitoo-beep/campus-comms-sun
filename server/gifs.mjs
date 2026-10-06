/**
 * Provedores de GIF (Tenor + GIPHY)
 * -----------------------------------
 * Módulo isolado que fala com o Tenor (preferencial) e cai para o GIPHY se o
 * Tenor não estiver configurado. Normaliza os dois formatos de resposta num
 * único formato usado pelo front-end, e cacheia tudo em memória por alguns
 * minutos pra não bater na API de novo a cada busca repetida.
 *
 * Configuração (server/.env, veja server/.env.example):
 *   TENOR_API_KEY=...   (preferencial — https://developers.google.com/tenor)
 *   GIPHY_API_KEY=...   (alternativa  — https://developers.giphy.com/dashboard)
 *
 * Sem nenhuma das duas, os endpoints respondem 501 com uma mensagem clara —
 * o front-end mostra essa mensagem no lugar dos GIFs, em vez de falhar
 * silenciosamente.
 */

import express from "express";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos
const cache = new Map(); // key -> { at, value }

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value) {
  cache.set(key, { at: Date.now(), value });
  // evita crescer pra sempre em processos de longa duração
  if (cache.size > 500) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

function activeProvider() {
  if (process.env.TENOR_API_KEY) return "tenor";
  if (process.env.GIPHY_API_KEY) return "giphy";
  return null;
}

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("O provedor de GIF demorou demais para responder. Tente de novo.");
    }
    throw new Error("Não foi possível contactar o provedor de GIF agora.");
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- Tenor (v2) ---------------- */

async function tenorRequest(path, params) {
  const url = new URL(`https://tenor.googleapis.com/v2/${path}`);
  url.searchParams.set("key", process.env.TENOR_API_KEY);
  url.searchParams.set("client_key", "atlasdesk_chat");
  url.searchParams.set("locale", "pt_BR");
  url.searchParams.set("contentfilter", "medium");
  url.searchParams.set("media_filter", "tinygif,gif");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetchWithTimeout(url);
  const json = await safeJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Tenor respondeu ${res.status}`);
  }
  return json;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    throw new Error(`O provedor de GIF respondeu de forma inesperada (status ${res.status}).`);
  }
}

function normalizeTenorItem(item) {
  const full = item.media_formats?.gif;
  const preview = item.media_formats?.tinygif ?? full;
  return {
    id: item.id,
    title: item.content_description || "GIF",
    previewUrl: preview?.url,
    url: full?.url ?? preview?.url,
    width: full?.dims?.[0] ?? preview?.dims?.[0] ?? 220,
    height: full?.dims?.[1] ?? preview?.dims?.[1] ?? 220,
  };
}

async function tenorTrending({ limit, pos }) {
  const json = await tenorRequest("featured", { limit, pos });
  return { results: json.results.map(normalizeTenorItem), next: json.next || null };
}

async function tenorSearch({ query, limit, pos }) {
  const json = await tenorRequest("search", { q: query, limit, pos });
  return { results: json.results.map(normalizeTenorItem), next: json.next || null };
}

async function tenorCategories() {
  const url = new URL("https://tenor.googleapis.com/v2/categories");
  url.searchParams.set("key", process.env.TENOR_API_KEY);
  url.searchParams.set("client_key", "atlasdesk_chat");
  url.searchParams.set("locale", "pt_BR");
  url.searchParams.set("type", "trending");
  const res = await fetchWithTimeout(url);
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json?.error?.message || `Tenor respondeu ${res.status}`);
  return (json.tags || []).map((t) => ({
    name: t.searchterm,
    previewUrl: t.image,
  }));
}

/* ---------------- GIPHY (v1, fallback) ---------------- */

async function giphyRequest(path, params) {
  const url = new URL(`https://api.giphy.com/v1/gifs/${path}`);
  url.searchParams.set("api_key", process.env.GIPHY_API_KEY);
  url.searchParams.set("rating", "pg");
  url.searchParams.set("lang", "pt");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetchWithTimeout(url);
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json?.meta?.msg || `GIPHY respondeu ${res.status}`);
  return json;
}

function normalizeGiphyItem(item) {
  const full = item.images.fixed_height;
  const preview = item.images.fixed_height_small ?? full;
  return {
    id: item.id,
    title: item.title || "GIF",
    previewUrl: preview.url,
    url: full.url,
    width: Number(full.width),
    height: Number(full.height),
  };
}

async function giphyTrending({ limit, pos }) {
  const json = await giphyRequest("trending", { limit, offset: pos });
  return {
    results: json.data.map(normalizeGiphyItem),
    next: json.pagination ? String((Number(pos) || 0) + json.data.length) : null,
  };
}

async function giphySearch({ query, limit, pos }) {
  const json = await giphyRequest("search", { q: query, limit, offset: pos });
  return {
    results: json.data.map(normalizeGiphyItem),
    next: json.pagination ? String((Number(pos) || 0) + json.data.length) : null,
  };
}

async function giphyCategories() {
  // GIPHY não tem um endpoint de "categorias em alta" tão direto quanto o
  // Tenor — usamos uma lista curta de termos populares como categorias.
  const terms = ["bom dia", "parabéns", "obrigado", "risada", "aplausos", "aniversário"];
  return terms.map((name) => ({ name, previewUrl: null }));
}

/* ---------------- Router ---------------- */

export const gifsRouter = express.Router();

gifsRouter.get("/status", (_req, res) => {
  res.json({ provider: activeProvider() });
});

gifsRouter.get("/trending", async (req, res) => {
  const provider = activeProvider();
  if (!provider) return res.status(501).json(noProviderError());
  const { limit = 24, pos } = req.query;
  const cacheKey = `trending:${provider}:${limit}:${pos ?? ""}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });
  try {
    const data =
      provider === "tenor"
        ? await tenorTrending({ limit, pos })
        : await giphyTrending({ limit, pos });
    const payload = { provider, ...data };
    setCached(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    res.status(502).json({ error: err.message || "Falha ao buscar GIFs em alta." });
  }
});

gifsRouter.get("/search", async (req, res) => {
  const provider = activeProvider();
  if (!provider) return res.status(501).json(noProviderError());
  const { query = "", limit = 24, pos } = req.query;
  if (!String(query).trim()) return res.json({ provider, results: [], next: null });
  const cacheKey = `search:${provider}:${query}:${limit}:${pos ?? ""}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });
  try {
    const data =
      provider === "tenor"
        ? await tenorSearch({ query, limit, pos })
        : await giphySearch({ query, limit, pos });
    const payload = { provider, ...data };
    setCached(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    res.status(502).json({ error: err.message || "Falha ao pesquisar GIFs." });
  }
});

gifsRouter.get("/categories", async (_req, res) => {
  const provider = activeProvider();
  if (!provider) return res.status(501).json(noProviderError());
  const cacheKey = `categories:${provider}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ provider, categories: cached, cached: true });
  try {
    const categories = provider === "tenor" ? await tenorCategories() : await giphyCategories();
    setCached(cacheKey, categories);
    res.json({ provider, categories });
  } catch (err) {
    res.status(502).json({ error: err.message || "Falha ao buscar categorias." });
  }
});

function noProviderError() {
  return {
    error:
      "Nenhum provedor de GIF configurado. Defina TENOR_API_KEY (preferencial) ou GIPHY_API_KEY em server/.env — veja server/.env.example.",
  };
}
