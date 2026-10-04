const { EmbedBuilder } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'inviteCreate',
    once: false,
    async execute(invite, client, config) {
        if (!invite.guild) return;

        try {
            // ================= ANTI-NUKE =================
            if (invite.inviter) {
                const member = await invite.guild.members.fetch(invite.inviter.id).catch(() => null);
                if (member && !member.user.bot) {
                    await checkAction(invite.guild, invite.inviter.id, 'inviteLink', config, 3);
                }
            }

            // ================= LOG =================
            if (config.logChannels?.inviteCreated) {
                const logChannel = invite.guild.channels.cache.get(config.logChannels.inviteCreated);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#57F287')
                        .setTitle('🔗 لینکی بانگهێشتنامە دروستکرا')
                        .addFields(
                            { name: 'کۆد', value: invite.code, inline: true },
                            { name: 'چانێل', value: invite.channel ? `${invite.channel.name}` : 'نەزانراو', inline: true },
                            { name: 'دروستکەر', value: invite.inviter ? `${invite.inviter.tag}` : 'نەزانراو', inline: true },
                            { name: 'ماوە', value: invite.maxAge === 0 ? 'هەمیشەیی' : `${invite.maxAge} چرکە`, inline: true },
                            { name: 'زۆرترین بەکارهێنان', value: invite.maxUses === 0 ? 'بێ سنوور' : `${invite.maxUses}`, inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (error) {
            console.error('Invite Create Error:', error);
        }
    }
};
