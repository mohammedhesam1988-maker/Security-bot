const API = {
  async get(url) {
    const r = await fetch(url, { credentials: 'same-origin' });
    if (r.status === 401) { location.href = '/auth/login'; throw new Error('login'); }
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  },
  async put(url, body) {
    const r = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
    return j;
  },
};

const state = { config: null, roles: [], channels: [], guild: null, me: null };

async function loadAll() {
  const [me, guild, config, roles, channels] = await Promise.all([
    API.get('/api/me'),
    API.get('/api/guild').catch(() => null),
    API.get('/api/config'),
    API.get('/api/guild/roles').catch(() => []),
    API.get('/api/guild/channels').catch(() => []),
  ]);
  Object.assign(state, { me, guild, config, roles, channels });
}

function toast(msg, err) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (err ? ' err' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add('hidden'), 2600);
}

const clone = (o) => JSON.parse(JSON.stringify(o));
