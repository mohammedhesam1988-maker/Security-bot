// ============================================================
//           SECURITY BOT DASHBOARD - SCRIPT.JS
//                    Version 8.0.0 (English)
// ============================================================

// ================= CONFIGURATION =================
const CONFIG = {
    API_BASE: window.location.origin + '/api',
    TOAST_DURATION: 3000,
    AUTO_SAVE_INTERVAL: 60000,
    SEARCH_DEBOUNCE: 300,
    VERSION: '8.0.0',
    DEBUG: false
};

// ================= API HANDLER =================
const API = {
    get: async (path) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE}${path}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`GET ${path}:`, error);
            return null;
        }
    },
    post: async (path, data) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`POST ${path}:`, error);
            return { success: false };
        }
    }
};

// ================= STATE =================
const state = {
    currentSection: 'general',
    data: {},
    originalData: {},
    loadedSections: new Set(),
    searchTerm: '',
    filter: 'all',
    unsavedChanges: false,
    history: [],
    notificationCount: 0,
    theme: 'dark',
    sidebarCollapsed: false
};

// ================= SECTION TITLES =================
const SECTION_TITLES = {
    general: 'General Settings',
    analytics: 'Analytics',
    whitelist: 'Whitelist',
    antispam: 'Anti-Spam',
    antinuke: 'Anti-Nuke',
    beastmode: 'Beast Mode',
    antiraid: 'Anti-Raid',
    verification: 'Verification',
    moderation: 'Moderation',
    autorole: 'Auto Role',
    logs: 'Logs',
    levels: 'Levels',
    rolelimits: 'Role Limits',
    welcome: 'Welcome',
    goodbye: 'Goodbye',
    reactionroles: 'Reaction Roles',
    invitetracker: 'Invite Tracker',
    tickets: 'Tickets',
    giveaways: 'Giveaways',
    warns: 'Warns',
    games: 'Games',
    announcements: 'Announcements',
    colorroles: 'Color Roles',
    utility: 'Utility',
    triggers: 'Triggers',
    riskscore: 'Risk Score'
};

// ================= LABEL NAMES (ALL ENGLISH) =================
const LABEL_NAMES = {
    // General
    enabled: 'Enabled',
    channelId: 'Channel ID',
    roles: 'Roles',
    users: 'Users',
    channels: 'Channels',
    max: 'Max',
    min: 'Min',
    punishment: 'Punishment',
    thresholds: 'Thresholds',
    message: 'Message',
    color: 'Color',
    embed: 'Embed',
    logChannelId: 'Log Channel ID',
    categoryId: 'Category ID',
    supportRoleId: 'Support Role ID',
    maxTickets: 'Max Tickets',
    minAccountAge: 'Min Account Age',
    joinRate: 'Join Rate',
    timeWindow: 'Time Window',
    autoLockdown: 'Auto Lockdown',
    lockdownDuration: 'Lockdown Duration',
    autoPunish: 'Auto Punish',
    maxWarns: 'Max Warns',
    cooldown: 'Cooldown',
    levelUpChannel: 'Level Up Channel',
    requireBoost: 'Require Boost',
    requiredLevel: 'Required Level',
    allowedDomains: 'Allowed Domains',
    words: 'Words',
    threshold: 'Threshold',
    window: 'Window',
    maxJoins: 'Max Joins',
    maxConnects: 'Max Connects',
    botName: 'Bot Name',
    botDescription: 'Bot Description',
    botStatus: 'Bot Status',
    botActivity: 'Bot Activity',
    botActivityType: 'Activity Type',
    dmMessage: 'DM Message',
    mentionUser: 'Mention User',
    sendDM: 'Send DM',
    imageUrl: 'Image URL',
    thumbnailUrl: 'Thumbnail URL',
    footer: 'Footer',
    footerIcon: 'Footer Icon',
    emoji: 'Emoji',
    disabledChannels: 'Disabled Channels',
    disabledRoles: 'Disabled Roles',
    disabledUsers: 'Disabled Users',
    maxLimit: 'Max Limit',
    limitWindow: 'Limit Window',
    customName: 'Custom Name',
    aliases: 'Aliases',
    autoDeleteMessage: 'Auto Delete Message',
    autoDeleteInvocation: 'Auto Delete Invocation',
    autoDeleteReply: 'Auto Delete Reply',
    autoDelete: 'Auto Delete',
    autoDeleteDelay: 'Auto Delete Delay',
    messageXp: 'Message XP',
    voiceXp: 'Voice XP',
    xpPerMessage: 'XP Per Message',
    pointsPerMessage: 'Points Per Message',
    pointsPerVoice: 'Points Per Voice',
    levelUpMessage: 'Level Up Message',
    levelUpEmbed: 'Level Up Embed',
    levelUpColor: 'Level Up Color',
    announceInDM: 'Announce in DM',
    maxLevel: 'Max Level',
    xpMultiplier: 'XP Multiplier',
    roleRewards: 'Role Rewards',
    ignoreChannels: 'Ignore Channels',
    ignoreRoles: 'Ignore Roles',
    ignoreUsers: 'Ignore Users',
    streakBonus: 'Streak Bonus',
    streakMultiplier: 'Streak Multiplier',
    decayEnabled: 'Decay Enabled',
    decayDays: 'Decay Days',
    decayAmount: 'Decay Amount',
    checkAvatar: 'Check Avatar',
    checkUsername: 'Check Username',
    autoBan: 'Auto Ban',
    autoBanThreshold: 'Auto Ban Threshold',
    whitelistBots: 'Whitelist Bots',
    maxJoinsPerUser: 'Max Joins Per User',
    duplicateNameCheck: 'Duplicate Name Check',
    duplicateAvatarCheck: 'Duplicate Avatar Check',
    ignoreBots: 'Ignore Bots',
    requireVerification: 'Require Verification',
    humanOnly: 'Human Only',
    roleDelay: 'Role Delay',
    botRoles: 'Bot Roles',
    // AntiSpam
    spam: 'Spam',
    invites: 'Invites',
    links: 'Links',
    phishing: 'Phishing',
    bannedWords: 'Banned Words',
    caps: 'Caps',
    mentions: 'Mentions',
    duplicates: 'Duplicates',
    zalgo: 'Zalgo',
    charRepeat: 'Char Repeat',
    personalInfo: 'Personal Info',
    massMention: 'Mass Mention',
    stickerSpam: 'Sticker Spam',
    attachmentSpam: 'Attachment Spam',
    voiceSpam: 'Voice Spam',
    voiceConnectSpam: 'Voice Connect Spam',
    voiceMuteSpam: 'Voice Mute Spam',
    voiceDeafenSpam: 'Voice Deafen Spam',
    voiceJoinLeaveSpam: 'Voice Join/Leave Spam',
    voiceMoveSpam: 'Voice Move Spam',
    mentionEveryone: 'Mention Everyone',
    nsfwContent: 'NSFW Content',
    toxicWords: 'Toxic Words',
    racialSlurs: 'Racial Slurs',
    selfBot: 'Self Bot',
    tokenGrabber: 'Token Grabber',
    // AntiNuke
    ban: 'Ban',
    kick: 'Kick',
    channelCreate: 'Channel Create',
    channelDelete: 'Channel Delete',
    channelUpdate: 'Channel Update',
    channelPermissionsUpdate: 'Channel Permissions Update',
    mention: 'Mention',
    botAdd: 'Bot Add',
    prune: 'Prune',
    vanityChange: 'Vanity Change',
    serverRename: 'Server Rename',
    serverIconChange: 'Server Icon Change',
    channelRename: 'Channel Rename',
    channelTopicChange: 'Channel Topic Change',
    emojiCreate: 'Emoji Create',
    emojiDelete: 'Emoji Delete',
    inviteDelete: 'Invite Delete',
    inviteLink: 'Invite Link',
    ghostPing: 'Ghost Ping',
    webhookCreate: 'Webhook Create',
    webhookDelete: 'Webhook Delete',
    webhookUpdate: 'Webhook Update',
    threadCreate: 'Thread Create',
    threadDelete: 'Thread Delete',
    stickerCreate: 'Sticker Create',
    stickerDelete: 'Sticker Delete',
    roleCreate: 'Role Create',
    roleDelete: 'Role Delete',
    roleRename: 'Role Rename',
    roleUpdate: 'Role Update',
    roleAdd: 'Role Add',
    dangerousRolePermissions: 'Dangerous Role Permissions',
    dangerousRoleAdd: 'Dangerous Role Add',
    all: 'All'
};

