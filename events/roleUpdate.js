const { sendLog } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');
const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'roleUpdate',
    once: false,
    async execute(oldRole, newRole, client, config) {
        if (!newRole.guild) return;

        // ================= GET EXECUTOR =================
        let executor = null;
        try {
            const auditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor && Date.now() - entry.createdTimestamp < 5000) {
                    executor = entry.executor;
                }
            }
        } catch (e) {
            console.error('Role Update Audit Error:', e.message);
        }

        // ================= ANTI-NUKE: RENAME =================
        if (oldRole.name !== newRole.name && executor) {
            const member = await newRole.guild.members.fetch(executor.id).catch(() => null);
            if (member && !member.user.bot) {
                await checkAction(newRole.guild, executor.id, 'roleRename', config);
            }
        }

        // ================= ANTI-NUKE: ROLE UPDATE =================
        if (executor) {
            const member = await newRole.guild.members.fetch(executor.id).catch(() => null);
            if (member && !member.user.bot) {
                await checkAction(newRole.guild, executor.id, 'roleUpdate', config);
            }
        }

        // ================= LOG =================
        if (config.logChannels?.roleUpdated) {
            const logChannel = newRole.guild.channels.cache.get(config.logChannels.roleUpdated);
            if (logChannel) {
                let changes = [];

                if (oldRole.name !== newRole.name) changes.push(`📝 **Name:** \`${oldRole.name}\` → \`${newRole.name}\``);
                if (oldRole.hexColor !== newRole.hexColor) changes.push(`🎨 **Color:** \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``);
                if (oldRole.hoist !== newRole.hoist) changes.push(`📌 **Hoist:** \`${oldRole.hoist}\` → \`${newRole.hoist}\``);
                if (oldRole.mentionable !== newRole.mentionable) changes.push(`💬 **Mentionable:** \`${oldRole.mentionable}\` → \`${newRole.mentionable}\``);
                if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) changes.push(`🔒 **Permissions changed**`);

                if (changes.length > 0) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#FEE75C')
                        .setTitle('✏️ Role Updated')
                        .setDescription(changes.join('\n'))
                        .addFields(
                            { name: 'Role', value: `${newRole.name} (${newRole.id})`, inline: true },
                            { name: 'Modified By', value: executor ? `${executor.tag}` : 'Unknown', inline: true }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
        }
    }
};
