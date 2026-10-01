module.exports = {
    name: 'threadDelete',
    once: false,
    async execute(thread, client, config) {
        if (!thread.guild) return;
        const { guild } = thread;

        // ==================== LOG ====================
        if (config.logChannels && config.logChannels.threadDeleted) {
            try {
                const logChannel = guild.channels.cache.get(config.logChannels.threadDeleted);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#EF4444')
                        .setTitle('🗑️ Thread Deleted')
                        .setDescription(`**Name:** ${thread.name}\n**Parent:** ${thread.parentId ? `<#${thread.parentId}>` : 'Unknown'}\n**ID:** ${thread.id}`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            } catch (e) {
                console.error(`Thread Delete Log Error: ${e.message}`);
            }
        }
    }
};
