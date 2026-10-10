// ==========================================================================
// VERCEL SERVERLESS ROLES ENDPOINT
// ==========================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { guildId } = req.query;
  if (!guildId) return res.status(400).json({ error: 'guildId is required' });

  try {
    const rolesResp = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!rolesResp.ok) {
      return res.status(rolesResp.status).json({ error: 'Failed to fetch roles from Discord' });
    }

    const roles = await rolesResp.json();
    const sortedRoles = (Array.isArray(roles) ? roles : [])
      .filter(r => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(r => ({
        id: r.id,
        name: r.name,
        color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#99AAB5',
        position: r.position
      }));

    return res.status(200).json({ success: true, roles: sortedRoles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
