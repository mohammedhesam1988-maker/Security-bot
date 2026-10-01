// ==================== VOICE ANTI-SPAM HANDLER ====================

const voiceTrackers = new Map();

function getVoiceTracker(guildId, userId, type) {
    const key = `${guildId}-${userId}-${type}`;
    if (!voiceTrackers.has(key)) voiceTrackers.set(key, []);
    return voiceTrackers.get(key);
}

async function punishVoice(guild, member, settings, reason) {
    const punishment = settings.punishment || 'timeout';
    const duration = settings.timeoutDuration || 60000;

    try {
        if (punishment === 'timeout' && member.moderatable) {
            await member.timeout(duration, reason).catch(() => {});
        } else if (punishment === 'kick' && member.kickable) {
            await member.kick(reason).catch(() => {});
        } else if (punishment === 'ban' && member.bannable) {
            await member.ban({ reason }).catch(() => {});
        }
    } catch (e) {
        console.error(`Voice Punish Error: ${e.message}`);
    }
}

async function checkVoiceSpam(member, type, config) {
    try {
        if (!config.securityLimits) return false;
        const settings = config.securityLimits[type];
        if (!settings || !settings.enabled) return false;

        const now = Date.now();
        const tracker = getVoiceTracker(member.guild.id, member.id, type);
        tracker.push(now);

        const window = 60000;
        const validActions = tracker.filter(t => now - t < window);
        voiceTrackers.set(`${member.guild.id}-${member.id}-${type}`, validActions);

        const max = settings.max || 3;
        if (validActions.length >= max) {
            await punishVoice(member.guild, member, settings, `Voice Anti-Spam: ${type}`);
            voiceTrackers.set(`${member.guild.id}-${member.id}-${type}`, []);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`checkVoiceSpam Error: ${e.message}`);
        return false;
    }
}

module.exports = {
    checkVoiceSpam
};
