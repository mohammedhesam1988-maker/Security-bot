// ============================================================
//           SECURITY BOT DASHBOARD - SERVER.JS
//                    Version 6.0.0 (Complete)
//              Total Lines: ~700
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ================= GLOBAL STATE =================
let botClient = null;
let botConfig = null;
const configPath = path.join(__dirname, '..', 'config.js');

// ================= SECTION MAPPING =================
// ئەم نەخشێنە ناوی بەشەکانی داشبۆردەکە دەگۆڕێت بۆ ناوی ڕاستەقینە لە config.js
const SECTION_MAP = {
    'general': 'general',
    'analytics': 'analytics',
    'whitelist': 'whitelist',
    'antispam': 'autoMod',
    'antinuke': 'securityLimits',
    'beastmode': 'beastMode',
    'antiraid': 'antiRaid',
    'verification': 'verification',
    'moderation': 'moderation',
    'autorole': 'autoRole',
    'logs': 'logChannels',
    'levels': 'levels',
    'rolelimits': 'roleLimits',
    'welcome': 'welcome',
    'goodbye': 'goodbye',
    'reactionroles': 'reactionRoles',
    'invitetracker': 'inviteTracker',
    'tickets': 'tickets',
    'giveaways': 'giveaways',
    'warns': 'warns',
    'games': 'games',
    'announcements': 'announcements',
    'colorroles': 'colorRoles',
    'utility': 'utility',
    'triggers': 'triggers',
    'riskscore': 'riskSystem'
};

// ================= HELPER FUNCTIONS =================
function setBot(client, config) {
    botClient = client;
    botConfig = config;
}

