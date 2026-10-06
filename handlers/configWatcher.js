/* ============================================================
 * configWatcher.js
 * Auto-reload config.js when the file changes
 * Listens for dashboard updates
 * 2026 (c) KBoloorian
 * ============================================================ */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve(__dirname, '..', 'config.js');
let currentConfig = null;
let watcher = null;
let debounceTimer = null;

/**
 * Load the config file fresh (clear require cache)
 */
function loadFreshConfig() {
  try {
    delete require.cache[require.resolve(CONFIG_PATH)];
    currentConfig = require(CONFIG_PATH);
    return currentConfig;
  } catch (err) {
    console.error('[configWatcher] Failed to load config:', err.message);
    return null;
  }
}

/**
 * Notify all listeners of config change
 */
const listeners = [];
function onChange(callback) {
  listeners.push(callback);
}

function emitChange(newConfig) {
  listeners.forEach(function (cb) {
    try { cb(newConfig); } catch (e) { console.error('[configWatcher] listener error:', e); }
  });
}

/**
 * Start watching the config file
 */
function start() {
  currentConfig = loadFreshConfig();
  console.log('[configWatcher] ✅ Config loaded');

  watcher = fs.watch(CONFIG_PATH, function (eventType) {
    if (eventType !== 'change') return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      console.log('[configWatcher] 🔄 Config changed, reloading...');
      const fresh = loadFreshConfig();
      if (fresh) {
        console.log('[configWatcher] ✅ Config reloaded');
        emitChange(fresh);
      }
    }, 300);
  });

  console.log('[configWatcher] 👁️  Watching config.js for changes');
}

function getConfig() {
  return currentConfig;
}

function stop() {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
}

module.exports = {
  start,
  stop,
  getConfig,
  onChange,
  reload: loadFreshConfig
};
