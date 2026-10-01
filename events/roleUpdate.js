const { sendLog } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'roleUpdate',
    once: false,
    async execute(oldRole, newRole, client, config) {
        if (!newRole.guild) return;

        // ==================== GET EXECUTOR ====================
        let executor = null;
        try {
            const auditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: 31 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor && Date.now() - entry.createdTimestamp < 5000) {
                    executor = entry.executor;
                }
            }
        } catch (e) {}

        if (oldRole.name !== newRole.name && executor) {
            await checkAction(newRole.guild, executor.id, 'roleRename', config);
        }

        // ==================== ANTI-NUKE: DANGEROUS PERMISSIONS ====================
        const dangerousPerms = ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'BanMembers', 'KickMembers', 'ManageWebhooks', 'MentionEveryone'];
        const oldPermsArray = oldRole.permissions.toArray();
        const newPermsArray = newRole.permissions.toArray();
        const addedPermsCheck = newPermsArray.filter(p => !oldPermsArray.includes(p));

        if (addedPermsCheck.some(p => dangerousPerms.includes(p)) && executor) {
            await checkAction(newRole.guild, executor.id, 'dangerousRolePermission', config);
        }

        // ==================== LOG: BASIC CHANGES ====================
        try {
            let changes = [];

            // Name Change
            if (oldRole.name !== newRole.name) {
                changes.push(`**📝 Name:** \`${oldRole.name}\` → \`${newRole.name}\``);
            }

            // Color Change
            if (oldRole.hexColor !== newRole.hexColor) {
                changes.push(`**🎨 Color:** \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``);
            }

            // Hoist Change
            if (oldRole.hoist !== newRole.hoist) {
                changes.push(`**📌 Hoist:** ${oldRole.hoist} → ${newRole.hoist}`);
            }

            // Mentionable Change
            if (oldRole.mentionable !== newRole.mentionable) {
                changes.push(`**💬 Mentionable:** ${oldRole.mentionable} → ${newRole.mentionable}`);
            }

            // Position Change
            if (oldRole.position !== newRole.position) {
                changes.push(`**📊 Position:** ${oldRole.position} → ${newRole.position}`);
            }

            if (changes.length > 0) {
                let description = `**Role:** ${newRole.name} (<@&${newRole.id}>)\n`;
                description += `**ID:** \`${newRole.id}\`\n`;
                description += `**Color:** \`${newRole.hexColor}\`\n`;
                if (executor) {
                    description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                    description += `**Modified By ID:** \`${executor.id}\`\n`;
                }
                description += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
                description += changes.join('\n');

                await sendLog(newRole.guild, '✏️ Role Updated', description, '#FBBF24');
            }
        } catch (e) {
            console.error(`Role Update Log Error: ${e.message}`);
        }

        // ==================== LOG: PERMISSIONS ====================
        try {
            const oldPerms = oldRole.permissions.toArray();
            const newPerms = newRole.permissions.toArray();

            const addedPermissions = newPerms.filter(p => !oldPerms.includes(p));
            const removedPermissions = oldPerms.filter(p => !newPerms.includes(p));

            if (addedPermissions.length > 0 || removedPermissions.length > 0) {
                let permChanges = [];

                if (addedPermissions.length > 0) {
                    permChanges.push(`\n**✅ Added Permissions (${addedPermissions.length}):**\n${addedPermissions.map(p => `• \`${p}\``).join('\n')}`);
                }

                if (removedPermissions.length > 0) {
                    permChanges.push(`\n**❌ Removed Permissions (${removedPermissions.length}):**\n${removedPermissions.map(p => `• \`${p}\``).join('\n')}`);
                }

                // Dangerous Permission Warning
                const dangerousAdded = addedPermissions.filter(p => dangerousPerms.includes(p));
                if (dangerousAdded.length > 0) {
                    permChanges.push(`\n⚠️ **DANGEROUS PERMISSIONS ADDED:**\n${dangerousAdded.map(p => `• \`${p}\``).join('\n')}`);
                }

                let description = `**Role:** ${newRole.name} (<@&${newRole.id}>)\n`;
                description += `**ID:** \`${newRole.id}\`\n`;
                if (executor) {
                    description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                    description += `**Modified By ID:** \`${executor.id}\`\n`;
                }
                description += `\n━━━━━━━━━━━━━━━━━━━━\n`;
                description += permChanges.join('\n');

                await sendLog(newRole.guild, '🔒 Role Permissions Updated', description, '#5865F2');
            }
        } catch (e) {
            console.error(`Role Permissions Log Error: ${e.message}`);
        }
    }
};
