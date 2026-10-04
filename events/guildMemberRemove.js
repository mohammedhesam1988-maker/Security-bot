const { EmbedBuilder } = require('discord.js');
const { logMemberRemove } = require('../handlers/logger');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member, client, config) {
        if (!member.guild) return;

        // ================= GOODBYE MESSAGE =================
        if (config.goodbye && config.goodbye.enabled && config.goodbye.channelId) {
            try {
                const channel = member.guild.channels.cache.get(config.goodbye.channelId);
                if (channel) {
                    let message = config.goodbye.message || '{member} Goodbye!';
                    message = message
                        .replace(/{member_mention}/g, `<@${member.id}>`)
                        .replace(/{member_name}/g, member.user.username)
                        .replace(/{member_tag}/g, member.user.tag)
                        .replace(/{member_id}/g, member.id)
                        .replace(/{server_name}/g, member.guild.name)
                        .replace(/{member_count}/g, member.guild.memberCount);

                    let sentMessage = null;

                    if (config.goodbye.embed) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor(config.goodbye.color || '#ED4245')
                            .setDescription(message)
                            .setTimestamp();

                        if (config.goodbye.imageUrl) embed.setImage(config.goodbye.imageUrl);
                        if (config.goodbye.thumbnailUrl) embed.setThumbnail(config.goodbye.thumbnailUrl);
                        if (config.goodbye.footer) embed.setFooter({ text: config.goodbye.footer, iconURL: config.goodbye.footerIcon });

                        sentMessage = await channel.send({ embeds: [embed] }).catch(() => null);
                    } else {
                        sentMessage = await channel.send({ content: message }).catch(() => null);
                    }

                    if (sentMessage && config.goodbye.emoji) {
                        await sentMessage.react(config.goodbye.emoji).catch(() => {});
                    }
                }
            } catch (e) {
                console.error(`Goodbye Message Error: ${e.message}`);
            }
        }

        // ================= LOG =================
        try {
            await logMemberRemove(member);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
