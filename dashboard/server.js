const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let botClient = null;
let botConfig = null;
const configPath = path.join(__dirname, '..', 'config.js');

function setBot(client, config) {
    botClient = client;
    botConfig = config;
}

function saveConfig() {
    try {
        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(botConfig, null, 4)};`);
        return true;
    } catch (err) {
        console.error('Error saving config:', err);
        return false;
    }
}

// ==================== STATUS ====================
app.get('/api/status', (req, res) => {
    if (!botClient) return res.json({ online: false });
    res.json({
        online: true,
        tag: botClient.user?.tag || 'Unknown',
        id: botClient.user?.id || '0',
        guilds: botClient.guilds.cache.size,
        users: botClient.users.cache.size,
        ping: botClient.ws.ping,
        uptime: Math.floor(botClient.uptime / 1000 / 60)
    });
});

// ==================== GENERAL ====================
app.get('/api/general', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.general || {});
});

app.post('/api/general/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.general) botConfig.general = {};
    botConfig.general[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== PREMIUM ====================
app.get('/api/premium', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.premium || {});
});

app.post('/api/premium/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.premium) botConfig.premium = {};
    botConfig.premium[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/premium/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.premium) botConfig.premium = { enabled: false };
    botConfig.premium.enabled = !botConfig.premium.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.premium.enabled });
});

// ==================== ANALYTICS ====================
app.get('/api/analytics', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.analytics || {});
});

app.post('/api/analytics/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.analytics) botConfig.analytics = {};
    botConfig.analytics[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.get('/api/analytics/stats', (req, res) => {
    if (!botClient) return res.json({});
    const guild = botClient.guilds.cache.first();
    if (!guild) return res.json({});
    res.json({
        members: guild.memberCount,
        channels: guild.channels.cache.size,
        roles: guild.roles.cache.size,
        emojis: guild.emojis.cache.size,
        boostLevel: guild.premiumTier,
        boostCount: guild.premiumSubscriptionCount,
        createdAt: guild.createdTimestamp,
        ownerId: guild.ownerId
    });
});

// ==================== WHITELIST ====================
app.get('/api/whitelist', (req, res) => {
    if (!botConfig || !botConfig.whitelist) return res.json({ users: {}, roles: {}, channels: {} });
    res.json(botConfig.whitelist);
});

app.post('/api/whitelist/add', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { type, action, id } = req.body;
    if (!botConfig.whitelist[type]) return res.status(400).json({ error: 'Invalid type' });
    if (!botConfig.whitelist[type][action]) botConfig.whitelist[type][action] = [];
    if (!botConfig.whitelist[type][action].includes(id)) {
        botConfig.whitelist[type][action].push(id);
        saveConfig();
    }
    res.json({ success: true, data: botConfig.whitelist[type][action] });
});

app.post('/api/whitelist/remove', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { type, action, id } = req.body;
    if (!botConfig.whitelist[type] || !botConfig.whitelist[type][action]) {
        return res.status(400).json({ error: 'Invalid type or action' });
    }
    botConfig.whitelist[type][action] = botConfig.whitelist[type][action].filter(x => x !== id);
    saveConfig();
    res.json({ success: true });
});

// ==================== ANTI-SPAM ====================
app.get('/api/antispam', (req, res) => {
    if (!botConfig || !botConfig.autoMod) return res.json({});
    res.json(botConfig.autoMod);
});

app.post('/api/antispam/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { module, field, value } = req.body;
    if (!botConfig.autoMod) botConfig.autoMod = {};
    if (!botConfig.autoMod[module]) botConfig.autoMod[module] = {};
    botConfig.autoMod[module][field] = value;
    saveConfig();
    res.json({ success: true, data: botConfig.autoMod[module] });
});

// ==================== ANTI-NUKE ====================
app.get('/api/antinuke/config', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.securityLimits);
});

app.post('/api/antinuke/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { action, field, value } = req.body;
    if (botConfig.securityLimits[action]) {
        botConfig.securityLimits[action][field] = value;
        saveConfig();
        return res.json({ success: true });
    }
    res.status(400).json({ error: 'Action not found' });
});

// ==================== ROLE LIMITS ====================
app.get('/api/rolelimits/config', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.roleLimits || {});
});

app.post('/api/rolelimits/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { action, field, value } = req.body;
    if (botConfig.roleLimits && botConfig.roleLimits[action]) {
        botConfig.roleLimits[action][field] = value;
        saveConfig();
        return res.json({ success: true });
    }
    res.status(400).json({ error: 'Action not found' });
});

// ==================== BEAST MODE ====================
app.get('/api/beastmode', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.beastMode || { enabled: false, actions: {} });
});

app.post('/api/beastmode/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { action, field, value } = req.body;
    if (!botConfig.beastMode) botConfig.beastMode = { enabled: false, actions: {} };
    if (!botConfig.beastMode.actions) botConfig.beastMode.actions = {};
    if (!botConfig.beastMode.actions[action]) botConfig.beastMode.actions[action] = {};
    botConfig.beastMode.actions[action][field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/beastmode/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.beastMode) botConfig.beastMode = { enabled: false, actions: {} };
    botConfig.beastMode.enabled = !botConfig.beastMode.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.beastMode.enabled });
});

// ==================== ANTI-RAID ====================
app.get('/api/antiraid', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.antiRaid || { enabled: false });
});

app.post('/api/antiraid/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.antiRaid) botConfig.antiRaid = { enabled: false };
    botConfig.antiRaid[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/antiraid/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.antiRaid) botConfig.antiRaid = { enabled: false };
    botConfig.antiRaid.enabled = !botConfig.antiRaid.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.antiRaid.enabled });
});

// ==================== VERIFICATION ====================
app.get('/api/verification', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.verification || { enabled: false });
});

app.post('/api/verification/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.verification) botConfig.verification = { enabled: false };
    botConfig.verification[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/verification/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.verification) botConfig.verification = { enabled: false };
    botConfig.verification.enabled = !botConfig.verification.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.verification.enabled });
});

// ==================== MODERATION ====================
app.get('/api/moderation', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.moderation || { enabled: false });
});

app.post('/api/moderation/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.moderation) botConfig.moderation = { enabled: false };
    botConfig.moderation[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== AUTO ROLE ====================
app.get('/api/autorole', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.autoRole || { enabled: false, roles: [], botRoles: [], delay: 0, ignoreBots: true, ignoreRoles: [] });
});

app.post('/api/autorole/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.autoRole) botConfig.autoRole = { enabled: false, roles: [], botRoles: [], delay: 0, ignoreBots: true, ignoreRoles: [] };
    botConfig.autoRole[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/autorole/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.autoRole) botConfig.autoRole = { enabled: false, roles: [], botRoles: [], delay: 0, ignoreBots: true, ignoreRoles: [] };
    botConfig.autoRole.enabled = !botConfig.autoRole.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.autoRole.enabled });
});

app.post('/api/autorole/add-role', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { roleId, type } = req.body;
    if (!botConfig.autoRole) botConfig.autoRole = { enabled: false, roles: [], botRoles: [], delay: 0, ignoreBots: true, ignoreRoles: [] };
    if (!botConfig.autoRole[type]) botConfig.autoRole[type] = [];
    if (!botConfig.autoRole[type].includes(roleId)) {
        botConfig.autoRole[type].push(roleId);
        saveConfig();
    }
    res.json({ success: true, data: botConfig.autoRole[type] });
});

app.post('/api/autorole/remove-role', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { roleId, type } = req.body;
    if (botConfig.autoRole && botConfig.autoRole[type]) {
        botConfig.autoRole[type] = botConfig.autoRole[type].filter(x => x !== roleId);
        saveConfig();
    }
    res.json({ success: true });
});

// ==================== LOG CHANNELS ====================
app.get('/api/logs/channels', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.logChannels || {});
});

app.post('/api/logs/set-channel', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { type, channelId } = req.body;
    if (!botConfig.logChannels) botConfig.logChannels = {};
    botConfig.logChannels[type] = channelId;
    saveConfig();
    res.json({ success: true });
});

// ==================== WELCOME ====================
app.get('/api/welcome', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.welcome || { enabled: false });
});

app.post('/api/welcome/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.welcome) botConfig.welcome = { enabled: false };
    botConfig.welcome[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/welcome/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.welcome) botConfig.welcome = { enabled: false };
    botConfig.welcome.enabled = !botConfig.welcome.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.welcome.enabled });
});

// ==================== GOODBYE ====================
app.get('/api/goodbye', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.goodbye || { enabled: false });
});

app.post('/api/goodbye/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.goodbye) botConfig.goodbye = { enabled: false };
    botConfig.goodbye[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== REACTION ROLES ====================
app.get('/api/reactionroles', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.reactionRoles || { enabled: false, roles: [] });
});

app.post('/api/reactionroles/add', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { messageId, emoji, roleId, channelId } = req.body;
    if (!botConfig.reactionRoles) botConfig.reactionRoles = { enabled: false, roles: [] };
    if (!botConfig.reactionRoles.roles) botConfig.reactionRoles.roles = [];
    botConfig.reactionRoles.roles.push({ messageId, emoji, roleId, channelId });
    saveConfig();
    res.json({ success: true });
});

app.post('/api/reactionroles/remove', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { index } = req.body;
    if (botConfig.reactionRoles && botConfig.reactionRoles.roles) {
        botConfig.reactionRoles.roles.splice(index, 1);
        saveConfig();
    }
    res.json({ success: true });
});

// ==================== INVITE TRACKER ====================
app.get('/api/invitetracker', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.inviteTracker || { enabled: false });
});

app.post('/api/invitetracker/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.inviteTracker) botConfig.inviteTracker = { enabled: false };
    botConfig.inviteTracker[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== LEVELS ====================
app.get('/api/levels', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.levels || {});
});

app.post('/api/levels/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.levels) botConfig.levels = {};
    botConfig.levels[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/levels/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    if (!botConfig.levels) botConfig.levels = { enabled: false };
    botConfig.levels.enabled = !botConfig.levels.enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.levels.enabled });
});

app.post('/api/levels/add-role', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { level, roleId } = req.body;
    if (!botConfig.levels) botConfig.levels = { roles: {} };
    if (!botConfig.levels.roles) botConfig.levels.roles = {};
    botConfig.levels.roles[level] = roleId;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/levels/remove-role', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { level } = req.body;
    if (botConfig.levels && botConfig.levels.roles) {
        delete botConfig.levels.roles[level];
        saveConfig();
    }
    res.json({ success: true });
});

// ==================== TICKETS ====================
app.get('/api/tickets', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.tickets || {});
});

app.post('/api/tickets/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.tickets) botConfig.tickets = {};
    botConfig.tickets[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== GIVEAWAYS ====================
app.get('/api/giveaways', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.giveaways || {});
});

app.post('/api/giveaways/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.giveaways) botConfig.giveaways = {};
    botConfig.giveaways[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== WARNS ====================
app.get('/api/warns', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.warns || {});
});

app.post('/api/warns/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.warns) botConfig.warns = {};
    botConfig.warns[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== GAMES ====================
app.get('/api/games', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.games || {});
});

app.post('/api/games/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.games) botConfig.games = {};
    botConfig.games[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== ANNOUNCEMENTS ====================
app.get('/api/announcements', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.announcements || {});
});

app.post('/api/announcements/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.announcements) botConfig.announcements = {};
    botConfig.announcements[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ==================== COLOR ROLES ====================
app.get('/api/colorroles', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.colorRoles || {});
});

app.post('/api/colorroles/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { field, value } = req.body;
    if (!botConfig.colorRoles) botConfig.colorRoles = {};
    botConfig.colorRoles[field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/colorroles/add', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { colorName, roleId } = req.body;
    if (!botConfig.colorRoles) botConfig.colorRoles = { roles: {} };
    if (!botConfig.colorRoles.roles) botConfig.colorRoles.roles = {};
    botConfig.colorRoles.roles[colorName] = roleId;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/colorroles/remove', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { colorName } = req.body;
    if (botConfig.colorRoles && botConfig.colorRoles.roles) {
        delete botConfig.colorRoles.roles[colorName];
        saveConfig();
    }
    res.json({ success: true });
});

// ==================== UTILITY ====================
app.get('/api/utility', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.utility || {});
});

app.post('/api/utility/update', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { command, field, value } = req.body;
    if (!botConfig.utility) botConfig.utility = {};
    if (!botConfig.utility[command]) botConfig.utility[command] = {};
    botConfig.utility[command][field] = value;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/utility/toggle', (req, res) => {
    if (!botConfig) return res.status(500).json({ error: 'Bot not ready' });
    const { command } = req.body;
    if (!botConfig.utility) botConfig.utility = {};
    if (!botConfig.utility[command]) botConfig.utility[command] = { enabled: false };
    botConfig.utility[command].enabled = !botConfig.utility[command].enabled;
    saveConfig();
    res.json({ success: true, enabled: botConfig.utility[command].enabled });
});

// ==================== START ====================
function startDashboard(client, config) {
    setBot(client, config);
    app.listen(PORT, () => {
        console.log(`✅ Dashboard running on http://localhost:${PORT}`);
    });
}

module.exports = { startDashboard, app };
