// ==================== ANTI-RAID HANDLER ====================

const joinCache = new Map();

async function checkRaid(guild, member, config) {
    if (!config.antiRaid || !config.antiRaid.enabled) return false;

    const now = Date.now();
    const key = guild.id;

    if (!joinCache.has(key)) {
        joinCache.set(key, []);
    }

    const joins = joinCache.get(key);
    joins.push({ id: member.id, time: now });

    const window = config.antiRaid.timeWindow || 10000;
    const recentJoins = joins.filter(j => now - j.time < window);
    joinCache.set(key, recentJoins);

    const joinRate = config.antiRaid.joinRate || 5;
    if (recentJoins.length >= joinRate) {
        await lockServer(guild, config);
        joinCache.set(key, []);
        return true;
    }

    return false;
}

async function lockServer(guild, config) {
    try {
        const channels = guild.channels.cache.filter(c => c.type === 0);
        for (const [id, channel] of channels) {
            await channel.permissionOverwrites.edit(guild.id, { SendMessages: false }).catch(() => {});
        }

        const logChannelId = config.logChannels && config.logChannels.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;
        if (logChannel) {
            const { EmbedBuilder } = require('discord.js');
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🚨 Anti-Raid Triggered')
                .setDescription(`Server has been locked due to a raid. All channels are locked.`)
                .setTimestamp()
                .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    } catch (e) {
        console.error(`lockServer Error: ${e.message}`);
    }
}

async function unlockServer(guild) {
    try {
        const channels = guild.channels.cache.filter(c => c.type === 0);
        for (const [id, channel] of channels) {
            await channel.permissionOverwrites.edit(guild.id, { SendMessages: null }).catch(() => {});
        }
    } catch (e) {
        console.error(`unlockServer Error: ${e.message}`);
    }
}

module.exports = {
    checkRaid,
    lockServer,
    unlockServer
};