// ================= TOAST =================
function showToast(msg, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };
    t.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(20px)';
        setTimeout(() => t.remove(), 300);
    }, CONFIG.TOAST_DURATION);
}

// ================= NAVIGATION =================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const s = item.dataset.section;
            if (!s) return;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadSection(s);
        });
    });
}

// ================= LOAD SECTION =================
async function loadSection(section) {
    state.currentSection = section;
    const content = document.getElementById('content');
    const title = document.getElementById('pageTitle');

    if (title) title.textContent = SECTION_TITLES[section] || section;
    content.innerHTML = `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:300px;gap:16px;"><div class="loading"></div><p style="color:var(--text-muted);">Loading...</p></div>`;

    try {
        const data = await API.get(`/${section}`);
        state.data = data || {};
        state.originalData = JSON.parse(JSON.stringify(data || {}));
        state.loadedSections.add(section);
        renderSection(section, state.data);
        updateSaveButtonState(false);
    } catch (error) {
        console.error('Load Section Error:', error);
        content.innerHTML = `<div class="item-box"><h4 style="color:var(--danger);"><i class="fas fa-exclamation-triangle"></i> Error</h4><p style="color:var(--text-muted);">Error loading data: ${error.message}</p></div>`;
    }
}

// ================= UPDATE SAVE BUTTON =================
function updateSaveButtonState(hasChanges) {
    const saveBtn = document.getElementById('saveBtn');
    if (!saveBtn) return;
    if (hasChanges) {
        saveBtn.classList.add('has-changes');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save ●';
    } else {
        saveBtn.classList.remove('has-changes');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    }
    state.unsavedChanges = hasChanges;
}

// ================= RENDER SECTION =================
function renderSection(section, data) {
    const content = document.getElementById('content');
    if (!content) return;

    switch (section) {
        case 'analytics':
            content.innerHTML = renderAnalytics(data);
            loadAnalyticsStats();
            return;
        case 'whitelist':
            content.innerHTML = renderWhitelist(data);
            return;
        case 'utility':
            content.innerHTML = renderUtility(data);
            return;
        case 'triggers':
            content.innerHTML = renderTriggers(data);
            return;
        case 'welcome':
            content.innerHTML = renderWelcome(data);
            return;
        case 'goodbye':
            content.innerHTML = renderGoodbye(data);
            return;
        case 'autorole':
            content.innerHTML = renderAutoRole(data);
            return;
        case 'levels':
            content.innerHTML = renderLevels(data);
            return;
        case 'logs':
            content.innerHTML = renderLogs(data);
            return;
        case 'reactionroles':
            content.innerHTML = renderReactionRoles(data);
            return;
        case 'antispam':
            content.innerHTML = renderAntiSpam(data);
            return;
        case 'antinuke':
            content.innerHTML = renderAntiNuke(data);
            return;
        case 'beastmode':
            content.innerHTML = renderBeastMode(data);
            return;
        case 'antiraid':
            content.innerHTML = renderAntiRaid(data);
            return;
        case 'verification':
            content.innerHTML = renderVerification(data);
            return;
        case 'moderation':
            content.innerHTML = renderModeration(data);
            return;
        case 'rolelimits':
            content.innerHTML = renderRoleLimits(data);
            return;
        case 'games':
            content.innerHTML = renderGames(data);
            return;
        case 'announcements':
            content.innerHTML = renderAnnouncements(data);
            return;
        case 'colorroles':
            content.innerHTML = renderColorRoles(data);
            return;
        case 'invitetracker':
            content.innerHTML = renderInviteTracker(data);
            return;
        case 'tickets':
            content.innerHTML = renderTickets(data);
            return;
        case 'giveaways':
            content.innerHTML = renderGiveaways(data);
            return;
        case 'warns':
            content.innerHTML = renderWarns(data);
            return;
        case 'riskscore':
            content.innerHTML = renderRiskScore(data);
            return;
        default:
            content.innerHTML = renderUniversal(data);
    }
}

