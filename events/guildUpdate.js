const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'guildUpdate',
    once: false,
    async execute(oldGuild, newGuild, client, config) {
        try {
            // ================= GET EXECUTOR =================
            let executor = null;
            try {
                const auditLogs = await newGuild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.GuildUpdate
                }).catch(() => null);

                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor && Date.now() - entry.createdTimestamp < 5000) {
                        executor = entry.executor;
                    }
                }
            } catch (e) {
                console.error('Guild Update Audit Error:', e.message);
            }

            // ================= ANTI-NUKE =================
            if (executor) {
                const member = await newGuild.members.fetch(executor.id).catch(() => null);
                if (member && !member.user.bot) {
                    if (oldGuild.name !== newGuild.name) {
                        await checkAction(newGuild, executor.id, 'serverRename', config);
                    }
                    if (oldGuild.icon !== newGuild.icon) {
                        await checkAction(newGuild, executor.id, 'serverIconChange', config);
                    }
                    if (oldGuild.banner !== newGuild.banner) {
                        await checkAction(newGuild, executor.id, 'serverBannerChange', config);
                    }
                    if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                        await checkAction(newGuild, executor.id, 'vanityChange', config);
                    }
                }
            }

            // ================= LOG: CHANGES =================
            if (config.logChannels && config.logChannels.serverUpdated) {
                try {
                    const logChannel = newGuild.channels.cache.get(config.logChannels.serverUpdated);
                    if (logChannel) {
                        let changes = [];

                        if (oldGuild.name !== newGuild.name) {
                            changes.push(`📝 **Name:** \`${oldGuild.name}\` → \`${newGuild.name}\``);
                        }
                        if (oldGuild.icon !== newGuild.icon) {
                            changes.push(`🖼️ **Icon:** Changed`);
                        }
                        if (oldGuild.banner !== newGuild.banner) {
                            changes.push(`🖼️ **Banner:** Changed`);
                        }
                        if (oldGuild.splash !== newGuild.splash) {
                            changes.push(`🖼️ **Splash:** Changed`);
                        }
                        if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                            changes.push(`🔗 **Vanity URL:** \`${oldGuild.vanityURLCode || 'None'}\` → \`${newGuild.vanityURLCode || 'None'}\``);
                        }
                        if (oldGuild.description !== newGuild.description) {
                            changes.push(`📋 **Description:** Changed`);
                        }
                        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                            changes.push(`✅ **Verification Level:** \`${oldGuild.verificationLevel}\` → \`${newGuild.verificationLevel}\``);
                        }
                        if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                            changes.push(`🔞 **Content Filter:** \`${oldGuild.explicitContentFilter}\` → \`${newGuild.explicitContentFilter}\``);
                        }

                        if (changes.length > 0) {
                            let description = `**Server:** ${newGuild.name}\n**ID:** \`${newGuild.id}\`\n`;
                            if (executor) {
                                description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                            }
                            description += `\n─────────────────\n\n`;
                            description += changes.join('\n');

                            const embed = new EmbedBuilder()
                                .setColor('#FEE75C')
                                .setTitle('✏️ Server Updated')
                                .setDescription(description)
                                .setTimestamp();

                            await logChannel.send({ embeds: [embed] }).catch(() => {});
                        }
                    }
                } catch (e) {
                    console.error(`Guild Update Log Error: ${e.message}`);
                }
            }

        } catch (error) {
            console.error('Guild Update Error:', error);
        }
    }
};
