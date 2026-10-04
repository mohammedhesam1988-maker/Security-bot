const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(oldMember, newMember, client, config) {
        if (!newMember.guild) return;

        try {
            // ================= TIMEOUT CHECK =================
            const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
            const newTimeout = newMember.communicationDisabledUntilTimestamp;

            if (oldTimeout !== newTimeout) {
                if (config.logChannels && config.logChannels.moderation) {
                    try {
                        const logChannel = newMember.guild.channels.cache.get(config.logChannels.moderation);
                        if (logChannel) {
                            let description = `**User:** ${newMember.user.tag} (<@${newMember.id}>)\n`;
                            
                            if (newTimeout && !oldTimeout) {
                                description += `**Action:** Muted (Timeout)\n**Until:** <t:${Math.floor(newTimeout / 1000)}:R>`;
                            } else if (!newTimeout && oldTimeout) {
                                description += `**Action:** Unmuted (Timeout Removed)`;
                            } else if (newTimeout && oldTimeout) {
                                description += `**Action:** Timeout Updated\n**Until:** <t:${Math.floor(newTimeout / 1000)}:R>`;
                            }

                            const embed = new EmbedBuilder()
                                .setColor(newTimeout ? '#ED4245' : '#57F287')
                                .setTitle(newTimeout ? '🔇 Member Muted' : '🔊 Member Unmuted')
                                .setDescription(description)
                                .setTimestamp();
                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    } catch (e) {
                        console.error(`Timeout Log Error: ${e.message}`);
                    }
                }
            }

            // ================= NICKNAME CHANGE =================
            if (oldMember.nickname !== newMember.nickname) {
                if (config.logChannels && config.logChannels.nicknameChanged) {
                    try {
                        const logChannel = newMember.guild.channels.cache.get(config.logChannels.nicknameChanged);
                        if (logChannel) {
                            const embed = new EmbedBuilder()
                                .setColor('#FFBF24')
                                .setTitle('📝 Nickname Changed')
                                .setDescription(`**User:** ${newMember.user.tag} (<@${newMember.id}>)\n**Before:** \`${oldMember.nickname || oldMember.user.username}\`\n**After:** \`${newMember.nickname || newMember.user.username}\``)
                                .setTimestamp();
                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    } catch (e) {
                        console.error(`Nickname Log Error: ${e.message}`);
                    }
                }
            }

            // ================= ROLE UPDATE =================
            const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
            const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

            if (addedRoles.size > 0 || removedRoles.size > 0) {

                // ================= ANTI-NUKE =================
                try {
                    const auditLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate }).catch(() => null);
                    if (auditLogs) {
                        const entry = auditLogs.entries.first();
                        if (entry && entry.executor && entry.target.id === newMember.id) {
                            const executor = entry.executor;
                            const member = await newMember.guild.members.fetch(executor.id).catch(() => null);
                            if (member && !member.user.bot) {
                                await checkAction(newMember.guild, executor.id, 'roleAdd', config, addedRoles.size);
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Anti-Nuke Member Role Update Error: ${e.message}`);
                }

                // ================= LOG =================
                if (config.logChannels && config.logChannels.memberRolesUpdated) {
                    try {
                        const logChannel = newMember.guild.channels.cache.get(config.logChannels.memberRolesUpdated);
                        if (logChannel) {
                            let description = `**User:** ${newMember.user.tag} (<@${newMember.id}>)\n`;
                            if (addedRoles.size > 0) description += `**Added:** ${addedRoles.map(r => `<@&${r.id}>`).join(', ')}\n`;
                            if (removedRoles.size > 0) description += `**Removed:** ${removedRoles.map(r => `<@&${r.id}>`).join(', ')}\n`;

                            const embed = new EmbedBuilder()
                                .setColor('#5865F2')
                                .setTitle('🎭 Member Roles Updated')
                                .setDescription(description)
                                .setTimestamp();
                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    } catch (e) {
                        console.error(`Roles Update Log Error: ${e.message}`);
                    }
                }

                // ================= ROLE GIVEN LOG =================
                if (addedRoles.size > 0 && config.logChannels && config.logChannels.roleGiven) {
                    try {
                        const logChannel = newMember.guild.channels.cache.get(config.logChannels.roleGiven);
                        if (logChannel) {
                            const embed = new EmbedBuilder()
                                .setColor('#57F287')
                                .setTitle('✅ Role Given')
                                .setDescription(`**User:** ${newMember.user.tag}\n**Roles:** ${addedRoles.map(r => `<@&${r.id}>`).join(', ')}`)
                                .setTimestamp();
                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    } catch (e) {
                        console.error(`Role Given Log Error: ${e.message}`);
                    }
                }

                // ================= ROLE REMOVED LOG =================
                if (removedRoles.size > 0 && config.logChannels && config.logChannels.roleRemoved) {
                    try {
                        const logChannel = newMember.guild.channels.cache.get(config.logChannels.roleRemoved);
                        if (logChannel) {
                            const embed = new EmbedBuilder()
                                .setColor('#ED4245')
                                .setTitle('❌ Role Removed')
                                .setDescription(`**User:** ${newMember.user.tag}\n**Roles:** ${removedRoles.map(r => `<@&${r.id}>`).join(', ')}`)
                                .setTimestamp();
                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    } catch (e) {
                        console.error(`Role Removed Log Error: ${e.message}`);
                    }
                }
            }

        } catch (error) {
            console.error('Guild Member Update Error:', error);
        }
    }
};
