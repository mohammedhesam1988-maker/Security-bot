const { logMemberRemove } = require('../handlers/logger');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member, client, config) {
        const { guild } = member;

        // ==================== GOODBYE MESSAGE ====================
        if (config.goodbye && config.goodbye.enabled && config.goodbye.channelId) {
            try {
                const channel = guild.channels.cache.get(config.goodbye.channelId);
                if (channel) {
                    let message = config.goodbye.message || '%member_name% has left.';
                    message = message
                        .replace(/%member_mention%/g, `<@${member.id}>`)
                        .replace(/%member_name%/g, member.user.username)
                        .replace(/%member_tag%/g, member.user.tag)
                        .replace(/%member_id%/g, member.id)
                        .replace(/%server_name%/g, guild.name)
                        .replace(/%member_count%/g, guild.memberCount);

                    if (config.goodbye.embed) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor(config.goodbye.color || '#ED4245')
                            .setDescription(message)
                            .setTimestamp();
                        await channel.send({ embeds: [embed] }).catch(() => {});
                    } else {
                        await channel.send({ content: message }).catch(() => {});
                    }
                }
            } catch (e) {
                console.error(`Goodbye Message Error: ${e.message}`);
            }
        }

        // ==================== LOG ====================
        try {
            await logMemberRemove(member);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
