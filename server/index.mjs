/**
 * AtlasDesk — servidor de chat em tempo real
 * -------------------------------------------
 * Express (REST) + Socket.IO (tempo real) + Supabase (PostgreSQL + Auth).
 *
 * IMPORTANTE: este servidor roda separado do site. O site (TanStack Start)
 * é publicado na Cloudflare (Workers), que não suporta um processo Node
 * contínuo com Socket.IO. Este servidor precisa rodar em outro lugar:
 * localmente (`npm run dev`), ou hospedado em Render/Railway/Fly.io/VPS.
 *
 * Login/cadastro de verdade: feito pelo Supabase Auth (e-mail + senha, ou
 * Google). O front-end conversa direto com o Supabase pra entrar/cadastrar,
 * e manda o "token" resultante pra esse servidor em cada ação — aqui a
 * gente verifica esse token (server/auth.mjs) antes de fazer qualquer coisa
 * em nome de alguém.
 *
 * Sem SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY configurados em server/.env,
 * o servidor sobe normalmente mas todas as rotas que dependem do banco
 * respondem com um erro claro, em vez de travar — veja server/README.md.
 */

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gifsRouter } from "./gifs.mjs";
import { isDatabaseConfigured } from "./db.mjs";
import * as db from "./db.mjs";
import { verifyToken, requireAuth } from "./auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "uploads");
const PORT = process.env.PORT || 4000;

try {
  const envRaw = fs.readFileSync(path.join(__dirname, ".env"), "utf-8");
  for (const line of envRaw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* server/.env é opcional (mas sem ele, banco de dados e GIFs ficam desativados) */
}

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (!isDatabaseConfigured) {
  console.warn(
    "⚠ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados — o chat vai subir, mas " +
      "login, canais, mensagens etc. vão falhar até você configurar server/.env. Veja server/README.md.",
  );
}

function parseMentions(text, profiles) {
  const names = [...text.matchAll(/@([a-zA-Z0-9._-]+(?:\s[a-zA-Z0-9._-]+)?)/g)].map((m) => m[1]);
  const mentioned = [];
  for (const n of names) {
    for (const u of profiles) {
      if (
        u.name.toLowerCase() === n.toLowerCase() ||
        u.name.toLowerCase().startsWith(n.toLowerCase())
      ) {
        if (!mentioned.includes(u.id)) mentioned.push(u.id);
      }
    }
  }
  return mentioned;
}

function roomKey(roomType, roomId) {
  return `${roomType}:${roomId}`;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req, res) => res.json({ ok: true, database: isDatabaseConfigured }));
app.use("/api/gifs", gifsRouter);

function handleDbError(res, err) {
  console.error(err);
  res.status(503).json({ error: err.message || "Erro ao acessar o banco de dados." });
}