// ================= UNIVERSAL RENDERER =================
function renderUniversal(data, parentPath = '') {
    if (data === null || data === undefined) return '';
    if (typeof data !== 'object' || Array.isArray(data)) return '';

    let html = '';
    const keys = Object.keys(data);

    for (const key of keys) {
        const value = data[key];
        const path = parentPath ? `${parentPath}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            if (Object.keys(value).length === 0) continue;
            html += `<div class="item-box">
                <h4><i class="fas fa-folder"></i> ${formatLabel(key)}</h4>
                ${renderUniversal(value, path)}
            </div>`;
        } else {
            html += renderField(key, value, path);
        }
    }

    return html;
}

// ================= RENDER FIELD =================
function renderField(key, value, path) {
    const label = formatLabel(key);
    const dataPath = `data-config-path="${path}"`;

    if (typeof value === 'boolean') {
        return `<div class="setting-row">
            <span>${label}</span>
            <label class="toggle">
                <input type="checkbox" ${value ? 'checked' : ''} ${dataPath} data-type="boolean">
                <span class="toggle-slider"></span>
            </label>
        </div>`;
    }

    if (typeof value === 'number') {
        return `<div class="setting-row">
            <span>${label}</span>
            <input type="number" value="${value}" ${dataPath} data-type="number">
        </div>`;
    }

    if (Array.isArray(value)) {
        const displayValue = value.join(', ');
        return `<div class="setting-row">
            <span>${label}</span>
            <input type="text" value="${escapeHtml(displayValue)}" ${dataPath} data-type="array" placeholder="ID, ID, ID">
        </div>`;
    }

    const displayValue = value === null ? '' : String(value);
    return `<div class="setting-row">
        <span>${label}</span>
        <input type="text" value="${escapeHtml(displayValue)}" ${dataPath} data-type="string">
    </div>`;
}

// ================= HELPERS =================
function formatLabel(key) {
    return LABEL_NAMES[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ================= ANALYTICS =================
function renderAnalytics(data) {
    return `
        <div class="item-box">
            <h4><i class="fas fa-chart-line"></i> Server Statistics</h4>
            <div id="analyticsStats"><div class="loading"></div></div>
        </div>
        <div class="item-box">
            <h4><i class="fas fa-server"></i> Bot Information</h4>
            <div id="botInfo"><div class="loading"></div></div>
        </div>`;
}

async function loadAnalyticsStats() {
    const stats = await API.get('/analytics/stats');
    const el = document.getElementById('analyticsStats');
    if (el && stats) {
        el.innerHTML = `
            <div class="setting-row"><span>Server Name</span><span class="badge">${stats.name || 'Unknown'}</span></div>
            <div class="setting-row"><span>Members</span><span class="badge success">${stats.members || 0}</span></div>
            <div class="setting-row"><span>Channels</span><span class="badge">${stats.channels || 0}</span></div>
            <div class="setting-row"><span>Roles</span><span class="badge">${stats.roles || 0}</span></div>
            <div class="setting-row"><span>Emojis</span><span class="badge">${stats.emojis || 0}</span></div>
            <div class="setting-row"><span>Boosts</span><span class="badge warning">${stats.boosts || 0}</span></div>
        `;
    }

    const botInfo = await API.get('/bot/info');
    const botEl = document.getElementById('botInfo');
    if (botEl && botInfo) {
        botEl.innerHTML = `
            <div class="setting-row"><span>Tag</span><span class="badge">${botInfo.tag || 'Unknown'}</span></div>
            <div class="setting-row"><span>Guilds</span><span class="badge">${botInfo.guilds || 0}</span></div>
            <div class="setting-row"><span>Users</span><span class="badge">${botInfo.users || 0}</span></div>
            <div class="setting-row"><span>Ping</span><span class="badge success">${botInfo.ping || 0}ms</span></div>
            <div class="setting-row"><span>Uptime</span><span class="badge">${botInfo.uptime || 0} min</span></div>
            <div class="setting-row"><span>Commands</span><span class="badge">${botInfo.commands || 0}</span></div>
        `;
    }
}

// ================= WHITELIST =================
function renderWhitelist(data) {
    const actions = [
        'all', 'ban', 'kick', 'botAdd', 'roleUpdate', 'roleAdd',
        'channelCreate', 'channelDelete', 'roleCreate', 'roleDelete',
        'inviteLink', 'prune', 'mention', 'channelUpdate',
        'channelPermissionsUpdate', 'channelRename', 'channelTopicChange',
        'roleRename', 'dangerousRolePermissions', 'dangerousRoleAdd',
        'serverRename', 'serverIconChange', 'vanityChange',
        'emojiCreate', 'emojiDelete', 'stickerCreate', 'stickerDelete',
        'webhookCreate', 'webhookDelete', 'webhookUpdate',
        'threadCreate', 'threadDelete', 'ghostPing',
        'voiceSpam', 'voiceConnectSpam'
    ];

    const types = [
        { key: 'users', icon: 'users', label: 'Users' },
        { key: 'roles', icon: 'user-tag', label: 'Roles' },
        { key: 'channels', icon: 'hashtag', label: 'Channels' }
    ];

    let html = `<div class="item-box">
        <h4><i class="fas fa-info-circle"></i> Guide</h4>
        <p style="color:var(--text-muted);font-size:13px;">Whitelist for users who can perform actions without Anti-Nuke interfering. Separate IDs with commas (,).</p>
    </div>`;

    types.forEach(({ key, icon, label }) => {
        html += `<div class="item-box">
            <h4><i class="fas fa-${icon}"></i> ${label}</h4>`;

        actions.forEach(action => {
            const items = data?.[key]?.[action] || [];
            const actionLabel = LABEL_NAMES[action] || action;

            html += `<div class="setting-row">
                <span>${actionLabel}</span>
                <input type="text" value="${escapeHtml(items.join(', '))}" data-config-path="whitelist.${key}.${action}" data-type="array" placeholder="ID, ID, ID" style="min-width:300px;">
            </div>`;
        });

        html += `</div>`;
    });

    return html;
}

// ================= UTILITY =================
function renderUtility(data) {
    if (!data || typeof data !== 'object') {
        return `<div class="item-box"><h4><i class="fas fa-wrench"></i> Utility</h4><p style="color:var(--text-muted);">No data available</p></div>`;
    }

    let html = `<div class="item-box">
        <h4><i class="fas fa-info-circle"></i> Guide</h4>
        <p style="color:var(--text-muted);font-size:13px;">Configure all utility commands here.</p>
    </div>`;

    Object.keys(data).forEach(command => {
        const settings = data[command];
        if (!settings || typeof settings !== 'object') return;

        html += `<div class="item-box">
            <h4><i class="fas fa-terminal"></i> /${command}</h4>
            ${renderUniversal(settings, `utility.${command}`)}
        </div>`;
    });

    return html;
}

// ================= TRIGGERS =================
function renderTriggers(data) {
    const triggers = data?.triggers || [];

    let html = `<div class="item-box">
        <h4><i class="fas fa-bolt"></i> Trigger Settings</h4>
        ${renderField('enabled', data?.enabled || false, 'triggers.enabled')}
        ${renderField('maxTriggers', data?.maxTriggers || 50, 'triggers.maxTriggers')}
        ${renderField('cooldown', data?.cooldown || 5000, 'triggers.cooldown')}
        ${renderField('deleteAfter', data?.deleteAfter || 0, 'triggers.deleteAfter')}
        ${renderField('replyToUser', data?.replyToUser ?? true, 'triggers.replyToUser')}
        ${renderField('useEmbed', data?.useEmbed || false, 'triggers.useEmbed')}
        ${renderField('embedColor', data?.embedColor || '#5865F2', 'triggers.embedColor')}
        ${renderField('matchType', data?.matchType || 'normal', 'triggers.matchType')}
        ${renderField('caseSensitive', data?.caseSensitive || false, 'triggers.caseSensitive')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-plus"></i> Add New Trigger</h4>
        <div class="setting-row">
            <input type="text" id="trigger-name" placeholder="Trigger word or phrase" style="width:200px;">
            <input type="text" id="trigger-response" placeholder="Response" style="width:300px;">
            <button class="btn btn-primary btn-sm" onclick="addTrigger()">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    </div>

    <div class="item-box">
        <h4><i class="fas fa-list"></i> Triggers (${triggers.length})</h4>`;

    if (triggers.length === 0) {
        html += `<p style="color:var(--text-muted);">No triggers found</p>`;
    } else {
        triggers.forEach((t, i) => {
            html += `<div class="setting-row">
                <span><strong>${escapeHtml(t.trigger)}</strong> → ${escapeHtml((t.response || '').substring(0, 50))}...</span>
                <button class="btn btn-danger btn-sm" onclick="removeTrigger(${i})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>`;
        });
    }

    html += `</div>`;
    return html;
}

