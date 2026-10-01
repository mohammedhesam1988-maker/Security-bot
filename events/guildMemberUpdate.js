const { logMemberUpdate } = require('../handlers/logger');

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(oldMember, newMember, client, config) {
        if (!newMember.guild) return;
        const { guild } = newMember;

        // ==================== NICKNAME CHANGE ====================
        if (oldMember.nickname !== newMember.nickname) {
            if (config.logChannels && config.logChannels.nicknameChanged) {
                try {
                    const logChannel = guild.channels.cache.get(config.logChannels.nicknameChanged);
                    if (logChannel) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor('#FBBF24')
                            .setTitle('📝 Nickname Changed')
                            .setDescription(`**User:** ${newMember.user.tag} (<@${newMember.id}>)\n**Before:** ${oldMember.nickname || newMember.user.username}\n**After:** ${newMember.nickname || newMember.user.username}`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {
                    console.error(`Nickname Log Error: ${e.message}`);
                }
            }
        }

        // ==================== ROLE UPDATE ====================
        const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
        const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

        if (addedRoles.size > 0 || removedRoles.size > 0) {
            if (config.logChannels && config.logChannels.memberRolesUpdated) {
                try {
                    const logChannel = guild.channels.cache.get(config.logChannels.memberRolesUpdated);
                    if (logChannel) {
                        const { EmbedBuilder } = require('discord.js');
                        let description = `**User:** ${newMember.user.tag} (<@${newMember.id}>)\n`;
                        if (addedRoles.size > 0) description += `**Added:** ${addedRoles.map(r => `<@&${r.id}>`).join(', ')}\n`;
                        if (removedRoles.size > 0) description += `**Removed:** ${removedRoles.map(r => `<@&${r.id}>`).join(', ')}\n`;

                        const embed = new EmbedBuilder()
                            .setColor('#5865F2')
                            .setTitle('🏷️ Member Roles Updated')
                            .setDescription(description)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {
                    console.error(`Roles Update Log Error: ${e.message}`);
                }
            }

            if (addedRoles.size > 0 && config.logChannels && config.logChannels.roleGiven) {
                try {
                    const logChannel = guild.channels.cache.get(config.logChannels.roleGiven);
                    if (logChannel) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor('#22C55E')
                            .setTitle('➕ Role Given')
                            .setDescription(`**User:** ${newMember.user.tag} (<@${newMember.id}>)\n**Roles:** ${addedRoles.map(r => `<@&${r.id}>`).join(', ')}`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {}
            }

            if (removedRoles.size > 0 && config.logChannels && config.logChannels.roleRemoved) {
                try {
                    const logChannel = guild.channels.cache.get(config.logChannels.roleRemoved);
                    if (logChannel) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor('#EF4444')
                            .setTitle('➖ Role Removed')
                            .setDescription(`**User:** ${newMember.user.tag} (<@${newMember.id}>)\n**Roles:** ${removedRoles.map(r => `<@&${r.id}>`).join(', ')}`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {}
            }
        }

        // ==================== TIMEOUT UPDATE ====================
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
            if (config.logChannels && config.logChannels.memberTimeout) {
                try {
                    const logChannel = guild.channels.cache.get(config.logChannels.memberTimeout);
                    if (logChannel) {
                        const { EmbedBuilder } = require('discord.js');
                        const isTimeout = newMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp > Date.now();
                        const embed = new EmbedBuilder()
                            .setColor(isTimeout ? '#EF4444' : '#22C55E')
                            .setTitle(isTimeout ? '🔇 Timeout Given' : '🔊 Timeout Removed')
                            .setDescription(`**User:** ${newMember.user.tag} (<@${newMember.id}>)${isTimeout ? `\n**Until:** <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:R>` : ''}`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] }).catch(() => {});
                    }
                } catch (e) {}
            }
        }

        try {
            await logMemberUpdate(oldMember, newMember);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
