const { EmbedBuilder } = require('discord.js');

// ================= ناوەندی زانیاری =================
const riskScores = new Map();
const actionHistory = new Map();
const riskAlerts = new Map();

// ================= ئاستەکانی مەترسی =================
const RISK_LEVELS = {
    LOW: { min: 0, max: 20, color: '#57F287', label: 'کەم' },
    MEDIUM: { min: 21, max: 50, color: '#FFA500', label: 'ناوەند' },
    HIGH: { min: 51, max: 80, color: '#FF8C00', label: 'بەرز' },
    CRITICAL: { min: 81, max: 100, color: '#ED4245', label: 'زۆر بەرز' },
    EXTREME: { min: 101, max: 999, color: '#8B0000', label: 'مەترسیدار' }
};

// ================= وەرگرتنی نمرە =================
function getRiskScore(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return riskScores.get(key) || 0;
}

// ================= وەرگرتنی ئاست =================
function getRiskLevel(score) {
    for (const [level, data] of Object.entries(RISK_LEVELS)) {
        if (score >= data.min && score <= data.max) {
            return { level, ...data };
        }
    }
    return { level: 'UNKNOWN', color: '#5865F2', label: 'نەزانراو' };
}

// ================= زیادکردنی نمرە =================
function addRiskScore(guildId, userId, amount, reason = null) {
    const key = `${guildId}-${userId}`;
    const current = riskScores.get(key) || 0;
    const newScore = current + amount;
    riskScores.set(key, newScore);

    // زیادکردن بۆ مێژوو
    addActionHistory(guildId, userId, { amount, reason, timestamp: Date.now(), total: newScore });

    return newScore;
}

// ================= کەمکردنەوەی نمرە =================
function removeRiskScore(guildId, userId, amount) {
    const key = `${guildId}-${userId}`;
    const current = riskScores.get(key) || 0;
    const newScore = Math.max(0, current - amount);
    riskScores.set(key, newScore);
    return newScore;
}

// ================= پاککردنەوەی نمرە =================
function resetRiskScore(guildId, userId) {
    const key = `${guildId}-${userId}`;
    riskScores.delete(key);
    actionHistory.delete(key);
    riskAlerts.delete(key);
}

// ================= زیادکردنی مێژوو =================
function addActionHistory(guildId, userId, action) {
    const key = `${guildId}-${userId}`;
    if (!actionHistory.has(key)) actionHistory.set(key, []);
    const history = actionHistory.get(key);
    history.push(action);
    if (history.length > 100) history.shift();
    actionHistory.set(key, history);
}

// ================= وەرگرتنی مێژوو =================
function getActionHistory(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return actionHistory.get(key) || [];
}

// ================= چێککردنی پێویستی سزا =================
function shouldPunish(guildId, userId, config) {
    const score = getRiskScore(guildId, userId);
    const level = getRiskLevel(score);

    if (!config.riskSystem || !config.riskSystem.enabled) return { should: false, level };

    const thresholds = config.riskSystem.thresholds || {
        warn: 20,
        removeRoles: 35,
        timeout: 50,
        kick: 70,
        ban: 85
    };

    if (score >= thresholds.ban) return { should: true, action: 'ban', level };
    if (score >= thresholds.kick) return { should: true, action: 'kick', level };
    if (score >= thresholds.timeout) return { should: true, action: 'timeout', level };
    if (score >= thresholds.removeRoles) return { should: true, action: 'removeRoles', level };
    if (score >= thresholds.warn) return { should: true, action: 'warn', level };

    return { should: false, level };
}

// ================= ناردنی ئاگادارکردنەوەی مەترسی =================
async function sendRiskAlert(guild, userId, config, reason) {
    try {
        const score = getRiskScore(guild.id, userId);
        const level = getRiskLevel(score);

        // چێککردنی ئاگادارکردنەوەی پێشوو (تەنها جارێک لە ٥ خولەکدا)
        const key = `${guild.id}-${userId}`;
        const lastAlert = riskAlerts.get(key) || 0;
        const now = Date.now();
        if (now - lastAlert < 300000) return;
        riskAlerts.set(key, now);

        if (!config.logChannels) return;
        const logChannelId = config.logChannels.security || config.logChannels.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const member = await guild.members.fetch(userId).catch(() => null);
            const embed = new EmbedBuilder()
                .setColor(level.color)
                .setTitle(`⚠️ ئاگادارکردنەوەی مەترسی - ${level.label}`)
                .setDescription(
                    `**ئەندام:** ${member ? member.user.tag : 'نەزانراو'} (<@${userId}>)\n` +
                    `**نمرەی مەترسی:** ${score}\n` +
                    `**ئاست:** ${level.label}\n` +
                    `**هۆکار:** ${reason || 'کرداری گوماناوی'}`
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    } catch (e) {
        console.error('Send Risk Alert Error:', e.message);
    }
}

// ================= وەرگرتنی پوختەی مەترسی =================
async function getRiskSummary(guildId, userId) {
    const score = getRiskScore(guildId, userId);
    const level = getRiskLevel(score);
    const history = getActionHistory(guildId, userId);

    return {
        score,
        level,
        history: history.slice(-10) // ١٠ کرداری کۆتایی
    };
}

// ================= پاککردنەوەی خۆکاری نمرەکان =================
function startRiskDecay(client) {
    setInterval(() => {
        const now = Date.now();
        for (const [key, score] of riskScores.entries()) {
            const [guildId, userId] = key.split('-');
            const history = getActionHistory(guildId, userId);
            
            // ئەگەر هیچ کردارێک لە ٢٤ کاتژمێری ڕابردوودا نەبوو، نمرەکە کەم بکەرەوە
            const lastAction = history.length > 0 ? history[history.length - 1].timestamp : 0;
            if (now - lastAction > 86400000) { // ٢٤ کاتژمێر
                const newScore = Math.max(0, score - 5);
                if (newScore === 0) {
                    riskScores.delete(key);
                } else {
                    riskScores.set(key, newScore);
                }
            }
        }
    }, 3600000); // هەر کاتژمێرێک
}

module.exports = {
    getRiskScore,
    getRiskLevel,
    addRiskScore,
    removeRiskScore,
    resetRiskScore,
    addActionHistory,
    getActionHistory,
    shouldPunish,
    sendRiskAlert,
    getRiskSummary,
    startRiskDecay,
    RISK_LEVELS
};
