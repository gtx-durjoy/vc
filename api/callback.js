// ==========================================================================
// VERCEL SERVERLESS OAUTH2 CALLBACK HANDLER
// ==========================================================================

const CLIENT_ID = process.env.APPLICATION_ID || "1558193416905695262";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";

export default async function handler(req, res) {
  const { code, error } = req.query || {};

  if (error || !code) {
    return res.redirect(`/?error=oauth_cancelled`);
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['host'];
  const redirectUri = `${protocol}://${host}/api/callback`;

  try {
    // 1. Exchange OAuth Code for Token
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
      return res.redirect(`/?error=missing_secret&details=${encodeURIComponent(tokenData.error_description || 'Please set CLIENT_SECRET in Vercel')}`);
    }

    // 2. Fetch User Profile
    const userResp = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userResp.json();

    // 3. Create Session Token
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
