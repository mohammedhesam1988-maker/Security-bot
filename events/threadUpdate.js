module.exports = {
    name: 'threadUpdate',
    once: false,
    async execute(oldThread, newThread, client, config) {
        if (!newThread.guild) return;
        const { guild } = newThread;

        // ==================== LOG ====================
        if (config.logChannels && config.logChannels.threadUpdated) {
            try {
                const logChannel = guild.channels.cache.get(config.logChannels.threadUpdated);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    let changes = '';
                    if (oldThread.name !== newThread.name) changes += `**Name:** ${oldThread.name} → ${newThread.name}\n`;
                    if (oldThread.archived !== newThread.archived) changes += `**Archived:** ${oldThread.archived} → ${newThread.archived}\n`;
                    if (oldThread.locked !== newThread.locked) changes += `**Locked:** ${oldThread.locked} → ${newThread.locked}\n`;
                    if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) changes += `**Slowmode:** ${oldThread.rateLimitPerUser}s → ${newThread.rateLimitPerUser}s\n`;

                    if (changes) {
                        const embed = new EmbedBuilder()
                            .setColor('#FBBF24')
                            .setTitle('✏️ Thread Updated')
                            .setDescription(`**Thread:** <#${newThread.id}>\n${changes}`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                }
            } catch (e) {
                console.error(`Thread Update Log Error: ${e.message}`);
            }
        }
    }
};