// ================= WELCOME =================
function renderWelcome(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-hand-wave"></i> Welcome</h4>
        ${renderField('enabled', data?.enabled || false, 'welcome.enabled')}
        ${renderField('channelId', data?.channelId || '', 'welcome.channelId')}
        ${renderField('message', data?.message || '', 'welcome.message')}
        ${renderField('embed', data?.embed || false, 'welcome.embed')}
        ${renderField('color', data?.color || '#5865F2', 'welcome.color')}
        ${renderField('imageUrl', data?.imageUrl || '', 'welcome.imageUrl')}
        ${renderField('thumbnailUrl', data?.thumbnailUrl || '', 'welcome.thumbnailUrl')}
        ${renderField('footer', data?.footer || '', 'welcome.footer')}
        ${renderField('emoji', data?.emoji || '', 'welcome.emoji')}
        ${renderField('mentionUser', data?.mentionUser ?? true, 'welcome.mentionUser')}
        ${renderField('sendDM', data?.sendDM || false, 'welcome.sendDM')}
        ${renderField('dmMessage', data?.dmMessage || '', 'welcome.dmMessage')}
        ${renderField('autoDelete', data?.autoDelete || false, 'welcome.autoDelete')}
        ${renderField('autoDeleteDelay', data?.autoDeleteDelay || 60000, 'welcome.autoDeleteDelay')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-eye"></i> Preview</h4>
        <div id="welcomePreview" style="padding:20px;background:var(--bg-primary);border-radius:10px;text-align:center;">
            <p style="color:var(--text-muted);">Welcome message will appear here</p>
        </div>
    </div>`;
}

// ================= GOODBYE =================
function renderGoodbye(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-hand-peace"></i> Goodbye</h4>
        ${renderField('enabled', data?.enabled || false, 'goodbye.enabled')}
        ${renderField('channelId', data?.channelId || '', 'goodbye.channelId')}
        ${renderField('message', data?.message || '', 'goodbye.message')}
        ${renderField('embed', data?.embed || false, 'goodbye.embed')}
        ${renderField('color', data?.color || '#ED4245', 'goodbye.color')}
        ${renderField('imageUrl', data?.imageUrl || '', 'goodbye.imageUrl')}
        ${renderField('thumbnailUrl', data?.thumbnailUrl || '', 'goodbye.thumbnailUrl')}
        ${renderField('footer', data?.footer || '', 'goodbye.footer')}
        ${renderField('emoji', data?.emoji || '', 'goodbye.emoji')}
        ${renderField('mentionUser', data?.mentionUser ?? true, 'goodbye.mentionUser')}
        ${renderField('sendDM', data?.sendDM || false, 'goodbye.sendDM')}
        ${renderField('dmMessage', data?.dmMessage || '', 'goodbye.dmMessage')}
        ${renderField('autoDelete', data?.autoDelete || false, 'goodbye.autoDelete')}
        ${renderField('autoDeleteDelay', data?.autoDeleteDelay || 60000, 'goodbye.autoDeleteDelay')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-eye"></i> Preview</h4>
        <div id="goodbyePreview" style="padding:20px;background:var(--bg-primary);border-radius:10px;text-align:center;">
            <p style="color:var(--text-muted);">Goodbye message will appear here</p>
        </div>
    </div>`;
}

// ================= AUTOROLE =================
function renderAutoRole(data) {
    const humanRoles = data?.roles || [];
    const botRoles = data?.botRoles || [];

    let html = `<div class="item-box">
        <h4><i class="fas fa-user-tag"></i> Auto Role Settings</h4>
        ${renderField('enabled', data?.enabled || false, 'autoRole.enabled')}
        ${renderField('delay', data?.delay || 0, 'autoRole.delay')}
        ${renderField('ignoreBots', data?.ignoreBots ?? true, 'autoRole.ignoreBots')}
        ${renderField('humanOnly', data?.humanOnly ?? true, 'autoRole.humanOnly')}
        ${renderField('requireVerification', data?.requireVerification || false, 'autoRole.requireVerification')}
        ${renderField('roleDelay', data?.roleDelay || 3000, 'autoRole.roleDelay')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-user"></i> Human Roles (${humanRoles.length})</h4>
        <div class="setting-row">
            <input type="text" id="human-role-input" placeholder="Role ID" style="width:250px;">
            <button class="btn btn-primary btn-sm" onclick="addAutoRole('roles')">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>`;

    humanRoles.forEach(r => {
        html += `<div class="setting-row">
            <span>${r}</span>
            <button class="btn btn-danger btn-sm" onclick="removeAutoRole('${r}', 'roles')">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>`;
    });

    html += `</div>

    <div class="item-box">
        <h4><i class="fas fa-robot"></i> Bot Roles (${botRoles.length})</h4>
        <div class="setting-row">
            <input type="text" id="bot-role-input" placeholder="Role ID" style="width:250px;">
            <button class="btn btn-primary btn-sm" onclick="addAutoRole('botRoles')">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>`;

    botRoles.forEach(r => {
        html += `<div class="setting-row">
            <span>${r}</span>
            <button class="btn btn-danger btn-sm" onclick="removeAutoRole('${r}', 'botRoles')">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>`;
    });

    html += `</div>`;
    return html;
}

// ================= LEVELS =================
function renderLevels(data) {
    const roleRewards = data?.roleRewards || [];

    let html = `<div class="item-box">
        <h4><i class="fas fa-trophy"></i> Level Settings</h4>
        ${renderField('enabled', data?.enabled || false, 'levels.enabled')}
        ${renderField('channelId', data?.channelId || '', 'levels.channelId')}
        ${renderField('pointsPerMessage', data?.pointsPerMessage || 5, 'levels.pointsPerMessage')}
        ${renderField('pointsPerVoice', data?.pointsPerVoice || 10, 'levels.pointsPerVoice')}
        ${renderField('cooldown', data?.cooldown || 60000, 'levels.cooldown')}
        ${renderField('levelUpChannel', data?.levelUpChannel || '', 'levels.levelUpChannel')}
        ${renderField('levelUpMessage', data?.levelUpMessage || '', 'levels.levelUpMessage')}
        ${renderField('levelUpEmbed', data?.levelUpEmbed ?? true, 'levels.levelUpEmbed')}
        ${renderField('levelUpColor', data?.levelUpColor || '#57F287', 'levels.levelUpColor')}
        ${renderField('announceInDM', data?.announceInDM || false, 'levels.announceInDM')}
        ${renderField('maxLevel', data?.maxLevel || 500, 'levels.maxLevel')}
        ${renderField('xpMultiplier', data?.xpMultiplier || 1, 'levels.xpMultiplier')}
        ${renderField('voiceXp', data?.voiceXp ?? true, 'levels.voiceXp')}
        ${renderField('messageXp', data?.messageXp ?? true, 'levels.messageXp')}
        ${renderField('streakBonus', data?.streakBonus ?? true, 'levels.streakBonus')}
        ${renderField('streakMultiplier', data?.streakMultiplier || 1.5, 'levels.streakMultiplier')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-award"></i> Role Rewards (${roleRewards.length})</h4>
        <div class="setting-row">
            <input type="number" id="level-input" placeholder="Level" style="width:100px;">
            <input type="text" id="role-input" placeholder="Role ID" style="width:250px;">
            <button class="btn btn-primary btn-sm" onclick="addLevelRole()">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>`;

    roleRewards.forEach((r) => {
        html += `<div class="setting-row">
            <span>Level ${r.level} → ${r.roleId || 'None'}</span>
            <button class="btn btn-danger btn-sm" onclick="removeLevelRole('${r.level}')">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>`;
    });

    if (roleRewards.length === 0) {
        html += `<p style="color:var(--text-muted);">No role rewards found</p>`;
    }

    html += `</div>`;
    return html;
}

// ================= LOGS =================
function renderLogs(data) {
    if (!data || typeof data !== 'object') {
        return `<div class="item-box"><h4>Logs</h4><p>No data available</p></div>`;
    }

    let html = `<div class="item-box">
        <h4><i class="fas fa-file-lines"></i> Log Channels</h4>`;

    Object.keys(data).forEach(key => {
        html += renderField(key, data[key], `logChannels.${key}`);
    });

    html += `</div>`;
    return html;
}

// ================= REACTION ROLES =================
function renderReactionRoles(data) {
    const roles = data?.roles || [];

    let html = `<div class="item-box">
        <h4><i class="fas fa-face-smile"></i> Reaction Role Settings</h4>
        ${renderField('enabled', data?.enabled || false, 'reactionRoles.enabled')}
        ${renderField('maxRolesPerUser', data?.maxRolesPerUser || 5, 'reactionRoles.maxRolesPerUser')}
        ${renderField('requireVerification', data?.requireVerification || false, 'reactionRoles.requireVerification')}
        ${renderField('removeOnUnreact', data?.removeOnUnreact ?? true, 'reactionRoles.removeOnUnreact')}
    </div>

    <div class="item-box">
        <h4><i class="fas fa-plus"></i> Add Reaction Role</h4>
        <div class="setting-row">
            <input type="text" id="rr-messageId" placeholder="Message ID" style="width:200px;">
            <input type="text" id="rr-emoji" placeholder="Emoji" style="width:80px;">
            <input type="text" id="rr-roleId" placeholder="Role ID" style="width:180px;">
            <input type="text" id="rr-channelId" placeholder="Channel ID" style="width:180px;">
            <button class="btn btn-primary btn-sm" onclick="addReactionRole()">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    </div>

    <div class="item-box">
        <h4><i class="fas fa-list"></i> Roles (${roles.length})</h4>`;

    roles.forEach((r, i) => {
        html += `<div class="setting-row">
            <span>${r.emoji || '❓'} → ${r.roleId || '❓'} (Message: ${r.messageId || '❓'})</span>
            <button class="btn btn-danger btn-sm" onclick="removeReactionRole(${i})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>`;
    });

    if (roles.length === 0) {
        html += `<p style="color:var(--text-muted);">No roles found</p>`;
    }

    html += `</div>`;
    return html;
}

// ================= ANTISPAM =================
function renderAntiSpam(data) {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return `<div class="item-box">
            <h4><i class="fas fa-shield-virus"></i> Anti-Spam</h4>
            <p style="color:var(--text-muted);">No data available</p>
        </div>`;
    }

    let html = `<div class="item-box">
        <h4><i class="fas fa-info-circle"></i> Guide</h4>
        <p style="color:var(--text-muted);font-size:13px;">Anti-Spam system to protect the server from spam messages and disruptive voice behavior.</p>
    </div>`;

    html += renderUniversal(data, 'autoMod');

    return html;
}

// ================= ANTINUKE =================
function renderAntiNuke(data) {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return `<div class="item-box">
            <h4><i class="fas fa-bomb"></i> Anti-Nuke</h4>
            <p style="color:var(--text-muted);">No data available</p>
        </div>`;
    }

    let html = `<div class="item-box">
        <h4><i class="fas fa-info-circle"></i> Guide</h4>
        <p style="color:var(--text-muted);font-size:13px;">Anti-Nuke system to protect the server from dangerous actions.</p>
    </div>`;

    html += renderUniversal(data, 'securityLimits');

    return html;
}

// ================= BEASTMODE =================
function renderBeastMode(data) {
    const actions = data?.actions || {};

    let html = `<div class="item-box">
        <h4><i class="fas fa-dragon"></i> Beast Mode</h4>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Beast Mode is a powerful protection system that applies severe punishments when activated.</p>
        ${renderField('enabled', data?.enabled || false, 'beastMode.enabled')}
        ${renderField('autoTrigger', data?.autoTrigger ?? true, 'beastMode.autoTrigger')}
        ${renderField('triggerThreshold', data?.triggerThreshold || 10, 'beastMode.triggerThreshold')}
        ${renderField('alertAll', data?.alertAll ?? true, 'beastMode.alertAll')}
        ${renderField('autoLockdown', data?.autoLockdown ?? true, 'beastMode.autoLockdown')}
    </div>`;

    if (Object.keys(actions).length > 0) {
        html += `<div class="item-box"><h4><i class="fas fa-list"></i> Actions</h4>`;

        Object.keys(actions).forEach(action => {
            html += `<div style="margin:16px 0;padding:16px;background:var(--bg-primary);border-radius:10px;border-right:3px solid #8B0000;">
                <h5 style="color:#8B0000;margin-bottom:12px;font-size:14px;">
                    <i class="fas fa-fire"></i> ${formatLabel(action)}
                </h5>
                ${renderUniversal(actions[action], `beastMode.actions.${action}`)}
            </div>`;
        });

        html += `</div>`;
    }

    return html;
}

