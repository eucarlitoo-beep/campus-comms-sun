# AtlasDesk — servidor de chat

Servidor Node (Express + Socket.IO) que dá vida ao chat em tempo real do
AtlasDesk: canais, mensagens diretas, digitando, presença online/offline,
mensagens lidas, reações, threads, upload de arquivo, busca e menções.

## Por que ele é separado do site?

O site principal (pasta raiz do projeto) é publicado na **Cloudflare
Workers**, que não mantém um processo Node contínuo — e o Socket.IO precisa
disso para manter conexões abertas. Por isso o chat vive num serviço à
parte, que você aponta pelo endereço configurado no front-end
(`VITE_CHAT_SERVER_URL`).

## Rodando localmente

```bash
cd server
npm install
npm run dev     # reinicia sozinho a cada alteração (node --watch)
# ou: npm start
```

Por padrão sobe em `http://localhost:4000`. Os dados (usuários, canais,
mensagens) ficam salvos em `server/data.json` — apagar esse arquivo reseta
tudo. Arquivos enviados no chat ficam em `server/uploads/`.

No front-end, crie um `.env.local` na raiz do projeto (não dentro de
`server/`) com:

```
VITE_CHAT_SERVER_URL=http://localhost:4000
```

## Publicando em produção

Suba a pasta `server/` (sozinha, sem o resto do site) em qualquer host que
rode Node de forma contínua:

- **Render** (Web Service, root directory `server`, build `npm install`,
  start `npm start`)
- **Railway** (mesma ideia, detecta Node automaticamente)
- **Fly.io** ou uma **VPS** qualquer com `pm2`/`systemd`

Depois, aponte `VITE_CHAT_SERVER_URL` (na Cloudflare/variáveis de ambiente
do site) para a URL pública do servidor, por exemplo
`https://atlasdesk-chat.onrender.com`.

## Banco de dados e login de verdade (Supabase)

O chat agora usa um banco de dados PostgreSQL de verdade e login com
e-mail/senha — em vez de guardar tudo num arquivo local e deixar qualquer
um entrar digitando um nome.

### Passo a passo (uns 10 minutos, tudo grátis pra começar)

