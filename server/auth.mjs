/**
 * Verificação de login — Supabase Auth
 * --------------------------------------
 * O front-end faz login/cadastro direto com o Supabase (e-mail + senha,
 * ou Google). O que ele recebe de volta é um "access token" (um JWT).
 * Esse token é enviado ao nosso servidor em cada requisição — aqui a
 * gente verifica se ele é válido e descobre de quem é.
 */

import { supabaseAdmin, isDatabaseConfigured } from "./db.mjs";

export async function verifyToken(token) {
  if (!token || !isDatabaseConfigured) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user; // { id, email, user_metadata, ... }
}

/** Middleware Express: exige um "Authorization: Bearer <token>" válido. */
export function requireAuth() {
  return async (req, res, next) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ error: "Não autenticado." });
    req.authUser = user;
    next();
  };
}