// ================= ANTIRAID =================
function renderAntiRaid(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-users-slash"></i> Anti-Raid</h4>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Protection against mass member raids.</p>
        ${renderField('enabled', data?.enabled || false, 'antiRaid.enabled')}
        ${renderField('minAccountAge', data?.minAccountAge || 7, 'antiRaid.minAccountAge')}
        ${renderField('checkAvatar', data?.checkAvatar ?? true, 'antiRaid.checkAvatar')}
        ${renderField('checkUsername', data?.checkUsername ?? true, 'antiRaid.checkUsername')}
        ${renderField('joinRate', data?.joinRate || 5, 'antiRaid.joinRate')}
        ${renderField('timeWindow', data?.timeWindow || 10000, 'antiRaid.timeWindow')}
        ${renderField('punishment', data?.punishment || 'kick', 'antiRaid.punishment')}
        ${renderField('autoLockdown', data?.autoLockdown ?? true, 'antiRaid.autoLockdown')}
        ${renderField('lockdownDuration', data?.lockdownDuration || 300000, 'antiRaid.lockdownDuration')}
        ${renderField('maxJoinsPerUser', data?.maxJoinsPerUser || 3, 'antiRaid.maxJoinsPerUser')}
        ${renderField('duplicateNameCheck', data?.duplicateNameCheck ?? true, 'antiRaid.duplicateNameCheck')}
        ${renderField('duplicateAvatarCheck', data?.duplicateAvatarCheck ?? true, 'antiRaid.duplicateAvatarCheck')}
        ${renderField('autoBan', data?.autoBan || false, 'antiRaid.autoBan')}
        ${renderField('autoBanThreshold', data?.autoBanThreshold || 20, 'antiRaid.autoBanThreshold')}
    </div>`;
}

// ================= VERIFICATION =================
function renderVerification(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-user-check"></i> Verification</h4>
        ${renderField('enabled', data?.enabled || false, 'verification.enabled')}
        ${renderField('channelId', data?.channelId || '', 'verification.channelId')}
        ${renderField('roleId', data?.roleId || '', 'verification.roleId')}
        ${renderField('type', data?.type || 'button', 'verification.type')}
        ${renderField('captchaLength', data?.captchaLength || 6, 'verification.captchaLength')}
        ${renderField('captchaType', data?.captchaType || 'numbers', 'verification.captchaType')}
        ${renderField('timeout', data?.timeout || 300000, 'verification.timeout')}
        ${renderField('maxAttempts', data?.maxAttempts || 3, 'verification.maxAttempts')}
        ${renderField('kickOnFail', data?.kickOnFail || false, 'verification.kickOnFail')}
        ${renderField('logChannelId', data?.logChannelId || '', 'verification.logChannelId')}
        ${renderField('welcomeDM', data?.welcomeDM ?? true, 'verification.welcomeDM')}
        ${renderField('welcomeDMMessage', data?.welcomeDMMessage || '', 'verification.welcomeDMMessage')}
        ${renderField('autoVerify', data?.autoVerify || false, 'verification.autoVerify')}
    </div>`;
}

// ================= MODERATION =================
function renderModeration(data) {
    let html = `<div class="item-box">
        <h4><i class="fas fa-gavel"></i> Moderation</h4>
        ${renderField('enabled', data?.enabled || false, 'moderation.enabled')}
        ${renderField('logChannelId', data?.logChannelId || '', 'moderation.logChannelId')}
        ${renderField('muteRoleId', data?.muteRoleId || '', 'moderation.muteRoleId')}
        ${renderField('autoDeleteMessages', data?.autoDeleteMessages || false, 'moderation.autoDeleteMessages')}
        ${renderField('autoDeleteDelay', data?.autoDeleteDelay || 5000, 'moderation.autoDeleteDelay')}
        ${renderField('maxWarnings', data?.maxWarnings || 5, 'moderation.maxWarnings')}
        ${renderField('warningExpiry', data?.warningExpiry || 7, 'moderation.warningExpiry')}
        ${renderField('dmOnPunish', data?.dmOnPunish ?? true, 'moderation.dmOnPunish')}
        ${renderField('dmOnWarn', data?.dmOnWarn ?? true, 'moderation.dmOnWarn')}
        ${renderField('dmOnMute', data?.dmOnMute ?? true, 'moderation.dmOnMute')}
        ${renderField('dmOnKick', data?.dmOnKick ?? true, 'moderation.dmOnKick')}
        ${renderField('dmOnBan', data?.dmOnBan ?? true, 'moderation.dmOnBan')}
        ${renderField('autoPunish', data?.autoPunish ?? true, 'moderation.autoPunish')}
        ${renderField('autoPunishThreshold', data?.autoPunishThreshold || 3, 'moderation.autoPunishThreshold')}
        ${renderField('autoPunishAction', data?.autoPunishAction || 'timeout', 'moderation.autoPunishAction')}
    </div>`;

    if (data?.punishmentLadder) {
        html += `<div class="item-box">
            <h4><i class="fas fa-stairs"></i> Punishment Ladder</h4>
            ${renderUniversal(data.punishmentLadder, 'moderation.punishmentLadder')}
        </div>`;
    }

    return html;
}

// ================= ROLELIMITS =================
function renderRoleLimits(data) {
    if (!data || typeof data !== 'object') {
        return `<div class="item-box"><h4><i class="fas fa-users-gear"></i> Role Limits</h4><p>No data available</p></div>`;
    }

    let html = `<div class="item-box">
        <h4><i class="fas fa-info-circle"></i> Guide</h4>
        <p style="color:var(--text-muted);font-size:13px;">Limits for actions performed by members.</p>
    </div>`;

    Object.keys(data).forEach(action => {
        html += `<div class="item-box">
            <h4><i class="fas fa-users-gear"></i> ${formatLabel(action)}</h4>
            ${renderUniversal(data[action], `roleLimits.${action}`)}
        </div>`;
    });

    return html;
}

// ================= GAMES =================
function renderGames(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-gamepad"></i> Games</h4>
        ${renderField('enabled', data?.enabled || false, 'games.enabled')}
        ${renderField('channelId', data?.channelId || '', 'games.channelId')}
        ${renderField('trivia', data?.trivia ?? true, 'games.trivia')}
        ${renderField('wordle', data?.wordle ?? true, 'games.wordle')}
        ${renderField('truthordare', data?.truthordare ?? true, 'games.truthordare')}
        ${renderField('wouldyourather', data?.wouldyourather ?? true, 'games.wouldyourather')}
        ${renderField('showCorrectAnswer', data?.showCorrectAnswer ?? true, 'games.showCorrectAnswer')}
        ${renderField('showWrongAnswer', data?.showWrongAnswer ?? true, 'games.showWrongAnswer')}
        ${renderField('pointsPerWin', data?.pointsPerWin || 10, 'games.pointsPerWin')}
        ${renderField('cooldown', data?.cooldown || 5000, 'games.cooldown')}
        ${renderField('maxQuestions', data?.maxQuestions || 10, 'games.maxQuestions')}
        ${renderField('difficulty', data?.difficulty || 'medium', 'games.difficulty')}
        ${renderField('timeLimit', data?.timeLimit || 30, 'games.timeLimit')}
        ${renderField('rewardMultiplier', data?.rewardMultiplier || 1, 'games.rewardMultiplier')}
        ${renderField('streakBonus', data?.streakBonus ?? true, 'games.streakBonus')}
        ${renderField('streakMultiplier', data?.streakMultiplier || 1.5, 'games.streakMultiplier')}
    </div>`;
}

// ================= ANNOUNCEMENTS =================
function renderAnnouncements(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-bullhorn"></i> Announcements</h4>
        ${renderField('enabled', data?.enabled || false, 'announcements.enabled')}
        ${renderField('defaultChannel', data?.defaultChannel || '', 'announcements.defaultChannel')}
        ${renderField('mentionEveryone', data?.mentionEveryone || false, 'announcements.mentionEveryone')}
        ${renderField('embed', data?.embed ?? true, 'announcements.embed')}
        ${renderField('color', data?.color || '#5865F2', 'announcements.color')}
        ${renderField('autoDelete', data?.autoDelete || false, 'announcements.autoDelete')}
        ${renderField('autoDeleteDelay', data?.autoDeleteDelay || 30000, 'announcements.autoDeleteDelay')}
        ${renderField('allowAttachments', data?.allowAttachments ?? true, 'announcements.allowAttachments')}
        ${renderField('allowEmbeds', data?.allowEmbeds ?? true, 'announcements.allowEmbeds')}
        ${renderField('pinMessages', data?.pinMessages || false, 'announcements.pinMessages')}
        ${renderField('crosspost', data?.crosspost || false, 'announcements.crosspost')}
    </div>`;
}

