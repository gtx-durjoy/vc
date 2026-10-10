// ==========================================================================
// VERCEL SERVERLESS AUTHENTICATION & SECURITY ENDPOINT
// ==========================================================================

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.APPLICATION_ID || "1558193416905695262";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "luna2026";

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  // 1. Get Discord OAuth2 Login URL
  if (action === 'login-url') {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    const redirectUri = encodeURIComponent(`${protocol}://${host}/api/callback`);
    
    // Scopes: identify (username/avatar), guilds (server list)
    const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=identify+guilds&prompt=consent`;
    return res.status(200).json({ url: oauthUrl });
  }

  // 2. Handle Discord OAuth2 Callback
  if (action === 'callback') {
    const { code } = req.query;
    if (!code) {
      return res.redirect('/?error=no_code');
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    const redirectUri = `${protocol}://${host}/api/auth?action=callback`;

    try {
      // Exchange Code for Access Token
      const tokenResp = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri
        })
      });

      const tokenData = await tokenResp.json();
      if (!tokenData.access_token) {
        // If client secret is not configured in Vercel, redirect with friendly prompt
        return res.redirect(`/?error=oauth_failed&details=${encodeURIComponent(tokenData.error_description || 'Check CLIENT_SECRET in Vercel settings')}`);
      }

      // Fetch User Info
      const userResp = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userResp.json();

      // Set cookie and redirect to dashboard
      const sessionData = Buffer.from(JSON.stringify({
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        accessToken: tokenData.access_token,
        type: 'discord_oauth'
      })).toString('base64');

      res.setHeader('Set-Cookie', `luna_session=${sessionData}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
      return res.redirect('/dashboard.html');
    } catch (err) {
      return res.redirect(`/?error=server_error&details=${encodeURIComponent(err.message)}`);
    }
  }

  // 3. Direct Secure Passkey Login (Bypass / Owner Portal)
  if (action === 'passkey-login' && req.method === 'POST') {
    const { passkey, username } = req.body || {};
    if (!passkey || passkey !== ADMIN_PASSKEY) {
      return res.status(401).json({ success: false, error: 'Invalid Security Passkey' });
    }

    const sessionData = Buffer.from(JSON.stringify({
      id: "owner_admin",
      username: username || "Durjoy (Master Admin)",
      avatar: null,
      isAdmin: true,
      type: 'master_passkey'
    })).toString('base64');

    return res.status(200).json({
      success: true,
      token: sessionData,
      user: {
        id: "owner_admin",
        username: username || "Durjoy (Master Admin)",
        isAdmin: true
      }
    });
  }

  // 4. Check Current User Session
  if (action === 'me') {
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
      return res.status(401).json({ authenticated: false });
    }

    try {
      const userSession = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      return res.status(200).json({
        authenticated: true,
        user: userSession
      });
    } catch (e) {
      return res.status(401).json({ authenticated: false, error: 'Invalid session' });
    }
  }

  // 5. Logout
  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'luna_session=; Path=/; HttpOnly; Max-Age=0');
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
