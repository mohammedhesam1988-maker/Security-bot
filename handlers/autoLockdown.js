const { EmbedBuilder, ChannelType } = require('discord.js');

// ================= سیستەمی داخستن =================
const lockdowns = new Map();

// ================= داخستنی چانێلەکان =================
async function lockChannels(guild, config, reason = 'Auto-Lockdown') {
    try {
        if (!guild) return false;
        if (lockdowns.has(guild.id)) return false; // پێشتر داخراوە

        // داخستنی چانێلە دەقییەکان
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
        for (const [id, channel] of textChannels) {
            await channel.permissionOverwrites.edit(guild.id, {
                SendMessages: false
            }).catch(() => {});
        }

        // داخستنی چانێلە دەنگییەکان
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        for (const [id, channel] of voiceChannels) {
            await channel.permissionOverwrites.edit(guild.id, {
                Speak: false
            }).catch(() => {});
        }

        // تۆمارکردنی کات
        lockdowns.set(guild.id, {
            timestamp: Date.now(),
            reason: reason,
            duration: config.autoLockdown?.duration || 300000
        });

        // ناردنی ئاگادارکردنەوە
        await sendLockdownAlert(guild, config, reason, true);

        // کردنەوەی خۆکار دوای ماوەی دیاریکراو
        const duration = config.autoLockdown?.duration || 300000;
        setTimeout(() => {
            unlockChannels(guild, config).catch(() => {});
        }, duration);

        return true;
    } catch (error) {
        console.error('Lock Channels Error:', error);
        return false;
    }
}

// ================= کردنەوەی چانێلەکان =================
async function unlockChannels(guild, config) {
    try {
        if (!guild) return false;
        if (!lockdowns.has(guild.id)) return false;

        // کردنەوەی چانێلە دەقییەکان
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
        for (const [id, channel] of textChannels) {
            await channel.permissionOverwrites.edit(guild.id, {
                SendMessages: null
            }).catch(() => {});
        }

        // کردنەوەی چانێلە دەنگییەکان
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        for (const [id, channel] of voiceChannels) {
            await channel.permissionOverwrites.edit(guild.id, {
                Speak: null
            }).catch(() => {});
        }

        // سڕینەوە لە تۆمار
        lockdowns.delete(guild.id);

        // ناردنی ئاگادارکردنەوە
        await sendLockdownAlert(guild, config, 'Lockdown Ended', false);

        return true;
    } catch (error) {
        console.error('Unlock Channels Error:', error);
        return false;
    }
}

// ================= ناردنی ئاگادارکردنەوە =================
async function sendLockdownAlert(guild, config, reason, isLockdown) {
    try {
        if (!config.logChannels) return;
        const logChannelId = config.logChannels.security || config.logChannels.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor(isLockdown ? '#ED4245' : '#57F287')
                .setTitle(isLockdown ? '🔒 Auto-Lockdown Activated' : '🔓 Auto-Lockdown Ended')
                .setDescription(`**Server:** ${guild.name}\n**Reason:** ${reason}`)
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        // ئاگادارکردنی خاوەن
        if (config.autoLockdown?.notifyOwner) {
            const owner = await guild.fetchOwner().catch(() => null);
            if (owner) {
                await owner.send(`🚨 ${isLockdown ? 'Lockdown Activated' : 'Lockdown Ended'} in **${guild.name}**\nReason: ${reason}`).catch(() => {});
            }
        }
    } catch (e) {
        console.error('Send Lockdown Alert Error:', e.message);
    }
}

// ================= چێککردنی دۆخی داخستن =================
function isLockedDown(guildId) {
    return lockdowns.has(guildId);
}

// ================= وەرگرتنی زانیاری داخستن =================
function getLockdownInfo(guildId) {
    return lockdowns.get(guildId) || null;
}

// ================= داخستنی خۆکار بەپێی هێرش =================
async function autoLockdown(guild, config, triggerReason = 'Raid Detected') {
    try {
        if (!config.autoLockdown || !config.autoLockdown.enabled) return false;
        if (isLockedDown(guild.id)) return false;

        return await lockChannels(guild, config, triggerReason);
    } catch (error) {
        console.error('Auto Lockdown Error:', error);
        return false;
    }
}

module.exports = {
    lockChannels,
    unlockChannels,
    isLockedDown,
    getLockdownInfo,
    autoLockdown,
    sendLockdownAlert
};
