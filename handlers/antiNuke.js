const { EmbedBuilder, AuditLogEvent } = require('discord.js');

// ================= سیستەمی نمرەدان =================
const actionTrackers = new Map();
const riskScores = new Map();
const actionHistory = new Map();
const lockdownChannels = new Map();

// ================= ناوەندی زانیاری =================
const RISK_THRESHOLDS = {
    20: { action: 'warn', color: '#FFA500', emoji: '⚠️' },
    35: { action: 'removeRoles', color: '#FF8C00', emoji: '🔶' },
    50: { action: 'timeout', color: '#FF4500', emoji: '🔇' },
    70: { action: 'kick', color: '#DC143C', emoji: '👢' },
    85: { action: 'ban', color: '#8B0000', emoji: '🔨' },
    100: { action: 'ban', color: '#000000', emoji: '💀' }
};

// ================= وەرگرتنی تراکەر =================
function getTracker(guildId, userId, action) {
    const key = `${guildId}-${userId}-${action}`;
    if (!actionTrackers.has(key)) actionTrackers.set(key, []);
    return actionTrackers.get(key);
}

// ================= چێککردنی لیستی سپی =================
function isWhitelisted(member, config) {
    if (!member) return false;
    if (member.id === member.guild.ownerId) return true;
    if (config.whitelist?.users?.all?.includes(member.id)) return true;
    if (config.whitelist?.roles?.all) {
        if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

// ================= زیادکردنی نمرەی مەترسی =================
function addRiskScore(guildId, userId, amount) {
    const key = `${guildId}-${userId}`;
    const current = riskScores.get(key) || 0;
    riskScores.set(key, current + amount);
    return current + amount;
}

// ================= وەرگرتنی نمرەی مەترسی =================
function getRiskScore(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return riskScores.get(key) || 0;
}

// ================= پاککردنەوەی نمرەی مەترسی =================
function resetRiskScore(guildId, userId) {
    const key = `${guildId}-${userId}`;
    riskScores.delete(key);
}

// ================= زیادکردنی مێژووی کردار =================
function addActionHistory(guildId, userId, action) {
    const key = `${guildId}-${userId}`;
    if (!actionHistory.has(key)) actionHistory.set(key, []);
    const history = actionHistory.get(key);
    history.push({ action, timestamp: Date.now() });
    if (history.length > 50) history.shift();
    actionHistory.set(key, history);
}

// ================= چێککردنی شێوازی گوماناوی =================
function checkSuspiciousPattern(guildId, userId) {
    const key = `${guildId}-${userId}`;
    const history = actionHistory.get(key) || [];
    const now = Date.now();
    const recentActions = history.filter(h => now - h.timestamp < 60000);

    // ئەگەر زیاتر لە ٥ کرداری جیاواز لە ٦٠ چرکەدا
    const uniqueActions = new Set(recentActions.map(h => h.action));
    if (uniqueActions.size >= 5) return { suspicious: true, reason: 'کرداری جیاوازی زۆر' };

    // ئەگەر زیاتر لە ١٠ کردار لە ٦٠ چرکەدا
    if (recentActions.length >= 10) return { suspicious: true, reason: 'کرداری زۆر' };

    // ئەگەر زیاتر لە ٣ کرداری هەمان جۆر لە ٣٠ چرکەدا
    const uniqueMap = {};
    for (const action of recentActions) {
        if (now - action.timestamp < 30000) {
            uniqueMap[action.action] = (uniqueMap[action.action] || 0) + 1;
            if (uniqueMap[action.action] >= 3) {
                return { suspicious: true, reason: `${action.action} دووبارە` };
            }
        }
    }

    return { suspicious: false };
}

// ================= داخستنی چانێلەکان =================
async function lockChannels(guild, reason) {
    try {
        const channels = guild.channels.cache.filter(c => c.type === 0 || c.type === 2);
        for (const [id, channel] of channels) {
            await channel.permissionOverwrites.edit(guild.id, {
                SendMessages: false,
                Speak: false
            }).catch(() => {});
        }
        lockdownChannels.set(guild.id, Date.now());
    } catch (e) {
        console.error(`Lock Channels Error: ${e.message}`);
    }
}

// ================= کردنەوەی چانێلەکان =================
async function unlockChannels(guild) {
    try {
        const channels = guild.channels.cache.filter(c => c.type === 0 || c.type === 2);
        for (const [id, channel] of channels) {
            await channel.permissionOverwrites.edit(guild.id, {
                SendMessages: null,
                Speak: null
            }).catch(() => {});
        }
        lockdownChannels.delete(guild.id);
    } catch (e) {
        console.error(`Unlock Channels Error: ${e.message}`);
    }
}

// ================= ناردنی ئاگادارکردنەوە =================
async function sendAlert(guild, config, title, description, color = '#ED4245') {
    try {
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        // ئاگادارکردنی خاوەن سێرڤەر
        if (config.autoLockdown?.notifyOwner) {
            const owner = await guild.fetchOwner().catch(() => null);
            if (owner) {
                await owner.send(`🚨 ئاگادارکردنەوە لە ${guild.name}: ${title}\n${description}`).catch(() => {});
            }
        }
    } catch (e) {
        console.error(`Send Alert Error: ${e.message}`);
    }
}

// ================= سزادان =================
async function punish(guild, userId, punishment, reason, config) {
    try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return;

        if (member.id === guild.ownerId) return;
        if (member.roles.highest.position >= guild.members.me.roles.highest.position) return;

        // جێبەجێکردنی سزا
        if (punishment === 'kick' && member.kickable) {
            await member.kick(reason).catch(() => {});
        } else if (punishment === 'ban' && member.bannable) {
            await member.ban({ reason }).catch(() => {});
        } else if (punishment === 'timeout' && member.moderatable) {
            await member.timeout(10 * 60 * 1000, reason).catch(() => {});
        } else if (punishment === 'removeRoles') {
            await member.roles.set([]).catch(() => {});
        } else if (punishment === 'warn') {
            await member.send(`⚠️ ئاگادارکردنەوە: ${reason}`).catch(() => {});
        }

        // لۆگ
        const riskScore = getRiskScore(guild.id, userId);
        await sendAlert(
            guild,
            config,
            '🚨 سزای Anti-Nuke',
            `**ئەندام:** <@${userId}>\n` +
            `**سزا:** ${punishment}\n` +
            `**هۆکار:** ${reason}\n` +
            `**نمرەی مەترسی:** ${riskScore}`,
            '#ED4245'
        );

        // داخستنی چانێلەکان ئەگەر پێویست بێت
        if (punishment === 'ban' && config.autoLockdown?.enabled) {
            await lockChannels(guild, `Auto-Lockdown: ${reason}`);
        }
    } catch (e) {
        console.error(`Punish Error: ${e.message}`);
    }
}

// ================= چێککردنی کردار =================
async function checkAction(guild, userId, action, config, amount = 1) {
    try {
        // چێککردنی ڕێکخستن
        if (!config.securityLimits?.[action]) return false;
        const settings = config.securityLimits[action];
        if (!settings.enabled) return false;

        // چێککردنی ئەندام
        const member = await guild.members.fetch(userId).catch(() => null);
        if (isWhitelisted(member, config)) return false;

        // زیادکردنی مێژوو
        addActionHistory(guild.id, userId, action);

        // زیادکردنی نمرەی مەترسی
        const riskAmount = settings.riskScore || amount;
        const totalRisk = addRiskScore(guild.id, userId, riskAmount);

        // چێککردنی شێوازی گوماناوی
        const pattern = checkSuspiciousPattern(guild.id, userId);
        if (pattern.suspicious) {
            const punishment = settings.punishment || 'kick';
            await punish(guild, userId, punishment, `Anti-Nuke: شێوازی گوماناوی (${pattern.reason})`, config);
            resetRiskScore(guild.id, userId);
            return true;
        }

        // چێککردنی نمرەی مەترسی
        const thresholds = Object.keys(RISK_THRESHOLDS).map(Number).sort((a, b) => a - b);
        for (const threshold of thresholds) {
            if (totalRisk >= threshold) {
                const punishment = RISK_THRESHOLDS[threshold].action;
                await punish(guild, userId, punishment, `Anti-Nuke: نمرەی مەترسی (${totalRisk}) - ${action}`, config);
                resetRiskScore(guild.id, userId);
                return true;
            }
        }

        // چێککردنی ژمارەی کردار
        const tracker = getTracker(guild.id, userId, action);
        const now = Date.now();
        tracker.push(now);

        const window = settings.window || 10000;
        const validActions = tracker.filter(t => now - t < window);
        actionTrackers.set(`${guild.id}-${userId}-${action}`, validActions);

        const max = settings.max || 5;
        if (validActions.length >= max) {
            const punishment = settings.punishment || 'kick';
            await punish(guild, userId, punishment, `Anti-Nuke: ${action} (${validActions.length}/${max})`, config);
            actionTrackers.set(`${guild.id}-${userId}-${action}`, []);
            return true;
        }

        return false;
    } catch (e) {
        console.error(`checkAction Error: ${e.message}`);
        return false;
    }
}

// ================= چێککردنی Webhook =================
async function checkWebhook(guild, webhook, config) {
    try {
        if (!config.securityLimits?.webhookCreate?.enabled) return false;

        const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.WebhookCreate, limit: 1 }).catch(() => null);
        if (!auditLogs) return false;

        const entry = auditLogs.entries.first();
        if (!entry) return false;

        const executor = entry.executor;
        if (!executor) return false;

        if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;

        await webhook.delete('Anti-Nuke: Webhook unauthorized').catch(() => {});
        await checkAction(guild, executor.id, 'webhookCreate', config, 15);
        return true;
    } catch (e) {
        console.error(`Webhook Check Error: ${e.message}`);
        return false;
    }
}

