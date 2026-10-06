import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do navegador — usa a chave pública ("anon key"), que é
 * segura de expor no front-end (o Supabase usa RLS + essa chave só permite
 * o que as políticas do banco autorizarem). Usado só para login/cadastro;
 * os dados do chat em si continuam passando pelo nosso servidor.
 */

const env = (import.meta as unknown as { env?: Record<string, string> }).env;

const SUPABASE_URL = env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : null;
