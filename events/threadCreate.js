module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(thread, client, config) {
        if (!thread.guild) return;
        const { guild } = thread;

        // ==================== LOG ====================
        if (config.logChannels && config.logChannels.threadCreated) {
            try {
                const logChannel = guild.channels.cache.get(config.logChannels.threadCreated);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#22C55E')
                        .setTitle('🧵 Thread Created')
                        .setDescription(`**Name:** ${thread.name}\n**Parent:** <#${thread.parentId}>\n**ID:** ${thread.id}`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            } catch (e) {
                console.error(`Thread Create Log Error: ${e.message}`);
            }
        }
    }
};
