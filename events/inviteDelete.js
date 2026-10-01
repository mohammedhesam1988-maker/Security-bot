module.exports = {
    name: 'inviteDelete',
    once: false,
    async execute(invite, client, config) {
        if (!invite.guild) return;
        const { guild } = invite;

        // ==================== ANTI-NUKE: INVITE DELETE ====================
        if (config.securityLimits && config.securityLimits.inviteDelete && config.securityLimits.inviteDelete.enabled) {
            try {
                const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 42 }).catch(() => null);
                if (auditLogs) {
                    const entry = auditLogs.entries.first();
                    if (entry && entry.executor) {
                        const executor = entry.executor;
                        if (config.whitelist && config.whitelist.users && config.whitelist.users.all) {
                            if (config.whitelist.users.all.includes(executor.id)) return;
                        }
                        if (config.whitelist && config.whitelist.roles && config.whitelist.roles.all) {
                            const member = await guild.members.fetch(executor.id).catch(() => null);
                            if (member && member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return;
                        }

                        if (!client.inviteDeleteTracker) client.inviteDeleteTracker = new Map();
                        const key = `${guild.id}-${executor.id}`;
                        const now = Date.now();
                        if (!client.inviteDeleteTracker.has(key)) client.inviteDeleteTracker.set(key, []);
                        const actions = client.inviteDeleteTracker.get(key);
                        actions.push(now);

                        const window = 60000;
                        const validActions = actions.filter(t => now - t < window);
                        client.inviteDeleteTracker.set(key, validActions);

                        if (validActions.length >= (config.securityLimits.inviteDelete.max || 5)) {
                            const punishment = config.securityLimits.inviteDelete.punishment || 'kick';
                            const member = await guild.members.fetch(executor.id).catch(() => null);
                            if (member) {
                                try {
                                    if (punishment === 'kick') await member.kick('Anti-Nuke: Mass Invite Delete').catch(() => {});
                                    if (punishment === 'ban') await member.ban({ reason: 'Anti-Nuke: Mass Invite Delete' }).catch(() => {});
                                    if (punishment === 'timeout') await member.timeout(60000, 'Anti-Nuke: Mass Invite Delete').catch(() => {});
                                } catch (e) {}
                            }
                            client.inviteDeleteTracker.set(key, []);
                        }
                    }
                }
            } catch (e) {
                console.error(`Anti-Nuke InviteDelete Error: ${e.message}`);
            }
        }

        // ==================== LOG ====================
        if (config.logChannels && config.logChannels.general) {
            try {
                const logChannel = guild.channels.cache.get(config.logChannels.general);
                if (logChannel) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#EF4444')
                        .setTitle('🗑️ Invite Deleted')
                        .setDescription(`**Code:** ${invite.code}\n**Channel:** <#${invite.channelId}>`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            } catch (e) {
                console.error(`Invite Delete Log Error: ${e.message}`);
            }
        }
    }
};