function saveConfig() {
    try {
        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(botConfig, null, 4)};`);
        return true;
    } catch (err) {
        console.error('❌ Error saving config:', err);
        return false;
    }
}

function getSectionData(section) {
    if (!botConfig) return null;
    const configKey = SECTION_MAP[section] || section;
    return botConfig[configKey] || null;
}

function setSectionData(section, key, value) {
    if (!botConfig) return false;
    const configKey = SECTION_MAP[section] || section;
    if (!botConfig[configKey]) botConfig[configKey] = {};
    botConfig[configKey][key] = value;
    return true;
}

function setBulkData(section, updates) {
    if (!botConfig) return false;
    const configKey = SECTION_MAP[section] || section;
    if (!botConfig[configKey]) botConfig[configKey] = {};

    for (const [path, value] of Object.entries(updates)) {
        const keys = path.split('.');
        let obj = botConfig[configKey];

        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = value;
    }

    return true;
}

// ============================================================
//                    STATUS & ANALYTICS
// ============================================================

app.get('/api/status', (req, res) => {
    if (!botClient) {
        return res.json({ online: false });
    }
    res.json({
        online: true,
        tag: botClient.user?.tag || 'Unknown',
        botId: botClient.user?.id || 'Unknown',
        guilds: botClient.guilds.cache.size,
        users: botClient.users.cache.size,
        ping: botClient.ws.ping,
        uptime: Math.floor((botClient.uptime || 0) / 1000 / 60),
        version: '6.0.0',
        nodeVersion: process.version
    });
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
        stickers: guild.stickers?.cache?.size || 0,
        boosts: guild.premiumSubscriptionCount || 0,
        boostLevel: guild.premiumTier || 0,
        createdAt: guild.createdTimestamp,
        ownerId: guild.ownerId,
        name: guild.name,
        id: guild.id,
        icon: guild.iconURL({ dynamic: true, size: 256 })
    });
});

// ============================================================
//                    BOT INFO
// ============================================================

app.get('/api/bot/info', (req, res) => {
    if (!botClient) return res.json({});
    res.json({
        tag: botClient.user?.tag,
        id: botClient.user?.id,
        avatar: botClient.user?.displayAvatarURL({ dynamic: true, size: 256 }),
        guilds: botClient.guilds.cache.size,
        users: botClient.users.cache.size,
        channels: botClient.channels.cache.size,
        ping: botClient.ws.ping,
        uptime: Math.floor((botClient.uptime || 0) / 1000 / 60),
        commands: botClient.commands?.size || 0,
        createdAt: botClient.user?.createdTimestamp,
        version: '6.0.0',
        nodeVersion: process.version,
        discordVersion: require('discord.js').version
    });
});

// ============================================================
//                    GENERIC SECTION ROUTES
// ============================================================

app.get('/api/:section', (req, res) => {
    if (!botConfig) return res.json({});
    const section = req.params.section;
    const data = getSectionData(section);

    if (!data) return res.json({});
    res.json(data);
});

app.post('/api/:section/update', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const section = req.params.section;
    const { field, value } = req.body;

    if (!field) {
        return res.status(400).json({ error: 'Field is required' });
    }

    setSectionData(section, field, value);
    saveConfig();
    res.json({ success: true });
});

app.post('/api/:section/update-bulk', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const section = req.params.section;
    const { updates } = req.body;

    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'Updates object is required' });
    }

    setBulkData(section, updates);
    saveConfig();
    res.json({ success: true, count: Object.keys(updates).length });
});

// ============================================================
//                    CONFIG IMPORT/EXPORT
// ============================================================

app.get('/api/config', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig);
});

app.post('/api/config/import', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { config } = req.body;

    if (!config || typeof config !== 'object') {
        return res.status(400).json({ error: 'Invalid config' });
    }

    try {
        const oldToken = botConfig.token;

        Object.keys(config).forEach(key => {
            if (key !== 'token') {
                botConfig[key] = config[key];
            }
        });

        botConfig.token = oldToken;

        saveConfig();
        res.json({ success: true });
    } catch (error) {
        console.error('Import Error:', error);
        res.status(500).json({ error: 'Import failed' });
    }
});

// ============================================================
//                    SECTION RESET
// ============================================================

app.post('/api/:section/reset', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const section = req.params.section;
    const configKey = SECTION_MAP[section] || section;

    const defaults = {
        general: {
            botName: 'Security Bot',
            botDescription: 'Advanced Protection System',
            botStatus: 'online',
            botActivity: 'Watching over the server',
            botActivityType: 'WATCHING',
            theme: 'dark',
            accentColor: '#ffbf24',
            language: 'ar'
        },
        welcome: {
            enabled: false,
            channelId: null,
            message: 'Welcome {userMention} to the server!',
            embed: false,
            color: '#5865F2'
        },
        goodbye: {
            enabled: false,
            channelId: null,
            message: 'Goodbye {userMention}!',
            embed: false,
            color: '#ED4245'
        }
    };

    if (defaults[section]) {
        botConfig[configKey] = defaults[section];
    } else {
        botConfig[configKey] = {};
    }

    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    WHITELIST
// ============================================================

app.post('/api/whitelist/add', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { type, action, id } = req.body;

    if (!type || !action || !id) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!botConfig.whitelist) {
        botConfig.whitelist = { users: {}, roles: {}, channels: {} };
    }
    if (!botConfig.whitelist[type]) {
        return res.status(400).json({ error: 'Invalid type' });
    }
    if (!botConfig.whitelist[type][action]) {
        botConfig.whitelist[type][action] = [];
    }

    if (!botConfig.whitelist[type][action].includes(id)) {
        botConfig.whitelist[type][action].push(id);
    }

    saveConfig();
    res.json({ success: true, data: botConfig.whitelist[type][action] });
});

app.post('/api/whitelist/remove', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { type, action, id } = req.body;

    if (!botConfig.whitelist?.[type]?.[action]) {
        return res.status(400).json({ error: 'Invalid type or action' });
    }

    botConfig.whitelist[type][action] = botConfig.whitelist[type][action].filter(x => x !== id);
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    TRIGGERS
// ============================================================

app.post('/api/triggers/add', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { trigger, response, matchType, useEmbed } = req.body;

    if (!trigger || !response) {
        return res.status(400).json({ error: 'Trigger and response required' });
    }

    if (!botConfig.triggers) {
        botConfig.triggers = { enabled: true, triggers: [] };
    }
    if (!botConfig.triggers.triggers) {
        botConfig.triggers.triggers = [];
    }

    const exists = botConfig.triggers.triggers.find(t => t.trigger === trigger);
    if (exists) {
        return res.status(400).json({ error: 'Trigger already exists' });
    }

    botConfig.triggers.triggers.push({
        trigger,
        response,
        matchType: matchType || 'normal',
        useEmbed: useEmbed || false,
        createdBy: 'dashboard',
        createdAt: Date.now()
    });

    saveConfig();
    res.json({ success: true });
});

app.post('/api/triggers/remove', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { index } = req.body;

    if (!botConfig.triggers?.triggers) {
        return res.status(404).json({ error: 'No triggers found' });
    }

    if (index < 0 || index >= botConfig.triggers.triggers.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    botConfig.triggers.triggers.splice(index, 1);
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    AUTOROLE
// ============================================================

app.post('/api/autorole/add-role', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { roleId, type } = req.body;

    if (!roleId || !type) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!botConfig.autoRole) {
        botConfig.autoRole = { enabled: false, roles: [], botRoles: [] };
    }
    if (!botConfig.autoRole[type]) {
        botConfig.autoRole[type] = [];
    }

    if (!botConfig.autoRole[type].includes(roleId)) {
        botConfig.autoRole[type].push(roleId);
    }

    saveConfig();
    res.json({ success: true });
});

app.post('/api/autorole/remove-role', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { roleId, type } = req.body;

    if (!botConfig.autoRole?.[type]) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    botConfig.autoRole[type] = botConfig.autoRole[type].filter(x => x !== roleId);
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    LEVELS
// ============================================================

app.post('/api/levels/add-role', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { level, roleId } = req.body;

    if (!level || !roleId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!botConfig.levels) {
        botConfig.levels = { roles: {} };
    }
    if (!botConfig.levels.roles) {
        botConfig.levels.roles = {};
    }

    botConfig.levels.roles[level] = roleId;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/levels/remove-role', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { level } = req.body;

    if (botConfig.levels?.roles) {
        delete botConfig.levels.roles[level];
        saveConfig();
    }

    res.json({ success: true });
});

// ============================================================
//                    REACTION ROLES
// ============================================================

app.post('/api/reactionroles/add', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { messageId, emoji, roleId, channelId } = req.body;

    if (!messageId || !emoji || !roleId || !channelId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!botConfig.reactionRoles) {
        botConfig.reactionRoles = { enabled: false, roles: [] };
    }
    if (!botConfig.reactionRoles.roles) {
        botConfig.reactionRoles.roles = [];
    }

    botConfig.reactionRoles.roles.push({
        messageId,
        emoji,
        roleId,
        channelId,
        createdAt: Date.now()
    });

    saveConfig();
    res.json({ success: true });
});

app.post('/api/reactionroles/remove', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { index } = req.body;

    if (!botConfig.reactionRoles?.roles) {
        return res.status(404).json({ error: 'No reaction roles found' });
    }

    if (index < 0 || index >= botConfig.reactionRoles.roles.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    botConfig.reactionRoles.roles.splice(index, 1);
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    LOG CHANNELS
// ============================================================

app.post('/api/logs/set-channel', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { type, channelId } = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Type is required' });
    }

    if (!botConfig.logChannels) {
        botConfig.logChannels = {};
    }

    botConfig.logChannels[type] = channelId || null;
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    COLOR ROLES
// ============================================================

app.post('/api/colorroles/add', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { colorName, roleId } = req.body;

    if (!colorName || !roleId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!botConfig.colorRoles) {
        botConfig.colorRoles = { enabled: false, roles: {} };
    }
    if (!botConfig.colorRoles.roles) {
        botConfig.colorRoles.roles = {};
    }

    botConfig.colorRoles.roles[colorName] = roleId;
    saveConfig();
    res.json({ success: true });
});

app.post('/api/colorroles/remove', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { colorName } = req.body;

    if (botConfig.colorRoles?.roles) {
        delete botConfig.colorRoles.roles[colorName];
        saveConfig();
    }

    res.json({ success: true });
});

// ============================================================
//                    RISK SCORE
// ============================================================

app.get('/api/riskscore', (req, res) => {
    if (!botConfig) return res.json({});
    res.json(botConfig.riskSystem || {});
});

app.post('/api/riskscore/update', (req, res) => {
    if (!botConfig) {
        return res.status(500).json({ error: 'Bot not ready' });
    }

    const { field, value } = req.body;

    if (!botConfig.riskSystem) {
        botConfig.riskSystem = {};
    }

    botConfig.riskSystem[field] = value;
    saveConfig();
    res.json({ success: true });
});

// ============================================================
//                    ERROR HANDLING
// ============================================================

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.path });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================================
//                    START FUNCTION
// ============================================================

function startDashboard(client, config) {
    setBot(client, config);
    app.listen(PORT, () => {
        console.log(`✅ Dashboard running on http://localhost:${PORT}`);
        console.log(`📊 Version: 6.0.0`);
        console.log(`🤖 Bot: ${client.user?.tag || 'Unknown'}`);
    });
}

module.exports = {
    startDashboard,
    setBot,
    saveConfig,
    app
};