1. Crie uma conta em **[supabase.com](https://supabase.com)** e um projeto novo
2. No painel do projeto, vá em **SQL Editor → New query**, cole o conteúdo
   de `server/supabase-schema.sql` (deste repositório) e clique em **Run**
   — isso cria todas as tabelas de uma vez
3. Vá em **Authentication → Providers** e confirme que **Email** está
   habilitado (vem habilitado por padrão)
4. Vá em **Project Settings → API** e copie três valores:
   - **Project URL**
   - **anon public key**
   - **service_role key** (secreta — nunca vai pro navegador)

### Onde colar cada chave

Na **raiz do projeto**, copie `.env.example` para `.env` e preencha:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (a "anon public key")
```

Dentro de **`server/`**, copie `server/.env.example` para `server/.env` e preencha:

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (a "service_role key" — mantenha em segredo)
```

Reinicie os dois servidores (`npm run dev` na raiz e dentro de `server/`).
Pronto — cadastro e login por e-mail/senha já funcionam de verdade, e os
dados ficam salvos no Supabase, não mais num arquivo local.

### O que isso muda

- **Sem as chaves do Supabase configuradas**, o chat sobe normalmente mas
  mostra um aviso claro na tela de login, em vez de travar
- Cada pessoa cadastrada vira uma linha real na tabela `profiles`
- Os dados sobrevivem a reinícios do servidor (o arquivo `server/data.json`
  não existe mais)
- **Login com Google:** dá pra habilitar depois, em Authentication →
  Providers → Google no painel do Supabase — o código já usa o SDK de
  autenticação do Supabase, então adicionar esse provedor não exige mexer
  no servidor, só habilitar lá e adicionar um botão no front-end

## Círculos (chamada de áudio/vídeo)

Os Círculos usam **WebRTC**: o áudio/vídeo viaja direto entre os navegadores
dos participantes (peer-to-peer), o servidor só troca "endereços" entre eles
(sinalização), via Socket.IO — os eventos `circle:*` em `server/index.mjs`.
Não guarda nem processa mídia nenhuma.

**Funciona de cara**, sem configurar nada, usando servidores STUN públicos
gratuitos (mantidos pelo Google). Isso resolve a maioria das redes
domésticas.

**Mas redes de escola costumam ter firewall/NAT mais restritivo**, e nesse
caso o STUN sozinho não é suficiente — os participantes não conseguem se
conectar direto, e é preciso um servidor **TURN** (que retransmite a mídia
em vez de só ajudar a negociar a conexão direta).

Se os Círculos não conectarem em rede da escola, configure um TURN no `.env`
da raiz do projeto (não dentro de `server/`):

```
VITE_TURN_URL=turn:seu-turn-aqui:3478
VITE_TURN_USERNAME=usuario
VITE_TURN_CREDENTIAL=senha
```

Opções prontas (não precisa hospedar nada):
- [Metered](https://www.metered.ca/tools/openrelay/) — tem um plano gratuito com limite mensal, bom pra testar
- [Twilio Network Traversal Service](https://www.twilio.com/docs/stun-turn) — pago, mais robusto para uso contínuo

Sem TURN configurado, os Círculos funcionam normalmente em redes mais
abertas, e simplesmente não conseguem conectar em redes muito restritivas —
sem travar o resto do chat.

## GIFs (Tenor / GIPHY)

O chat tem um seletor de GIF completo (busca em tempo real, em alta,
categorias, favoritos, pré-visualização) — mas ele **precisa de uma chave de
API** de um dos dois provedores, porque nenhum dos dois oferece mais uma
chave pública compartilhada que funcione de forma confiável.

Leva ~2 minutos, é grátis e não pede cartão de crédito:

1. **Tenor (preferencial):** [developers.google.com/tenor/guides/quickstart](https://developers.google.com/tenor/guides/quickstart) → "Get an API key"
2. **GIPHY (alternativa):** [developers.giphy.com/dashboard](https://developers.giphy.com/dashboard) → "Create an App" → chave "Beta"

Copie `server/.env.example` para `server/.env` e cole a chave:

```
TENOR_API_KEY=sua-chave-aqui
```

Sem nenhuma chave configurada, o botão de GIF mostra uma mensagem explicando
exatamente isso, em vez de travar ou falhar silenciosamente.

## Limitações conhecidas (para você ter em mente)

- **Upload de arquivos ainda fica em disco local**, não no Supabase Storage.
  Funciona bem pra uma escola só, mas em hosts que reiniciam o disco com
  frequência os arquivos enviados podem se perder — o Supabase Storage seria
  o próximo passo natural aqui.
- **Um único processo.** Não foi pensado para múltiplas instâncias/réplicas
  (não há Redis adapter para Socket.IO). Para uma escola/turma isso é mais
  que suficiente; para escalar para muitas escolas ao mesmo tempo, seria o
  próximo passo.
- **Um "workspace" só.** Todo mundo que se cadastra entra no mesmo chat —
  não existe (ainda) o conceito de "cada escola no seu espaço isolado".

## Endpoints REST

Todos os endpoints (exceto `/api/health`) exigem um cabeçalho
`Authorization: Bearer <token>`, com o token de sessão do Supabase — o
front-end já cuida disso automaticamente depois do login.

| Método | Rota                | Descrição                              |
| ------ | -------------------- | --------------------------------------- |
| GET    | `/api/me`             | Perfil de quem está autenticado         |
| GET    | `/api/users`         | Lista usuários (com presença)           |
| GET    | `/api/channels`      | Lista canais                            |
| POST   | `/api/channels`      | Cria canal                              |
| PATCH  | `/api/channels/:id`  | Renomeia um canal                       |
| GET    | `/api/dms`           | Lista conversas diretas do usuário      |
| POST   | `/api/dms`           | Cria/retorna uma conversa direta        |
| GET    | `/api/messages`      | Histórico de um canal ou DM             |
| GET    | `/api/threads/:id`   | Respostas de uma thread                 |
| GET    | `/api/search?query=` | Busca mensagens por texto               |
| POST   | `/api/upload`        | Upload de arquivo (`multipart/form-data`, campo `file`) |
| GET    | `/api/gifs/status`    | Qual provedor de GIF está ativo (`tenor`, `giphy` ou `null`) |
| GET    | `/api/gifs/trending`  | GIFs em alta (paginação via `pos`)      |
| GET    | `/api/gifs/search`    | Busca GIFs por `query` (paginação via `pos`) |
| GET    | `/api/gifs/categories`| Categorias em alta, com prévia          |

## Eventos Socket.IO

| Evento              | Direção          | Descrição                          |
| -------------------- | ---------------- | ----------------------------------- |
| `identify`           | cliente → server | Autentica a conexão com o token do Supabase |
| `channel:join`       | cliente → server | Entra na sala de um canal           |
| `dm:open`            | cliente → server | Abre/entra numa conversa direta     |
| `message:send`       | cliente → server | Envia mensagem (canal, DM ou thread)|
| `typing:start/stop`  | cliente → server | Indicador de digitando              |
| `message:read`       | cliente → server | Marca mensagem como lida            |
| `message:react`      | cliente → server | Alterna uma reação de emoji         |
| `message:new`        | server → cliente | Nova mensagem em uma sala           |
| `presence:update`    | server → cliente | Usuário ficou online/offline        |
| `typing:update`      | server → cliente | Alguém começou/parou de digitar     |
| `message:read:update`| server → cliente | Lista atualizada de quem leu        |
| `message:reaction:update` | server → cliente | Reações atualizadas de uma mensagem |
| `thread:update`      | server → cliente | Contagem de respostas de uma thread |
| `notification:new`   | server → cliente | Notificação (ex: você foi @mencionado) |
