require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const CONFIG_PATH = path.resolve(__dirname, process.env.CONFIG_PATH || '../config.js');
const ADMINS = (process.env.ADMIN_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const DISCORD = 'https://discord.com/api/v10';
const HIDDEN = ['token'];
const bot = { headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` } };

if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET missing');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 6 * 60 * 60 * 1000 },
}));

app.get('/auth/login', (req, res) => {
  req.session.state = crypto.randomBytes(16).toString('hex');
  const p = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.CALLBACK_URL,
    response_type: 'code',
    scope: 'identify',
    state: req.session.state,
  });
  res.redirect('https://discord.com/oauth2/authorize?' + p);
});

app.get('/auth/callback', async (req, res) => {
  try {
    if (!req.query.state || req.query.state !== req.session.state) return res.status(400).send('Bad state');
    const t = await axios.post(DISCORD + '/oauth2/token', new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.CALLBACK_URL,
    }));
    const u = await axios.get(DISCORD + '/users/@me', {
      headers: { Authorization: 'Bearer ' + t.data.access_token },
    });
    if (!ADMINS.includes(u.data.id)) return res.status(403).send('Not allowed');
    req.session.user = { id: u.data.id, username: u.data.username, avatar: u.data.avatar };
    res.redirect('/');
  } catch (e) {
    console.error("LOGIN ERROR:", e.response?.data || e.message || e); res.status(500).send("Login error: " + (e.response?.data?.error || e.message));
  }
});

app.get('/auth/logout', (req, res) => req.session.destroy(() => res.redirect('/auth/login')));

const requireAuth = (req, res, next) =>
  req.session.user ? next() : res.status(401).json({ error: 'login required' });

const loadConfig = () => {
  delete require.cache[require.resolve(CONFIG_PATH)];
  return require(CONFIG_PATH);
};

const writeConfig = (cfg) => {
  fs.copyFileSync(CONFIG_PATH, CONFIG_PATH + '.bak');
  const tmp = CONFIG_PATH + '.tmp';
  fs.writeFileSync(tmp, 'module.exports = ' + JSON.stringify(cfg, null, 4) + ';\n');
  fs.renameSync(tmp, CONFIG_PATH);
};

app.get('/api/me', requireAuth, (req, res) => res.json(req.session.user));

app.get('/api/config', requireAuth, (req, res) => {
  const cfg = JSON.parse(JSON.stringify(loadConfig()));
  HIDDEN.forEach(k => delete cfg[k]);
  res.json(cfg);
});

app.put('/api/config/:section', requireAuth, (req, res) => {
  try {
    let key = req.params.section;
    const cfg = loadConfig();
    const lowerKey = key.toLowerCase();
    const actualKey = Object.keys(cfg).find(k => k.toLowerCase() === lowerKey);
    if (HIDDEN.includes(key) || !actualKey) return res.status(404).json({ error: "unknown section" });
    key = actualKey;
    const v = req.body.value;
    if (v === undefined) return res.status(400).json({ error: 'value missing' });
    if (Array.isArray(cfg[key]) !== Array.isArray(v) || typeof cfg[key] !== typeof v)
      return res.status(400).json({ error: 'type mismatch' });
    writeConfig({ ...cfg, [key]: v });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const G = () => DISCORD + '/guilds/' + process.env.GUILD_ID;

app.get('/api/guild', requireAuth, async (req, res) => {
  try {
    const r = await axios.get(G() + '?with_counts=true', bot);
    const g = r.data;
    res.json({
      id: g.id,
      name: g.name,
      icon: g.icon ? 'https://cdn.discordapp.com/icons/' + g.id + '/' + g.icon + '.png?size=128' : null,
      members: g.approximate_member_count,
      online: g.approximate_presence_count,
    });
  } catch (e) { res.status(502).json({ error: 'discord' }); }
});

app.get('/api/guild/roles', requireAuth, async (req, res) => {
  try {
    const r = await axios.get(G() + '/roles', bot);
    res.json(r.data.sort((a, b) => b.position - a.position).map(x => ({
      id: x.id,
      name: x.name,
      color: x.color ? '#' + x.color.toString(16).padStart(6, '0') : null,
      managed: x.managed,
    })));
  } catch (e) { res.status(502).json([]); }
});

app.get('/api/guild/channels', requireAuth, async (req, res) => {
  try {
    const r = await axios.get(G() + '/channels', bot);
    res.json(r.data.sort((a, b) => a.position - b.position).map(x => ({
      id: x.id, name: x.name, type: x.type, parent: x.parent_id,
    })));
  } catch (e) { res.status(502).json([]); }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/api')) return next();
  if (!req.session.user) return res.redirect('/auth/login');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.DASHBOARD_PORT || 3000;
app.listen(PORT, '127.0.0.1', () => console.log('Dashboard: http://localhost:' + PORT));
