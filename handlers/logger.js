// ==================== LOGGER HANDLER ====================

function getLogChannel(guild, channelId) {
    if (!channelId) return null;
    return guild.channels.cache.get(channelId) || null;
}

async function sendLog(guild, title, description, color = '#5865F2') {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.general) return;
        const channel = getLogChannel(guild, config.logChannels.general);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`sendLog Error: ${e.message}`);
    }
}

async function logMemberAdd(member) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.memberJoined) return;
        const channel = getLogChannel(member.guild, config.logChannels.memberJoined);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#22C55E')
            .setTitle('📥 Member Joined')
            .setDescription(`**User:** ${member.user.tag} (<@${member.id}>)\n**Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n**Member Count:** ${member.guild.memberCount}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logMemberAdd Error: ${e.message}`);
    }
}

async function logMemberRemove(member) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.memberLeft) return;
        const channel = getLogChannel(member.guild, config.logChannels.memberLeft);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#EF4444')
            .setTitle('📤 Member Left')
            .setDescription(`**User:** ${member.user.tag} (<@${member.id}>)\n**Joined:** ${member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown'}\n**Member Count:** ${member.guild.memberCount}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logMemberRemove Error: ${e.message}`);
    }
}

async function logMessage(message, type) {
    try {
        const config = require('../config.js');
        if (!config.logChannels) return;

        let channelId = null;
        let title = '';
        let color = '#5865F2';

        if (type === 'delete' && config.logChannels.messageDeleted) {
            channelId = config.logChannels.messageDeleted;
            title = '🗑️ Message Deleted';
            color = '#EF4444';
        } else if (type === 'update' && config.logChannels.messageEdited) {
            channelId = config.logChannels.messageEdited;
            title = '✏️ Message Edited';
            color = '#FBBF24';
        } else if (type === 'create' && config.logChannels.general) {
            channelId = config.logChannels.general;
            title = '💬 Message Sent';
            color = '#5865F2';
        } else {
            return;
        }

        const channel = getLogChannel(message.guild, channelId);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(`**Author:** ${message.author ? message.author.tag : 'Unknown'}\n**Channel:** <#${message.channel.id}>\n**Content:**\n${message.content ? message.content.substring(0, 1000) : '*No content*'}`)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logMessage Error: ${e.message}`);
    }
}

async function logMessageDelete(message) {
    return logMessage(message, 'delete');
}

async function logMessageUpdate(oldMessage, newMessage) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.messageEdited) return;
        const channel = getLogChannel(newMessage.guild, config.logChannels.messageEdited);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#FBBF24')
            .setTitle('✏️ Message Edited')
            .setDescription(`**Author:** ${newMessage.author.tag}\n**Channel:** <#${newMessage.channel.id}>\n**Before:**\n${oldMessage.content ? oldMessage.content.substring(0, 500) : '*Unknown*'}\n**After:**\n${newMessage.content ? newMessage.content.substring(0, 500) : '*Unknown*'}`)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logMessageUpdate Error: ${e.message}`);
    }
}

async function logVoice(oldState, newState) {
    try {
        const config = require('../config.js');
        if (!config.logChannels) return;

        const member = newState.member || oldState.member;
        if (!member) return;
        const guild = newState.guild || oldState.guild;
        if (!guild) return;

        const { EmbedBuilder } = require('discord.js');

        if (!oldState.channelId && newState.channelId && config.logChannels.voiceJoined) {
            const channel = getLogChannel(guild, config.logChannels.voiceJoined);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor('#22C55E')
                    .setTitle('🔊 Member Joined Voice')
                    .setDescription(`**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${newState.channelId}>`)
                    .setTimestamp();
                await channel.send({ embeds: [embed] }).catch(() => {});
            }
        }

        if (oldState.channelId && !newState.channelId && config.logChannels.voiceLeft) {
            const channel = getLogChannel(guild, config.logChannels.voiceLeft);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor('#EF4444')
                    .setTitle('🔇 Member Left Voice')
                    .setDescription(`**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${oldState.channelId}>`)
                    .setTimestamp();
                await channel.send({ embeds: [embed] }).catch(() => {});
            }
        }

        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId && config.logChannels.voiceMoved) {
            const channel = getLogChannel(guild, config.logChannels.voiceMoved);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor('#FBBF24')
                    .setTitle('🔄 Member Moved Voice')
                    .setDescription(`**User:** ${member.user.tag} (<@${member.id}>)\n**From:** <#${oldState.channelId}>\n**To:** <#${newState.channelId}>`)
                    .setTimestamp();
                await channel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    } catch (e) {
        console.error(`logVoice Error: ${e.message}`);
    }
}

async function logVoiceUpdate(oldState, newState) {
    return logVoice(oldState, newState);
}

