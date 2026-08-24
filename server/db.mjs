/**
 * Camada de persistência — Supabase (PostgreSQL)
 * -------------------------------------------------
 * Troca o antigo "arquivo JSON na pasta do servidor" por um banco de
 * dados de verdade. Usa a "service role key" do Supabase — uma chave
 * secreta que só existe aqui no servidor (nunca no navegador) e que
 * ignora as políticas de RLS, então o servidor tem acesso total.
 *
 * Todas as funções aqui devolvem os dados já no formato "camelCase" que
 * o resto do servidor (e o front-end) já espera — assim o resto do
 * código quase não precisou mudar.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isDatabaseConfigured = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export const supabaseAdmin = isDatabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

function assertConfigured() {
  if (!isDatabaseConfigured) {
    throw new Error(
      "Banco de dados não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em server/.env — veja server/README.md.",
    );
  }
}

/* ---------------- Perfis / usuários ---------------- */

function mapProfile(row) {
  return {
    id: row.id,
    name: row.name,
    avatarColor: row.avatar_color,
    online: row.online,
    lastSeen: new Date(row.last_seen).getTime(),
  };
}

export async function getProfile(userId) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

export async function listProfiles() {
  assertConfigured();
  const { data, error } = await supabaseAdmin.from("profiles").select("*");
  if (error) throw error;
  return (data ?? []).map(mapProfile);
}

export async function setProfileOnline(userId, online) {
  assertConfigured();
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ online, last_seen: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

/* ---------------- Canais ---------------- */

function mapChannel(row, memberIds = []) {
  return {
    id: row.id,
    name: row.name,
    isPrivate: row.is_private,
    memberIds,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function listChannels() {
  assertConfigured();
  const [{ data: channels, error: chErr }, { data: members, error: memErr }] = await Promise.all([
    supabaseAdmin.from("channels").select("*"),
    supabaseAdmin.from("channel_members").select("*"),
  ]);
  if (chErr) throw chErr;
  if (memErr) throw memErr;
  const membersByChannel = new Map();
  for (const m of members ?? []) {
    if (!membersByChannel.has(m.channel_id)) membersByChannel.set(m.channel_id, []);
    membersByChannel.get(m.channel_id).push(m.user_id);
  }
  return (channels ?? []).map((c) => mapChannel(c, membersByChannel.get(c.id) ?? []));
}

export async function getChannel(id) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("channels")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: members } = await supabaseAdmin
    .from("channel_members")
    .select("user_id")
    .eq("channel_id", id);
  return mapChannel(
    data,
    (members ?? []).map((m) => m.user_id),
  );
}

export async function createChannel({ id, name, isPrivate, userId }) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("channels")
    .insert({ id, name, is_private: !!isPrivate })
    .select()
    .single();
  if (error) throw error;
  if (userId) await addChannelMember(id, userId);
  return getChannel(id);
}

export async function renameChannel(id, name) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("channels")
    .update({ name })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return getChannel(id);
}

export async function addChannelMember(channelId, userId) {
  assertConfigured();
  const { error } = await supabaseAdmin
    .from("channel_members")
    .upsert({ channel_id: channelId, user_id: userId }, { onConflict: "channel_id,user_id" });
  if (error) throw error;
}

/* ---------------- DMs ---------------- */

function dmIdFor(userA, userB) {
  return [userA, userB].sort().join("__");
}

function mapDm(row) {
  return {
    id: row.id,
    memberIds: [row.user_a, row.user_b],
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function getOrCreateDm(userA, userB) {
  assertConfigured();
  const id = dmIdFor(userA, userB);
  const { data: existing, error: findErr } = await supabaseAdmin
    .from("dms")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return mapDm(existing);

  const [a, b] = [userA, userB].sort();
  const { data, error } = await supabaseAdmin
    .from("dms")
    .insert({ id, user_a: a, user_b: b })
    .select()
    .single();
  if (error) throw error;
  return mapDm(data);
}

export async function listDmsForUser(userId) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("dms")
    .select("*")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);
  if (error) throw error;
  return (data ?? []).map(mapDm);
}

/* ---------------- Mensagens ---------------- */