// ================= چێککردنی Thread =================
async function checkThread(guild, thread, config) {
    try {
        if (!config.securityLimits?.threadCreate?.enabled) return false;

        const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ThreadCreate, limit: 1 }).catch(() => null);
        if (!auditLogs) return false;

        const entry = auditLogs.entries.first();
        if (!entry) return false;

        const executor = entry.executor;
        if (!executor) return false;

        if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;

        await checkAction(guild, executor.id, 'threadCreate', config, 5);
        return true;
    } catch (e) {
        console.error(`Thread Check Error: ${e.message}`);
        return false;
    }
}

// ================= چێککردنی Sticker =================
async function checkSticker(guild, sticker, config) {
    try {
        if (!config.securityLimits?.stickerCreate?.enabled) return false;

        const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.StickerCreate, limit: 1 }).catch(() => null);
        if (!auditLogs) return false;

        const entry = auditLogs.entries.first();
        if (!entry) return false;

        const executor = entry.executor;
        if (!executor) return false;

        if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;

        await checkAction(guild, executor.id, 'stickerCreate', config, 10);
        return true;
    } catch (e) {
        console.error(`Sticker Check Error: ${e.message}`);
        return false;
    }
}

module.exports = {
    checkAction,
    isWhitelisted,
    punish,
    getRiskScore,
    resetRiskScore,
    addRiskScore,
    addActionHistory,
    checkSuspiciousPattern,
    lockChannels,
    unlockChannels,
    sendAlert,
    checkWebhook,
    checkThread,
    checkSticker,
    RISK_THRESHOLDS
};