// ================= COLORROLES =================
function renderColorRoles(data) {
    let html = `<div class="item-box">
        <h4><i class="fas fa-palette"></i> Color Roles</h4>
        ${renderField('enabled', data?.enabled || false, 'colorRoles.enabled')}
        ${renderField('channelId', data?.channelId || '', 'colorRoles.channelId')}
        ${renderField('maxRoles', data?.maxRoles || 5, 'colorRoles.maxRoles')}
        ${renderField('allowMultiple', data?.allowMultiple || false, 'colorRoles.allowMultiple')}
        ${renderField('requireBoost', data?.requireBoost || false, 'colorRoles.requireBoost')}
        ${renderField('requireLevel', data?.requireLevel || 0, 'colorRoles.requireLevel')}
        ${renderField('cooldown', data?.cooldown || 60000, 'colorRoles.cooldown')}
    </div>`;

    if (data?.colorList && Array.isArray(data.colorList) && data.colorList.length > 0) {
        html += `<div class="item-box">
            <h4><i class="fas fa-palette"></i> Color List (${data.colorList.length})</h4>`;

        data.colorList.forEach((c) => {
            html += `<div class="setting-row">
                <span>
                    <span style="display:inline-block;width:20px;height:20px;background:${c.hex};border-radius:4px;margin-right:8px;vertical-align:middle;"></span>
                    ${c.name} - ${c.hex}
                </span>
            </div>`;
        });

        html += `</div>`;
    }

    return html;
}

// ================= INVITETRACKER =================
function renderInviteTracker(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-envelope"></i> Invite Tracker</h4>
        ${renderField('enabled', data?.enabled || false, 'inviteTracker.enabled')}
        ${renderField('channelId', data?.channelId || '', 'inviteTracker.channelId')}
        ${renderField('logJoins', data?.logJoins ?? true, 'inviteTracker.logJoins')}
        ${renderField('logLeaves', data?.logLeaves ?? true, 'inviteTracker.logLeaves')}
        ${renderField('trackFake', data?.trackFake ?? true, 'inviteTracker.trackFake')}
        ${renderField('minAccountAge', data?.minAccountAge || 7, 'inviteTracker.minAccountAge')}
        ${renderField('leaderboard', data?.leaderboard ?? true, 'inviteTracker.leaderboard')}
        ${renderField('leaderboardChannelId', data?.leaderboardChannelId || '', 'inviteTracker.leaderboardChannelId')}
        ${renderField('fakeInviteThreshold', data?.fakeInviteThreshold || 3, 'inviteTracker.fakeInviteThreshold')}
        ${renderField('fakeInvitePunishment', data?.fakeInvitePunishment || 'kick', 'inviteTracker.fakeInvitePunishment')}
    </div>`;
}

// ================= TICKETS =================
function renderTickets(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-ticket"></i> Tickets</h4>
        ${renderField('enabled', data?.enabled || false, 'tickets.enabled')}
        ${renderField('categoryId', data?.categoryId || '', 'tickets.categoryId')}
        ${renderField('supportRoleId', data?.supportRoleId || '', 'tickets.supportRoleId')}
        ${renderField('logChannelId', data?.logChannelId || '', 'tickets.logChannelId')}
        ${renderField('maxTickets', data?.maxTickets || 3, 'tickets.maxTickets')}
        ${renderField('transcripts', data?.transcripts ?? true, 'tickets.transcripts')}
        ${renderField('autoClose', data?.autoClose || 86400000, 'tickets.autoClose')}
        ${renderField('closeReason', data?.closeReason || 'Ticket closed by system', 'tickets.closeReason')}
        ${renderField('dmOnClose', data?.dmOnClose ?? true, 'tickets.dmOnClose')}
        ${renderField('ratingSystem', data?.ratingSystem || false, 'tickets.ratingSystem')}
        ${renderField('ratingChannelId', data?.ratingChannelId || '', 'tickets.ratingChannelId')}
        ${renderField('ticketNameFormat', data?.ticketNameFormat || 'ticket-{user}', 'tickets.ticketNameFormat')}
        ${renderField('welcomeMessage', data?.welcomeMessage || '', 'tickets.welcomeMessage')}
    </div>`;
}

