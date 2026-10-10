// ==========================================================================
// VERCEL SERVERLESS CHANNELS DISCOVERY ENDPOINT
// ==========================================================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ error: 'guildId parameter is required' });
  }

  try {
    const channelsResp = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!channelsResp.ok) {
      const errData = await channelsResp.json();
      return res.status(channelsResp.status).json({ error: errData.message || 'Failed to fetch channels' });
    }

    const channels = await channelsResp.json();

    // Filter text channels (type 0 = GUILD_TEXT, type 5 = GUILD_ANNOUNCEMENT)
    const textChannels = channels
      .filter(ch => ch.type === 0 || ch.type === 5)
      .map(ch => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
        position: ch.position,
        parentId: ch.parent_id
      }))
      .sort((a, b) => a.position - b.position);

    return res.status(200).json({
      success: true,
      channels: textChannels
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