app.get("/api/me", requireAuth(), async (req, res) => {
  try {
    const profile = await db.getProfile(req.authUser.id);
    if (!profile) {
      return res
        .status(404)
        .json({ error: "Perfil ainda não criado. Tente novamente em instantes." });
    }
    res.json({ user: profile });
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/users", requireAuth(), async (_req, res) => {
  try {
    res.json(await db.listProfiles());
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/channels", requireAuth(), async (_req, res) => {
  try {
    res.json(await db.listChannels());
  } catch (err) {
    handleDbError(res, err);
  }
});

app.post("/api/channels", requireAuth(), async (req, res) => {
  try {
    const { name, isPrivate } = req.body ?? {};
    if (!name || !name.trim())
      return res.status(400).json({ error: "Nome do canal é obrigatório." });
    const id = name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const existing = await db.getChannel(id);
    if (existing) return res.status(409).json({ error: "Já existe um canal com esse nome." });
    const channel = await db.createChannel({
      id,
      name: id,
      isPrivate: !!isPrivate,
      userId: req.authUser.id,
    });
    io.emit("channel:new", channel);
    res.status(201).json(channel);
  } catch (err) {
    handleDbError(res, err);
  }
});

app.patch("/api/channels/:id", requireAuth(), async (req, res) => {
  try {
    const { name } = req.body ?? {};
    if (typeof name !== "string" || !name.trim())
      return res.status(400).json({ error: "Nome inválido." });
    const channel = await db.renameChannel(req.params.id, name.trim());
    if (!channel) return res.status(404).json({ error: "Canal não encontrado." });
    io.emit("channel:updated", channel);
    res.json(channel);
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/dms", requireAuth(), async (req, res) => {
  try {
    res.json(await db.listDmsForUser(req.authUser.id));
  } catch (err) {
    handleDbError(res, err);
  }
});

app.post("/api/dms", requireAuth(), async (req, res) => {
  try {
    const { otherUserId } = req.body ?? {};
    if (!otherUserId) return res.status(400).json({ error: "otherUserId é obrigatório." });
    res.status(201).json(await db.getOrCreateDm(req.authUser.id, otherUserId));
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/messages", requireAuth(), async (req, res) => {
  try {
    const { roomId, roomType, before, limit } = req.query;
    if (!roomId || !roomType)
      return res.status(400).json({ error: "roomId e roomType são obrigatórios." });
    res.json(await db.getMessages(roomType, roomId, { before, limit: Number(limit) || 50 }));
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/threads/:parentId", requireAuth(), async (req, res) => {
  try {
    res.json(await db.getThread(req.params.parentId));
  } catch (err) {
    handleDbError(res, err);
  }
});

app.get("/api/search", requireAuth(), async (req, res) => {
  try {
    const { query, roomId, roomType } = req.query;
    if (!query || query.trim().length < 2) return res.json([]);
    res.json(await db.searchMessages(query, { roomId, roomType, userId: req.authUser.id }));
  } catch (err) {
    handleDbError(res, err);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${nanoid(12)}${ext}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
});

app.post("/api/upload", requireAuth(), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const socketUser = new Map();
const userSockets = new Map();
const typingState = new Map();
const circleMembers = new Map();

function circleKey(roomType, roomId) {
  return `circle:${roomType}:${roomId}`;
}

io.on("connection", (socket) => {
  socket.on("identify", async ({ token }) => {
    const authUser = await verifyToken(token);
    if (!authUser) {
      socket.emit("identify:error", { error: "Sessão inválida ou expirada. Faça login de novo." });
      return;
    }
    let profile = await db.getProfile(authUser.id).catch(() => null);
    if (!profile) {
      socket.emit("identify:error", {
        error: "Perfil ainda não foi criado. Tente novamente em instantes.",
      });
      return;
    }

    socketUser.set(socket.id, profile.id);
    if (!userSockets.has(profile.id)) userSockets.set(profile.id, new Set());
    userSockets.get(profile.id).add(socket.id);

    await db.setProfileOnline(profile.id, true).catch(() => {});

    try {
      const [channels, dms] = await Promise.all([db.listChannels(), db.listDmsForUser(profile.id)]);
      for (const ch of channels) {
        if (!ch.isPrivate || ch.memberIds.includes(profile.id)) {
          socket.join(roomKey("channel", ch.id));
        }
      }
      for (const dm of dms) socket.join(roomKey("dm", dm.id));
    } catch (err) {
      console.error("Erro ao entrar nas salas:", err);
    }

    io.emit("presence:update", { userId: profile.id, online: true });
    socket.emit("identify:ack", { user: profile });
  });

  socket.on("channel:join", async ({ channelId }) => {
    const userId = socketUser.get(socket.id);
    if (!userId) return;
    try {
      const ch = await db.getChannel(channelId);
      if (!ch) return;
      if (!ch.memberIds.includes(userId)) await db.addChannelMember(channelId, userId);
      socket.join(roomKey("channel", channelId));
      io.to(roomKey("channel", channelId)).emit("channel:member-joined", { channelId, userId });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("dm:open", async ({ otherUserId }) => {
    const userId = socketUser.get(socket.id);
    if (!userId) return;
    try {
      const dm = await db.getOrCreateDm(userId, otherUserId);
      socket.join(roomKey("dm", dm.id));
      socket.emit("dm:ready", dm);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("message:send", async (payload) => {
    const userId = socketUser.get(socket.id);
    if (!userId) return;
    const { roomId, roomType, text, fileUrl, fileName, fileType, parentId } = payload;
    if (!roomId || !roomType || (!text?.trim() && !fileUrl)) return;

    try {
      const profiles = await db.listProfiles();
      const mentions = text ? parseMentions(text, profiles) : [];
      const { message, parent } = await db.createMessage({
        id: nanoid(14),
        roomId,
        roomType,
        authorId: userId,
        text: text ?? "",
        fileUrl,
        fileName,
        fileType,
        parentId,
        mentions,
      });

      const room = roomKey(roomType, roomId);
      io.to(room).emit("message:new", message);
      if (parent) {
        io.to(room).emit("thread:update", {
          parentId,
          replyCount: parent.replyCount,
          lastReplyAt: parent.lastReplyAt,
        });
      }

      for (const mentionedId of mentions) {
        if (mentionedId === userId) continue;
        const sockets = userSockets.get(mentionedId);
        if (!sockets) continue;
        for (const sid of sockets)
          io.to(sid).emit("notification:new", { type: "mention", message });
      }
    } catch (err) {
      console.error(err);
      socket.emit("message:error", { error: "Não foi possível enviar a mensagem." });
    }
  });

  socket.on("typing:start", ({ roomId, roomType, userId, name }) => {
    const key = roomKey(roomType, roomId);
    if (!typingState.has(key)) typingState.set(key, new Map());
    const map = typingState.get(key);
    clearTimeout(map.get(userId));
    map.set(
      userId,
      setTimeout(() => {
        map.delete(userId);
        socket.to(key).emit("typing:update", { roomId, roomType, userId, typing: false });
      }, 4000),
    );
    socket.to(key).emit("typing:update", { roomId, roomType, userId, name, typing: true });
  });

  socket.on("typing:stop", ({ roomId, roomType, userId }) => {
    const key = roomKey(roomType, roomId);
    const map = typingState.get(key);
    if (map?.has(userId)) {
      clearTimeout(map.get(userId));
      map.delete(userId);
    }
    socket.to(key).emit("typing:update", { roomId, roomType, userId, typing: false });
  });

  socket.on("message:read", async ({ messageId, roomId, roomType, userId }) => {
    try {
      const readBy = await db.markMessageRead(messageId, userId);
      if (readBy)
        io.to(roomKey(roomType, roomId)).emit("message:read:update", { messageId, readBy });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("message:react", async ({ messageId, emoji, userId, roomId, roomType }) => {
    try {
      const reactions = await db.toggleReaction(messageId, emoji, userId);
      if (reactions)
        io.to(roomKey(roomType, roomId)).emit("message:reaction:update", { messageId, reactions });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", async () => {
    const userId = socketUser.get(socket.id);
    socketUser.delete(socket.id);
    leaveAllCircles(socket);
    if (!userId) return;
    const sockets = userSockets.get(userId);
    sockets?.delete(socket.id);
    if (!sockets || sockets.size === 0) {
      userSockets.delete(userId);
      await db.setProfileOnline(userId, false).catch(() => {});
      io.emit("presence:update", { userId, online: false, lastSeen: Date.now() });
    }
  });

  socket.on("circle:join", ({ roomId, roomType, userId, name }) => {
    const key = circleKey(roomType, roomId);
    if (!circleMembers.has(key)) circleMembers.set(key, new Map());
    const members = circleMembers.get(key);
    const existing = [...members.entries()].map(([socketId, info]) => ({
      socketId,
      userId: info.userId,
      name: info.name,
    }));
    members.set(socket.id, { userId, name, roomId, roomType });
    socket.join(key);
    socket.emit("circle:existing-peers", { peers: existing });
    socket.to(key).emit("circle:peer-joined", { socketId: socket.id, userId, name });
  });

  socket.on("circle:leave", ({ roomId, roomType }) => {
    leaveCircle(socket, circleKey(roomType, roomId));
  });

  socket.on("circle:signal", ({ to, signal }) => {
    io.to(to).emit("circle:signal", { from: socket.id, signal });
  });

  function leaveCircle(sock, key) {
    const members = circleMembers.get(key);
    if (!members?.has(sock.id)) return;
    members.delete(sock.id);
    sock.leave(key);
    sock.to(key).emit("circle:peer-left", { socketId: sock.id });
    if (members.size === 0) circleMembers.delete(key);
  }

  function leaveAllCircles(sock) {
    for (const key of circleMembers.keys()) leaveCircle(sock, key);
  }
});

httpServer.listen(PORT, () => {
  console.log(`✔ AtlasDesk chat server rodando em http://localhost:${PORT}`);
});