async function logChannel(channel, type) {
    try {
        const config = require('../config.js');
        if (!config.logChannels) return;

        let channelId = null;
        let title = '';
        let color = '#5865F2';

        if (type === 'create' && config.logChannels.channelCreated) {
            channelId = config.logChannels.channelCreated;
            title = '📁 Channel Created';
            color = '#22C55E';
        } else if (type === 'delete' && config.logChannels.channelDeleted) {
            channelId = config.logChannels.channelDeleted;
            title = '🗑️ Channel Deleted';
            color = '#EF4444';
        } else if (type === 'update' && config.logChannels.channelUpdated) {
            channelId = config.logChannels.channelUpdated;
            title = '✏️ Channel Updated';
            color = '#FBBF24';
        } else {
            return;
        }

        const logChannel = getLogChannel(channel.guild, channelId);
        if (!logChannel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(`**Channel:** ${channel.name} (${channel.id})`)
            .setTimestamp();
        await logChannel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logChannel Error: ${e.message}`);
    }
}

async function logChannelCreate(channel) {
    return logChannel(channel, 'create');
}

async function logChannelDelete(channel) {
    return logChannel(channel, 'delete');
}

async function logChannelUpdate(oldChannel, newChannel) {
    return logChannel(newChannel, 'update');
}

async function logChannelPermissions(oldChannel, newChannel) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.channelPermissionsUpdated) return;
        const channel = getLogChannel(newChannel.guild, config.logChannels.channelPermissionsUpdated);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🔒 Channel Permissions Updated')
            .setDescription(`**Channel:** <#${newChannel.id}>`)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logChannelPermissions Error: ${e.message}`);
    }
}

async function logRole(role, type) {
    try {
        const config = require('../config.js');
        if (!config.logChannels) return;

        let channelId = null;
        let title = '';
        let color = '#5865F2';

        if (type === 'create' && config.logChannels.roleCreated) {
            channelId = config.logChannels.roleCreated;
            title = '🏷️ Role Created';
            color = '#22C55E';
        } else if (type === 'delete' && config.logChannels.roleDeleted) {
            channelId = config.logChannels.roleDeleted;
            title = '🗑️ Role Deleted';
            color = '#EF4444';
        } else if (type === 'update' && config.logChannels.roleUpdated) {
            channelId = config.logChannels.roleUpdated;
            title = '✏️ Role Updated';
            color = '#FBBF24';
        } else {
            return;
        }

        const logChannel = getLogChannel(role.guild, channelId);
        if (!logChannel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(`**Role:** ${role.name} (${role.id})`)
            .setTimestamp();
        await logChannel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logRole Error: ${e.message}`);
    }
}

async function logRoleCreate(role) {
    return logRole(role, 'create');
}

async function logRoleDelete(role) {
    return logRole(role, 'delete');
}

async function logRoleUpdate(oldRole, newRole) {
    return logRole(newRole, 'update');
}

async function logBan(ban) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.memberBanned) return;
        const channel = getLogChannel(ban.guild, config.logChannels.memberBanned);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#EF4444')
            .setTitle('🔨 Member Banned')
            .setDescription(`**User:** ${ban.user.tag} (<@${ban.user.id}>)\n**Reason:** ${ban.reason || 'No reason'}`)
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logBan Error: ${e.message}`);
    }
}

async function logUnban(ban) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.memberUnbanned) return;
        const channel = getLogChannel(ban.guild, config.logChannels.memberUnbanned);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#22C55E')
            .setTitle('🔓 Member Unbanned')
            .setDescription(`**User:** ${ban.user.tag} (<@${ban.user.id}>)`)
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logUnban Error: ${e.message}`);
    }
}

async function logMemberUpdate(oldMember, newMember) {
    try {
        const config = require('../config.js');
        if (!config.logChannels) return;
        const guild = newMember.guild;

        if (oldMember.nickname !== newMember.nickname && config.logChannels.nicknameChanged) {
            const channel = getLogChannel(guild, config.logChannels.nicknameChanged);
            if (channel) {
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setColor('#FBBF24')
                    .setTitle('📝 Nickname Changed')
                    .setDescription(`**User:** ${newMember.user.tag}\n**Before:** ${oldMember.nickname || newMember.user.username}\n**After:** ${newMember.nickname || newMember.user.username}`)
                    .setTimestamp();
                await channel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    } catch (e) {
        console.error(`logMemberUpdate Error: ${e.message}`);
    }
}

async function logGuildUpdate(oldGuild, newGuild) {
    try {
        const config = require('../config.js');
        if (!config.logChannels || !config.logChannels.serverUpdated) return;
        const channel = getLogChannel(newGuild, config.logChannels.serverUpdated);
        if (!channel) return;

        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor('#FBBF24')
            .setTitle('🌐 Server Updated')
            .setDescription(`**Server:** ${newGuild.name}`)
            .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (e) {
        console.error(`logGuildUpdate Error: ${e.message}`);
    }
}

module.exports = {
    sendLog,
    logMemberAdd,
    logMemberRemove,
    logMessage,
    logMessageDelete,
    logMessageUpdate,
    logVoice,
    logVoiceUpdate,
    logChannel,
    logChannelCreate,
    logChannelDelete,
    logChannelUpdate,
    logChannelPermissions,
    logRole,
    logRoleCreate,
    logRoleDelete,
    logRoleUpdate,
    logBan,
    logUnban,
    logMemberUpdate,
    logGuildUpdate
};
