// ==========================================================================
// VERCEL SERVERLESS GUILD SETTINGS STORE
// ==========================================================================

// Global in-memory cache for serverless invocation lifecycle
const settingsCache = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ error: 'guildId is required' });
  }

  // GET: Fetch current configuration
  if (req.method === 'GET') {
    const existing = settingsCache.get(guildId) || {
      welcome_channel_id: null,
      welcome_banner_url: "https://media.giphy.com/media/qXdb9xFp3cqYnqQ6RI/giphy.gif",
      welcome_chat_channel_id: null,
      welcome_rules_channel_id: null,
      leave_channel_id: null,
      leave_banner_url: "https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif"
    };

    return res.status(200).json({
      success: true,
      settings: existing
    });
  }

  // POST: Update settings
  if (req.method === 'POST') {
    const updates = req.body || {};
    const current = settingsCache.get(guildId) || {};
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    settingsCache.set(guildId, updated);

    return res.status(200).json({
      success: true,
      message: 'Guild settings saved successfully!',
      settings: updated
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
