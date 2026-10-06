/* ============================================================
 * app.js - Dashboard Main Application
 * Security Bot Dashboard
 * 2026 (c) KBoloorian
 * ============================================================ */

(function () {
  'use strict';

  /* ============================================================
   * GLOBAL STATE
   * ============================================================ */
  var STATE = {
    config: null,
    me: null,
    guild: null,
    roles: [],
    channels: [],
    activeSection: null,
    dirty: false
  };

  /* ============================================================
   * API HELPERS
   * ============================================================ */
  async function apiGet(path) {
    var res = await fetch(path, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    if (res.status === 401) {
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function apiPut(path, body) {
    var res = await fetch(path, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (res.status === 401) {
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || 'HTTP ' + res.status);
    return data;
  }

  /* ============================================================
   * TOAST
   * ============================================================ */
  var toastTimer = null;
  function toast(msg, isError) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.className = 'toast hidden';
    }, 3000);
  }

  /* ============================================================
   * SECTION ORDER & TITLES
   * ============================================================ */
  var SECTION_ORDER = [
    'general',
    'welcome',
    'goodbye',
    'moderation',
    'tickets',
    'giveaways',
    'colorRoles',
    'levels',
    'warns',
    'autoRole',
    'verification',
    'reactionRoles',
    'inviteTracker',
    'securityLimits',
    'antiRaid',
    'autoMod',
    'beastMode',
    'roleLimits',
    'antiPhishing',
    'antiToken',
    'antiScam',
    'autoLockdown',
    'autoBan',
    'triggers',
    'announcements',
    'games',
    'logChannels',
    'utility',
    '__commands__',
    'commands',
    'logs',
    'create_invite',
    'debug',
    'color',
    'banner',
    'poll',
    'say',
    'help',
    'invite',
    'roleall',
    'colorrole',
    'mutetext',
    'mutevoice',
    'moveme',
    'report',
    'prison',
    'modlist',
    'softban',
    'setxp',
    'setlevel',
    'setnickname',
    'setaboutme',
    'setwelcome',
    'addemojis',
    'addstickers',
    'roleadd',
    'roleremove',
    'rar',
    'daily',
    'move',
    'profile',
    'rep',
    'roles',
    'roll',
    'short',
    'vote',
    'rank',
    'leaderboard',
    'reactionrole',
    'warn',
    'warnings',
    'clearwarnings',
    'clear',
    'announce',
    'giveaway',
    'gend',
    'ticket',
    'close',
    'trivia',
    'rps',
    'wordle',
    'truthordare',
    'wouldyourather',
    'ban',
    'kick',
    'mute',
    'unmute',
    'ping',
    'serverinfo',
    'userinfo',
    'avatar',
    'about',
    'credits',
    'server',
    'user'
  ];

  /* ============================================================
   * SECTION GROUPING FOR NAV
   * ============================================================ */
  var NAV_GROUPS = [
    { label: 'Core', sections: ['general', 'welcome', 'goodbye'] },
    { label: 'Moderation', sections: ['moderation', 'warns', 'autoMod', 'antiRaid', 'antiPhishing', 'antiToken', 'antiScam', 'autoBan', 'autoLockdown', 'beastMode'] },
    { label: 'Security Limits', sections: ['securityLimits', 'roleLimits'] },
    { label: 'Community', sections: ['levels', 'tickets', 'giveaways', 'reactionRoles', 'colorRoles', 'autoRole', 'inviteTracker', 'verification'] },
    { label: 'Content', sections: ['triggers', 'announcements', 'games'] },
    { label: 'Logging', sections: ['logChannels'] },
    { label: 'Commands', sections: [
      'commands','logs','create_invite','debug','color','banner','poll','say',
      'help','invite','roleall','colorrole','mutetext','mutevoice','moveme',
      'report','prison','modlist','softban','setxp','setlevel','setnickname',
      'setaboutme','setwelcome','addemojis','addstickers','roleadd','roleremove',
      'rar','daily','move','profile','rep','roles','roll','short','vote',
      'rank','leaderboard','reactionrole','warn','warnings','clearwarnings',
      'clear','announce','giveaway','gend','ticket','close','trivia','rps',
      'wordle','truthordare','wouldyourather','ban','kick','mute','unmute',
      'ping','serverinfo','userinfo','avatar','about','credits','server','user'
    ]},
    { label: 'Utility', sections: ['utility'] }
  ];

  /* ============================================================
   * NAV RENDERING
   * ============================================================ */
  function renderNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    nav.innerHTML = '';

    NAV_GROUPS.forEach(function (group) {
      var groupEl = document.createElement('div');
      groupEl.className = 'nav-group';

      var groupTitle = document.createElement('div');
      groupTitle.className = 'nav-group-title';
      groupTitle.textContent = group.label;
      groupEl.appendChild(groupTitle);

      group.sections.forEach(function (key) {
        if (!window.FormBuilder.SCHEMA[key]) return;
        var item = document.createElement('a');
        item.className = 'nav-item';
        item.dataset.section = key;
        item.textContent = window.FormBuilder.SCHEMA[key].title || key;
        item.href = '#' + key;
        item.addEventListener('click', function (e) {
          e.preventDefault();
          selectSection(key);
        });
        groupEl.appendChild(item);
      });

      nav.appendChild(groupEl);
    });
  }

  /* ============================================================
   * SECTION SELECT
   * ============================================================ */
  function selectSection(key) {
    if (STATE.dirty) {
      var ok = confirm('You have unsaved changes. Discard them?');
      if (!ok) return;
      STATE.dirty = false;
    }

    STATE.activeSection = key;

    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function (el) {
      el.classList.toggle('active', el.dataset.section === key);
    });

    var content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = '';
    window.FormBuilder.renderSection(
      key,
      STATE.config,
      content,
      function () {
        STATE.dirty = true;
        updateSaveBar();
      }
    );

    // Close sidebar on mobile
    var sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');

    updateSaveBar();
  }

  /* ============================================================
   * SAVE BAR
   * ============================================================ */
  function updateSaveBar() {
    var bar = document.getElementById('saveBar');
    if (!bar) return;
    if (STATE.dirty) {
      bar.classList.remove('hidden');
    } else {
      bar.classList.add('hidden');
    }
  }

  /* ============================================================
   * SAVE / RESET
   * ============================================================ */
  async function saveCurrent() {
    var key = STATE.activeSection;
    if (!key) return;
    var saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.disabled = true;

    try {
      var section = STATE.config[key] || {};
      await apiPut('/api/config/' + key, { value: section });
      STATE.dirty = false;
      updateSaveBar();
      toast('Saved: ' + key);
    } catch (err) {
      toast('Save failed: ' + err.message, true);
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  async function resetCurrent() {
    var key = STATE.activeSection;
    if (!key) return;
    var ok = confirm('Reload this section from server?');
    if (!ok) return;

    try {
      var fresh = await apiGet('/api/config');
      STATE.config = fresh;
      STATE.dirty = false;
      selectSection(key);
      toast('Reloaded: ' + key);
    } catch (err) {
      toast('Reload failed: ' + err.message, true);
    }
  }

  /* ============================================================
   * USER INFO
   * ============================================================ */
  function renderUser() {
    var box = document.getElementById('userBox');
    if (!box || !STATE.me) return;
    box.innerHTML = '';

    if (STATE.me.avatar) {
      var img = document.createElement('img');
      img.src = STATE.me.avatar;
      img.className = 'user-avatar';
      box.appendChild(img);
    }

    var name = document.createElement('span');
    name.textContent = STATE.me.username || 'User';
    name.className = 'user-name';
    box.appendChild(name);
  }

  function renderGuild() {
    var el = document.getElementById('guildName');
    if (!el || !STATE.guild) return;
    el.textContent = STATE.guild.name || 'Server';
  }

  /* ============================================================
   * BOOT
   * ============================================================ */
  async function boot() {
    var loading = document.getElementById('loading');

    try {
      // Fetch everything in parallel
      var results = await Promise.all([
        apiGet('/api/me'),
        apiGet('/api/config'),
        apiGet('/api/guild').catch(function () { return null; }),
        apiGet('/api/guild/roles').catch(function () { return []; }),
        apiGet('/api/guild/channels').catch(function () { return []; })
      ]);

      STATE.me = results[0];
      STATE.config = results[1];
      STATE.guild = results[2];
      STATE.roles = Array.isArray(results[3]) ? results[3] : [];
      STATE.channels = Array.isArray(results[4]) ? results[4] : [];

      // Make them globally available for form.js
      window.__ROLES__ = STATE.roles;
      window.__CHANNELS__ = STATE.channels;

      renderUser();
      renderGuild();
      renderNav();

      if (loading) loading.classList.add('hidden');

      // Default section
      selectSection('general');

    } catch (err) {
      if (loading) {
        loading.textContent = 'Failed to load: ' + err.message;
      }
      toast('Failed to load: ' + err.message, true);
      console.error(err);
    }
  }

  /* ============================================================
   * EVENT WIRING
   * ============================================================ */
  function wireEvents() {
    var saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveCurrent);

    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetCurrent);

    var menuBtn = document.getElementById('menuBtn');
    var sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    // Warn on page unload if dirty
    window.addEventListener('beforeunload', function (e) {
      if (STATE.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  /* ============================================================
   * START
   * ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wireEvents();
      boot();
    });
  } else {
    wireEvents();
    boot();
  }

})();
