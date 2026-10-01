const { sendLog } = require('../handlers/logger');
const { checkAction } = require('../handlers/antiNuke');

module.exports = {
    name: 'channelUpdate',
    once: false,
    async execute(oldChannel, newChannel, client, config) {
        if (!newChannel.guild) return;

        // ==================== GET EXECUTOR ====================
        let executor = null;
        try {
            const auditLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: 11 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor && Date.now() - entry.createdTimestamp < 5000) {
                    executor = entry.executor;
                }
            }
        } catch (e) {}

        if (oldChannel.name !== newChannel.name && executor) {
            await checkAction(newChannel.guild, executor.id, 'channelRename', config);
        }

        // ==================== LOG: CHANGES ====================
        try {
            let changes = [];

            if (oldChannel.name !== newChannel.name) changes.push(`**📝 Name:** \`${oldChannel.name}\` → \`${newChannel.name}\``);
            if (oldChannel.topic !== newChannel.topic) changes.push(`**📋 Topic:** \`${oldChannel.topic || 'None'}\` → \`${newChannel.topic || 'None'}\``);
            if (oldChannel.nsfw !== newChannel.nsfw) changes.push(`**🔞 NSFW:** ${oldChannel.nsfw} → ${newChannel.nsfw}`);
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) changes.push(`**⏱️ Slowmode:** ${oldChannel.rateLimitPerUser}s → ${newChannel.rateLimitPerUser}s`);
            if (oldChannel.userLimit !== newChannel.userLimit) changes.push(`**👥 User Limit:** ${oldChannel.userLimit} → ${newChannel.userLimit}`);
            if (oldChannel.bitrate !== newChannel.bitrate) changes.push(`**🎵 Bitrate:** ${oldChannel.bitrate} → ${newChannel.bitrate}`);

            if (changes.length > 0) {
                let description = `**Channel:** <#${newChannel.id}>\n**ID:** \`${newChannel.id}\`\n`;
                if (executor) description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                description += `\n${changes.join('\n')}`;
                await sendLog(newChannel.guild, '✏️ Channel Updated', description, '#FBBF24');
            }
        } catch (e) {
            console.error(`Channel Update Log Error: ${e.message}`);
        }

        // ==================== LOG: PERMISSIONS ====================
        try {
            const oldOverwrites = oldChannel.permissionOverwrites.cache;
            const newOverwrites = newChannel.permissionOverwrites.cache;

            if (JSON.stringify(oldOverwrites) !== JSON.stringify(newOverwrites)) {
                let changes = [];

                // پشکنینی گۆڕانکارییەکان
                newOverwrites.forEach((newOverwrite, id) => {
                    const oldOverwrite = oldOverwrites.get(id);
                    const target = newChannel.guild.roles.cache.get(id) || newChannel.guild.members.cache.get(id);
                    const targetName = target ? target.name : id;

                    if (!oldOverwrite) {
                        changes.push(`**➕ Added Overwrite:** \`${targetName}\``);
                    } else {
                        const oldAllow = oldOverwrite.allow.toArray();
                        const newAllow = newOverwrite.allow.toArray();
                        const oldDeny = oldOverwrite.deny.toArray();
                        const newDeny = newOverwrite.deny.toArray();

                        const addedAllow = newAllow.filter(p => !oldAllow.includes(p));
                        const removedAllow = oldAllow.filter(p => !newAllow.includes(p));
                        const addedDeny = newDeny.filter(p => !oldDeny.includes(p));
                        const removedDeny = oldDeny.filter(p => !newDeny.includes(p));

                        if (addedAllow.length > 0) changes.push(`**➕ ${targetName} Allowed:** ${addedAllow.join(', ')}`);
                        if (removedAllow.length > 0) changes.push(`**➖ ${targetName} Removed Allow:** ${removedAllow.join(', ')}`);
                        if (addedDeny.length > 0) changes.push(`**➕ ${targetName} Denied:** ${addedDeny.join(', ')}`);
                        if (removedDeny.length > 0) changes.push(`**➖ ${targetName} Removed Deny:** ${removedDeny.join(', ')}`);
                    }
                });

                // پشکنینی ئەوەی لابراوە
                oldOverwrites.forEach((oldOverwrite, id) => {
                    if (!newOverwrites.has(id)) {
                        const target = newChannel.guild.roles.cache.get(id) || newChannel.guild.members.cache.get(id);
                        const targetName = target ? target.name : id;
                        changes.push(`**❌ Removed Overwrite:** \`${targetName}\``);
                    }
                });

                if (changes.length > 0) {
                    let description = `**Channel:** <#${newChannel.id}>\n**ID:** \`${newChannel.id}\`\n`;
                    if (executor) description += `**Modified By:** ${executor.tag} (<@${executor.id}>)\n`;
                    description += `\n${changes.join('\n')}`;
                    await sendLog(newChannel.guild, '🔒 Channel Permissions Updated', description, '#5865F2');
                }
            }
        } catch (e) {
            console.error(`Channel Permissions Log Error: ${e.message}`);
        }
    }
};
