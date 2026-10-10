// ==========================================================================
// LOCAL DEVELOPMENT SERVER FOR LUNA VERCEL DASHBOARD
// Runs exactly like Vercel Serverless locally!
// ==========================================================================

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically load .env if present
const envFiles = [path.join(__dirname, '.env'), path.join(__dirname, '..', '.env')];
for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    try {
      const content = fs.readFileSync(envFile, 'utf-8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...vals] = trimmed.split('=');
          const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    } catch {}
  }
}

const PORT = process.env.PORT || 4000;

// Load API handlers
import authHandler from './api/auth.js';
import callbackHandler from './api/callback.js';
import guildsHandler from './api/guilds.js';
import channelsHandler from './api/channels.js';
import settingsHandler from './api/settings.js';
import discordActionHandler from './api/discord-action.js';
import rolesHandler from './api/roles.js';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const searchParams = Object.fromEntries(parsedUrl.searchParams);

  // Helper to polyfill Vercel req.query & req.body
  req.query = searchParams;

  // Polyfill helper for res.json and res.status
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.redirect = function(url) {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end();
  };

  // Parse JSON Body if POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let bodyData = '';
    for await (const chunk of req) {
      bodyData += chunk;
    }
    try {
      req.body = bodyData ? JSON.parse(bodyData) : {};
    } catch {
      req.body = bodyData;
    }
  } else {
    req.body = {};
  }

  // Routing API Endpoints
  if (pathname === '/api/auth') {
    return authHandler(req, res);
  }
  if (pathname === '/api/callback') {
    return callbackHandler(req, res);
  }
  if (pathname === '/api/guilds') {
    return guildsHandler(req, res);
  }
  if (pathname === '/api/channels') {
    return channelsHandler(req, res);
  }
  if (pathname === '/api/settings') {
    return settingsHandler(req, res);
  }
  if (pathname === '/api/discord-action') {
    return discordActionHandler(req, res);
  }
  if (pathname === '/api/roles') {
    return rolesHandler(req, res);
  }

  // Static File Serving
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (pathname === '/dashboard') {
    filePath = path.join(__dirname, 'public', 'dashboard.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'text/plain');
    return fs.createReadStream(filePath).pipe(res);
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🚀 LUNA Vercel Dashboard running locally!`);
  console.log(` >> Local URL: http://localhost:${PORT}`);
  console.log(` >> Master Passkey: luna2026`);
  console.log(`======================================================\n`);
});