function mapMessage(row) {
  return {
    id: row.id,
    roomId: row.room_id,
    roomType: row.room_type,
    authorId: row.author_id,
    text: row.text,
    fileUrl: row.file_url,
    fileName: row.file_name,
    fileType: row.file_type,
    parentId: row.parent_id,
    mentions: row.mentions ?? [],
    replyCount: row.reply_count ?? 0,
    lastReplyAt: row.last_reply_at ? new Date(row.last_reply_at).getTime() : undefined,
    createdAt: new Date(row.created_at).getTime(),
    editedAt: row.edited_at ? new Date(row.edited_at).getTime() : null,
    reactions: row.reactions ?? {},
    readBy: row.read_by ?? [],
  };
}

export async function getMessages(roomType, roomId, { before, limit = 50 } = {}) {
  assertConfigured();
  let q = supabaseAdmin
    .from("messages")
    .select("*")
    .eq("room_type", roomType)
    .eq("room_id", roomId)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (before) q = q.lt("created_at", new Date(Number(before)).toISOString());
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapMessage).reverse();
}

export async function getThread(parentId) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export async function searchMessages(query, { roomId, roomType, userId } = {}) {
  assertConfigured();
  let q = supabaseAdmin.from("messages").select("*").ilike("text", `%${query}%`);
  if (roomId) q = q.eq("room_id", roomId);
  if (roomType) q = q.eq("room_type", roomType);
  q = q.order("created_at", { ascending: false }).limit(60);
  const { data, error } = await q;
  if (error) throw error;
  let list = (data ?? []).map(mapMessage);

  if (userId) {
    const myDms = await listDmsForUser(userId);
    const myDmIds = new Set(myDms.map((d) => d.id));
    list = list.filter((m) => m.roomType === "channel" || myDmIds.has(m.roomId));
  }
  return list.slice(0, 30);
}

export async function createMessage({
  id,
  roomId,
  roomType,
  authorId,
  text,
  fileUrl,
  fileName,
  fileType,
  parentId,
  mentions,
}) {
  assertConfigured();
  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert({
      id,
      room_id: roomId,
      room_type: roomType,
      author_id: authorId,
      text: text ?? "",
      file_url: fileUrl ?? null,
      file_name: fileName ?? null,
      file_type: fileType ?? null,
      parent_id: parentId ?? null,
      mentions: mentions ?? [],
      read_by: [authorId],
    })
    .select()
    .single();
  if (error) throw error;

  let parent = null;
  if (parentId) {
    const { data: parentRow } = await supabaseAdmin
      .from("messages")
      .select("reply_count")
      .eq("id", parentId)
      .maybeSingle();
    if (parentRow) {
      const { data: updated } = await supabaseAdmin
        .from("messages")
        .update({
          reply_count: (parentRow.reply_count ?? 0) + 1,
          last_reply_at: new Date().toISOString(),
        })
        .eq("id", parentId)
        .select()
        .single();
      parent = updated ? mapMessage(updated) : null;
    }
  }

  return { message: mapMessage(data), parent };
}

export async function markMessageRead(messageId, userId) {
  assertConfigured();
  const { data: row, error: findErr } = await supabaseAdmin
    .from("messages")
    .select("read_by")
    .eq("id", messageId)
    .maybeSingle();
  if (findErr) throw findErr;
  if (!row) return null;
  const readBy = row.read_by ?? [];
  if (readBy.includes(userId)) return readBy;
  const next = [...readBy, userId];
  const { error } = await supabaseAdmin
    .from("messages")
    .update({ read_by: next })
    .eq("id", messageId);
  if (error) throw error;
  return next;
}

export async function toggleReaction(messageId, emoji, userId) {
  assertConfigured();
  const { data: row, error: findErr } = await supabaseAdmin
    .from("messages")
    .select("reactions")
    .eq("id", messageId)
    .maybeSingle();
  if (findErr) throw findErr;
  if (!row) return null;
  const reactions = { ...(row.reactions ?? {}) };
  const set = new Set(reactions[emoji] ?? []);
  if (set.has(userId)) set.delete(userId);
  else set.add(userId);
  if (set.size === 0) delete reactions[emoji];
  else reactions[emoji] = [...set];
  const { error } = await supabaseAdmin.from("messages").update({ reactions }).eq("id", messageId);
  if (error) throw error;
  return reactions;
}