// ================= GIVEAWAYS =================
function renderGiveaways(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-gift"></i> Giveaways</h4>
        ${renderField('enabled', data?.enabled || false, 'giveaways.enabled')}
        ${renderField('defaultDuration', data?.defaultDuration || 86400000, 'giveaways.defaultDuration')}
        ${renderField('defaultWinners', data?.defaultWinners || 1, 'giveaways.defaultWinners')}
        ${renderField('requiredRoleId', data?.requiredRoleId || '', 'giveaways.requiredRoleId')}
        ${renderField('requiredLevel', data?.requiredLevel || 0, 'giveaways.requiredLevel')}
        ${renderField('minAccountAge', data?.minAccountAge || 7, 'giveaways.minAccountAge')}
        ${renderField('requireBoost', data?.requireBoost || false, 'giveaways.requireBoost')}
        ${renderField('autoDelete', data?.autoDelete ?? true, 'giveaways.autoDelete')}
        ${renderField('rerollEnabled', data?.rerollEnabled ?? true, 'giveaways.rerollEnabled')}
        ${renderField('maxRerolls', data?.maxRerolls || 3, 'giveaways.maxRerolls')}
        ${renderField('dmWinners', data?.dmWinners ?? true, 'giveaways.dmWinners')}
        ${renderField('hostBonus', data?.hostBonus || 1, 'giveaways.hostBonus')}
        ${renderField('boosterBonus', data?.boosterBonus || 2, 'giveaways.boosterBonus')}
    </div>`;
}

// ================= WARNS =================
function renderWarns(data) {
    return `<div class="item-box">
        <h4><i class="fas fa-triangle-exclamation"></i> Warns</h4>
        ${renderField('enabled', data?.enabled || false, 'warns.enabled')}
        ${renderField('autoPunish', data?.autoPunish ?? true, 'warns.autoPunish')}
        ${renderField('maxWarns', data?.maxWarns || 3, 'warns.maxWarns')}
        ${renderField('punishment', data?.punishment || 'timeout', 'warns.punishment')}
        ${renderField('logChannelId', data?.logChannelId || '', 'warns.logChannelId')}
        ${renderField('dmOnWarn', data?.dmOnWarn ?? true, 'warns.dmOnWarn')}
        ${renderField('warningExpiry', data?.warningExpiry || 7, 'warns.warningExpiry')}
        ${renderField('appealable', data?.appealable ?? true, 'warns.appealable')}
        ${renderField('appealChannelId', data?.appealChannelId || '', 'warns.appealChannelId')}
        ${renderField('autoDelete', data?.autoDelete || false, 'warns.autoDelete')}
    </div>`;
}

// ================= RISKSCORE =================
function renderRiskScore(data) {
    let html = `<div class="item-box">
        <h4><i class="fas fa-chart-simple"></i> Risk Score</h4>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Risk scoring system based on member actions.</p>
        ${renderField('enabled', data?.enabled ?? true, 'riskSystem.enabled')}
        ${renderField('decayEnabled', data?.decayEnabled ?? true, 'riskSystem.decayEnabled')}
        ${renderField('decayDays', data?.decayDays || 1, 'riskSystem.decayDays')}
        ${renderField('decayAmount', data?.decayAmount || 5, 'riskSystem.decayAmount')}
        ${renderField('notifyOwner', data?.notifyOwner ?? true, 'riskSystem.notifyOwner')}
    </div>`;

    if (data?.thresholds) {
        html += `<div class="item-box">
            <h4><i class="fas fa-stairs"></i> Punishment Thresholds</h4>
            ${renderUniversal(data.thresholds, 'riskSystem.thresholds')}
        </div>`;
    }

    return html;
}

// ================= SAVE SECTION =================
async function saveCurrentSection() {
    const content = document.getElementById('content');
    const section = state.currentSection;
    const inputs = content.querySelectorAll('[data-config-path]');

    if (inputs.length === 0) {
        showToast('No fields to save', 'warning');
        return;
    }

    const updates = {};

    for (const input of inputs) {
        const path = input.getAttribute('data-config-path');
        const type = input.getAttribute('data-type');
        let value;

        if (type === 'boolean') value = input.checked;
        else if (type === 'number') value = Number(input.value) || 0;
        else if (type === 'array') value = input.value.split(',').map(s => s.trim()).filter(s => s);
        else value = input.value;

        updates[path] = value;
    }

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }

    try {
        const result = await API.post(`/${section}/update-bulk`, { updates });

        if (result && result.success) {
            showToast('Saved successfully!', 'success');
            updateSaveButtonState(false);
            state.originalData = JSON.parse(JSON.stringify(state.data));
        } else {
            showToast('Failed to save', 'error');
        }
    } catch (error) {
        console.error('Save Error:', error);
        showToast('Server error', 'error');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            updateSaveButtonState(false);
        }
    }
}

// ================= AUTO SAVE =================
let autoSaveTimer = null;

function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(() => {
        if (state.unsavedChanges) {
            console.log('Auto-saving...');
            saveCurrentSection();
        }
    }, CONFIG.AUTO_SAVE_INTERVAL);
}

// ================= DETECT CHANGES =================
function detectChanges() {
    const content = document.getElementById('content');
    const inputs = content.querySelectorAll('[data-config-path]');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateSaveButtonState(true);
        });
        input.addEventListener('input', () => {
            updateSaveButtonState(true);
        });
    });
}

// ================= TRIGGER ACTIONS =================
async function addTrigger() {
    const triggerInput = document.getElementById('trigger-name');
    const responseInput = document.getElementById('trigger-response');

    if (!triggerInput || !responseInput) return;

    const trigger = triggerInput.value.trim();
    const response = responseInput.value.trim();

    if (!trigger) return showToast('Enter a trigger', 'warning');
    if (!response) return showToast('Enter a response', 'warning');

    const result = await API.post('/triggers/add', {
        trigger,
        response,
        matchType: 'normal',
        useEmbed: false
    });

    if (result && result.success) {
        showToast('Trigger added!', 'success');
        loadSection('triggers');
    } else {
        showToast(result?.error || 'Failed to add', 'error');
    }
}

async function removeTrigger(index) {
    if (!confirm('Are you sure you want to remove this trigger?')) return;

    const result = await API.post('/triggers/remove', { index });

    if (result && result.success) {
        showToast('Removed!', 'success');
        loadSection('triggers');
    } else {
        showToast('Failed to remove', 'error');
    }
}

// ================= AUTOROLE ACTIONS =================
async function addAutoRole(type) {
    const inputId = type === 'roles' ? 'human-role-input' : 'bot-role-input';
    const input = document.getElementById(inputId);

    if (!input) return;

    const roleId = input.value.trim();
    if (!roleId) return showToast('Enter a Role ID', 'warning');

    const result = await API.post('/autorole/add-role', { roleId, type });

    if (result && result.success) {
        showToast('Role added!', 'success');
        input.value = '';
        loadSection('autorole');
    } else {
        showToast('Failed to add', 'error');
    }
}

async function removeAutoRole(roleId, type) {
    if (!confirm('Are you sure you want to remove this role?')) return;

    const result = await API.post('/autorole/remove-role', { roleId, type });

    if (result && result.success) {
        showToast('Removed!', 'success');
        loadSection('autorole');
    } else {
        showToast('Failed to remove', 'error');
    }
}

// ================= LEVELS ACTIONS =================
async function addLevelRole() {
    const levelInput = document.getElementById('level-input');
    const roleInput = document.getElementById('role-input');

    if (!levelInput || !roleInput) return;

    const level = Number(levelInput.value);
    const roleId = roleInput.value.trim();

    if (!level || level < 1) return showToast('Enter a level', 'warning');
    if (!roleId) return showToast('Enter a Role ID', 'warning');

    const result = await API.post('/levels/add-role', { level, roleId });

    if (result && result.success) {
        showToast('Level reward added!', 'success');
        levelInput.value = '';
        roleInput.value = '';
        loadSection('levels');
    } else {
        showToast('Failed to add', 'error');
    }
}

async function removeLevelRole(level) {
    if (!confirm('Are you sure you want to remove this reward?')) return;

    const result = await API.post('/levels/remove-role', { level });

    if (result && result.success) {
        showToast('Removed!', 'success');
        loadSection('levels');
    } else {
        showToast('Failed to remove', 'error');
    }
}

// ================= REACTION ROLES ACTIONS =================
async function addReactionRole() {
    const messageId = document.getElementById('rr-messageId')?.value.trim();
    const emoji = document.getElementById('rr-emoji')?.value.trim();
    const roleId = document.getElementById('rr-roleId')?.value.trim();
    const channelId = document.getElementById('rr-channelId')?.value.trim();

    if (!messageId || !emoji || !roleId || !channelId) {
        return showToast('Fill all fields', 'warning');
    }

    const result = await API.post('/reactionroles/add', {
        messageId, emoji, roleId, channelId
    });

    if (result && result.success) {
        showToast('Reaction role added!', 'success');
        loadSection('reactionroles');
    } else {
        showToast('Failed to add', 'error');
    }
}

async function removeReactionRole(index) {
    if (!confirm('Are you sure you want to remove this role?')) return;

    const result = await API.post('/reactionroles/remove', { index });

    if (result && result.success) {
        showToast('Removed!', 'success');
        loadSection('reactionroles');
    } else {
        showToast('Failed to remove', 'error');
    }
}

// ================= SET LOG CHANNEL =================
async function setLogChannel(type) {
    const input = document.getElementById(`log-${type}`);
    if (!input) return;

    const channelId = input.value.trim();

    const result = await API.post('/logs/set-channel', { type, channelId });

    if (result && result.success) {
        showToast('Log channel set!', 'success');
    } else {
        showToast('Failed to set', 'error');
    }
}

// ================= SEARCH =================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.searchTerm = e.target.value.toLowerCase().trim();
            filterContent();
        }, CONFIG.SEARCH_DEBOUNCE);
    });
}

function filterContent() {
    const searchTerm = state.searchTerm;
    const rows = document.querySelectorAll('.setting-row');
    const boxes = document.querySelectorAll('.item-box');

    if (!searchTerm) {
        rows.forEach(row => row.style.display = 'flex');
        boxes.forEach(box => box.style.display = 'block');
        return;
    }

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }
    });

    boxes.forEach(box => {
        const visibleRows = box.querySelectorAll('.setting-row');
        const hasVisible = Array.from(visibleRows).some(r => r.style.display !== 'none');
        box.style.display = hasVisible ? 'block' : 'none';
    });
}

// ================= FILTERS =================
function setupFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            state.filter = filter;

            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    const rows = document.querySelectorAll('.setting-row');

    if (filter === 'all') {
        rows.forEach(row => row.style.display = 'flex');
        return;
    }

    rows.forEach(row => {
        const input = row.querySelector('input, select');
        if (!input) return;

        if (filter === 'enabled') {
            if (input.type === 'checkbox' && input.checked) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        } else if (filter === 'disabled') {
            if (input.type === 'checkbox' && !input.checked) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// ================= EXPORT/IMPORT =================
async function exportConfig() {
    try {
        const data = await API.get('/config');
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-bot-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported!', 'success');
    } catch (error) {
        showToast('Export failed', 'error');
    }
}

async function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const result = await API.post('/config/import', { config: data });

            if (result && result.success) {
                showToast('Imported!', 'success');
                loadSection(state.currentSection);
            } else {
                showToast('Import failed', 'error');
            }
        } catch (error) {
            showToast('Invalid file', 'error');
        }
    };
    input.click();
}

// ================= RESET SECTION =================
async function resetSection() {
    if (!confirm('Reset this section to default?')) return;

    const section = state.currentSection;

    try {
        const result = await API.post(`/${section}/reset`);

        if (result && result.success) {
            showToast('Section reset', 'success');
            loadSection(section);
        } else {
            showToast('Reset failed', 'error');
        }
    } catch (error) {
        showToast('Error', 'error');
    }
}

// ================= THEME TOGGLE =================
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', state.theme);
    localStorage.setItem('dashboard-theme', state.theme);
    showToast(`Theme: ${state.theme}`, 'info');
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
    }
}

// ================= KEYBOARD SHORTCUTS =================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCurrentSection();
        }

        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const search = document.getElementById('searchInput');
            if (search) search.focus();
        }

        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportConfig();
        }

        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            importConfig();
        }

        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshSection();
        }

        if (e.key === 'Escape') {
            const search = document.getElementById('searchInput');
            if (search) {
                search.value = '';
                state.searchTerm = '';
                filterContent();
            }
            document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
        }
    });
}

// ================= REFRESH =================
function refreshSection() {
    showToast('Refreshing...', 'info');
    loadSection(state.currentSection);
}

// ================= STATUS UPDATE =================
async function updateStatus() {
    try {
        const status = await API.get('/status');
        const text = document.getElementById('statusText');
        const dot = document.querySelector('.status-dot');
        const statusBadge = document.getElementById('statusBadge');
        const connectionStatus = document.getElementById('connectionStatus');
        const footerPing = document.getElementById('footerPing');

        if (status && status.online) {
            if (text) text.textContent = 'Online';
            if (dot) dot.style.background = 'var(--success)';
            if (statusBadge) {
                statusBadge.classList.remove('offline');
                statusBadge.classList.add('online');
            }
            if (connectionStatus) {
                connectionStatus.innerHTML = '<span class="status-indicator online"></span><span>Connected</span>';
            }
            if (footerPing) {
                footerPing.textContent = `Ping: ${status.ping}ms`;
            }
        } else {
            if (text) text.textContent = 'Offline';
            if (dot) dot.style.background = 'var(--danger)';
            if (statusBadge) {
                statusBadge.classList.remove('online');
                statusBadge.classList.add('offline');
            }
            if (connectionStatus) {
                connectionStatus.innerHTML = '<span class="status-indicator offline"></span><span>Disconnected</span>';
            }
            if (footerPing) {
                footerPing.textContent = 'Ping: --ms';
            }
        }
    } catch (error) {
        console.error('Status Error:', error);
    }
}

// ================= PREVIEWS =================
function updateWelcomePreview() {
    const preview = document.getElementById('welcomePreview');
    if (!preview) return;

    const messageInput = document.querySelector('[data-config-path="welcome.message"]');
    const colorInput = document.querySelector('[data-config-path="welcome.color"]');
    const embedInput = document.querySelector('[data-config-path="welcome.embed"]');

    if (!messageInput) return;

    const message = messageInput.value || 'Welcome {userMention} to the server!';
    const color = colorInput?.value || '#5865F2';
    const useEmbed = embedInput?.checked || false;

    const replacedMessage = message
        .replace(/{userMention}/g, '@User')
        .replace(/{user}/g, 'User#0000')
        .replace(/{userName}/g, 'User')
        .replace(/{userId}/g, '123456789')
        .replace(/{server}/g, 'Server Name')
        .replace(/{serverName}/g, 'Server Name')
        .replace(/{memberCount}/g, '100');

    if (useEmbed) {
        preview.innerHTML = `<div style="border-right:4px solid ${color};background:var(--bg-secondary);padding:16px;border-radius:8px;">
            <p style="color:var(--text-primary);font-size:14px;margin:0;">${escapeHtml(replacedMessage)}</p>
        </div>`;
    } else {
        preview.innerHTML = `<p style="color:var(--text-primary);font-size:14px;margin:0;">${escapeHtml(replacedMessage)}</p>`;
    }
}

function updateGoodbyePreview() {
    const preview = document.getElementById('goodbyePreview');
    if (!preview) return;

    const messageInput = document.querySelector('[data-config-path="goodbye.message"]');
    const colorInput = document.querySelector('[data-config-path="goodbye.color"]');
    const embedInput = document.querySelector('[data-config-path="goodbye.embed"]');

    if (!messageInput) return;

    const message = messageInput.value || 'Goodbye {userMention}!';
    const color = colorInput?.value || '#ED4245';
    const useEmbed = embedInput?.checked || false;

    const replacedMessage = message
        .replace(/{userMention}/g, '@User')
        .replace(/{user}/g, 'User#0000')
        .replace(/{userName}/g, 'User')
        .replace(/{userId}/g, '123456789')
        .replace(/{server}/g, 'Server Name')
        .replace(/{serverName}/g, 'Server Name')
        .replace(/{memberCount}/g, '100');

    if (useEmbed) {
        preview.innerHTML = `<div style="border-right:4px solid ${color};background:var(--bg-secondary);padding:16px;border-radius:8px;">
            <p style="color:var(--text-primary);font-size:14px;margin:0;">${escapeHtml(replacedMessage)}</p>
        </div>`;
    } else {
        preview.innerHTML = `<p style="color:var(--text-primary);font-size:14px;margin:0;">${escapeHtml(replacedMessage)}</p>`;
    }
}

function setupPreviews() {
    const welcomeInputs = document.querySelectorAll('[data-config-path^="welcome."]');
    welcomeInputs.forEach(input => {
        input.addEventListener('input', updateWelcomePreview);
        input.addEventListener('change', updateWelcomePreview);
    });

    const goodbyeInputs = document.querySelectorAll('[data-config-path^="goodbye."]');
    goodbyeInputs.forEach(input => {
        input.addEventListener('input', updateGoodbyePreview);
        input.addEventListener('change', updateGoodbyePreview);
    });
}

// ================= THEME =================
function loadTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
    state.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
}

// ================= HASH ROUTING =================
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && SECTION_TITLES[hash]) {
        loadSection(hash);
        document.querySelectorAll('.nav-item').forEach(i => {
            i.classList.toggle('active', i.dataset.section === hash);
        });
    }
}

// ================= NETWORK MONITOR =================
function setupNetworkMonitor() {
    window.addEventListener('online', () => {
        showToast('Connection restored', 'success');
        updateStatus();
    });

    window.addEventListener('offline', () => {
        showToast('Connection lost', 'error');
    });
}

// ================= TOOLBAR =================
function setupToolbar() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', refreshSection);

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportConfig);

    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.addEventListener('click', importConfig);

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const shortcutsBtn = document.getElementById('shortcutsBtn');
    if (shortcutsBtn) shortcutsBtn.addEventListener('click', showShortcuts);

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
}

// ================= SHORTCUTS MODAL =================
function showShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="max-width:600px;">
            <div class="modal-header">
                <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="shortcut-list">
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>CTRL</kbd> + <kbd>S</kbd></span>
                        <span class="shortcut-desc">Save changes</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>CTRL</kbd> + <kbd>K</kbd></span>
                        <span class="shortcut-desc">Search settings</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>CTRL</kbd> + <kbd>E</kbd></span>
                        <span class="shortcut-desc">Export config</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>CTRL</kbd> + <kbd>I</kbd></span>
                        <span class="shortcut-desc">Import config</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>CTRL</kbd> + <kbd>R</kbd></span>
                        <span class="shortcut-desc">Refresh section</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-keys"><kbd>ESC</kbd></span>
                        <span class="shortcut-desc">Close search or modal</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close-btn">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').onclick = () => modal.remove();
    modal.querySelector('.modal-close-btn').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`Security Bot Dashboard v${CONFIG.VERSION} initialized`);

    loadTheme();
    setupNavigation();
    setupToolbar();
    setupSearch();
    setupFilters();
    setupKeyboardShortcuts();
    setupNetworkMonitor();

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCurrentSection);
    }

    startAutoSave();

    handleHashChange();
    if (!window.location.hash) {
        loadSection('general');
    }

    updateStatus();
    setInterval(updateStatus, 5000);

    setTimeout(detectChanges, 1000);
    setTimeout(setupPreviews, 500);

    window.addEventListener('hashchange', handleHashChange);
});

// ================= ERROR HANDLING =================
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ================= GLOBAL EXPORT =================
window.Dashboard = {
    state,
    API,
    showToast,
    loadSection,
    saveCurrentSection,
    addTrigger,
    removeTrigger,
    addAutoRole,
    removeAutoRole,
    addLevelRole,
    removeLevelRole,
    addReactionRole,
    removeReactionRole,
    setLogChannel,
    exportConfig,
    importConfig,
    resetSection,
    refreshSection,
    toggleTheme,
    toggleSidebar,
    showShortcuts,
    updateStatus
};
