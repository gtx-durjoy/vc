// ==========================================================================
// VERCEL SERVERLESS GUILDS / SERVERS ENDPOINT
// ==========================================================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.APPLICATION_ID || "1558193416905695262";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/luna_session=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }

  let session = null;
  try {
    session = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch (e) {
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }

  try {
    // 1. Fetch all guilds that LUNA bot is currently in
    const botGuildsResp = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const botGuilds = await botGuildsResp.json();
    const botGuildIds = new Set(Array.isArray(botGuilds) ? botGuilds.map(g => g.id) : []);

    let accessibleGuilds = [];

    // 2. If Master Passkey Admin, return all servers LUNA is in
    if (session.isAdmin || session.type === 'master_passkey') {
      accessibleGuilds = (Array.isArray(botGuilds) ? botGuilds : []).map(g => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        hasBot: true,
        isAdmin: true,
        permissions: "8"
      }));
    } 
    // 3. If Discord OAuth user, fetch user's guilds and filter for Administrator/Manage Guild permissions
    else if (session.accessToken) {
      const userGuildsResp = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      const userGuilds = await userGuildsResp.json();

      if (Array.isArray(userGuilds)) {
        accessibleGuilds = userGuilds
          .filter(g => {
            const perms = BigInt(g.permissions || "0");
            const isAdmin = (perms & BigInt(0x8)) === BigInt(0x8);
            const isManager = (perms & BigInt(0x20)) === BigInt(0x20);
            return isAdmin || isManager || g.owner;
          })
          .map(g => ({
            id: g.id,
            name: g.name,
            icon: g.icon,
            hasBot: botGuildIds.has(g.id),
            isAdmin: true,
            permissions: g.permissions
          }));
      }
    }

    return res.status(200).json({
      success: true,
      guilds: accessibleGuilds,
      botClientId: CLIENT_ID
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
