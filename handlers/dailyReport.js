// ==================== DAILY REPORT HANDLER ====================

const { EmbedBuilder } = require('discord.js');

function startDailyReport(client) {
    try {
        const config = require('../config.js');
        const logChannelId = config.logChannels && config.logChannels.general;
        if (!logChannelId) return;

        // هەر ٢٤ کاتژمێر جارێک
        setInterval(async () => {
            try {
                const guild = client.guilds.cache.first();
                if (!guild) return;

                const channel = guild.channels.cache.get(logChannelId);
                if (!channel) return;

                const embed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle('📊 Daily Report')
                    .setDescription(`**Server:** ${guild.name}\n**Members:** ${guild.memberCount}\n**Channels:** ${guild.channels.cache.size}\n**Roles:** ${guild.roles.cache.size}`)
                    .setTimestamp()
                    .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });

                await channel.send({ embeds: [embed] }).catch(() => {});
            } catch (e) {
                console.error(`Daily Report Error: ${e.message}`);
            }
        }, 24 * 60 * 60 * 1000);
    } catch (e) {
        console.error(`startDailyReport Error: ${e.message}`);
    }
}

async function sendDailyReport(client, channelId) {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📊 Daily Report')
            .setDescription(`**Server:** ${guild.name}\n**Members:** ${guild.memberCount}\n**Channels:** ${guild.channels.cache.size}\n**Roles:** ${guild.roles.cache.size}`)
            .setTimestamp()
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' });

        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`sendDailyReport Error: ${e.message}`);
    }
}

module.exports = {
    startDailyReport,
    sendDailyReport
};
