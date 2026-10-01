const { sendLog } = require('../handlers/logger');
const { checkVoiceSpam } = require('../handlers/antiSpam');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(oldState, newState, client, config) {
        const member = newState.member || oldState.member;
        if (!member || member.user.bot) return;

        const guild = newState.guild || oldState.guild;
        if (!guild) return;

        // ==================== VOICE SPAM CHECK ====================
        if (newState.channelId) {
            try {
                await checkVoiceSpam(member, config);
            } catch (e) {
                console.error(`Voice Spam Error: ${e.message}`);
            }
        }

        // ==================== GET EXECUTOR (Audit Log) ====================
        let executor = null;
        try {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 24 }).catch(() => null);
            if (auditLogs) {
                const entry = auditLogs.entries.first();
                if (entry && entry.executor && Date.now() - entry.createdTimestamp < 5000) {
                    executor = entry.executor;
                }
            }
        } catch (e) {}

        // ==================== VOICE JOIN ====================
        if (!oldState.channelId && newState.channelId) {
            await sendLog(guild, '🔊 Joined Voice', `**User:** ${member.user.tag} (<@${member.id}>)\n**ID:** \`${member.id}\`\n**Channel:** <#${newState.channelId}>`, '#22C55E');
        }

        // ==================== VOICE LEAVE ====================
        if (oldState.channelId && !newState.channelId) {
            await sendLog(guild, '🔇 Left Voice', `**User:** ${member.user.tag} (<@${member.id}>)\n**ID:** \`${member.id}\`\n**Channel:** <#${oldState.channelId}>`, '#EF4444');
        }

        // ==================== VOICE MOVE ====================
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            let description = `**User:** ${member.user.tag} (<@${member.id}>)\n`;
            description += `**From:** <#${oldState.channelId}>\n`;
            description += `**To:** <#${newState.channelId}>\n`;
            if (executor) {
                description += `**Moved By:** ${executor.tag} (<@${executor.id}>)\n`;
                description += `**Moved By ID:** \`${executor.id}\`\n`;
            }
            await sendLog(guild, '🔄 Moved Voice', description, '#FBBF24');
        }

        // ==================== MIC MUTE/UNMUTE (Self) ====================
        if (oldState.selfMute !== newState.selfMute) {
            const action = newState.selfMute ? '🔇 Muted Microphone' : '🔊 Unmuted Microphone';
            await sendLog(guild, action, `**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${newState.channelId}>`, newState.selfMute ? '#EF4444' : '#22C55E');
        }

        // ==================== DEAFEN/UNDEAFEN (Self) ====================
        if (oldState.selfDeaf !== newState.selfDeaf) {
            const action = newState.selfDeaf ? '🔇 Deafened' : '🔊 Undeafened';
            await sendLog(guild, action, `**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${newState.channelId}>`, newState.selfDeaf ? '#EF4444' : '#22C55E');
        }

        // ==================== SERVER MUTE/UNMUTE ====================
        if (oldState.serverMute !== newState.serverMute) {
            const action = newState.serverMute ? '🔇 Server Muted' : '🔊 Server Unmuted';
            let description = `**User:** ${member.user.tag} (<@${member.id}>)\n`;
            description += `**Channel:** <#${newState.channelId}>\n`;
            if (executor) {
                description += `**Muted By:** ${executor.tag} (<@${executor.id}>)\n`;
                description += `**Muted By ID:** \`${executor.id}\`\n`;
            }
            await sendLog(guild, action, description, newState.serverMute ? '#EF4444' : '#22C55E');
        }

        // ==================== SERVER DEAFEN/UNDEAFEN ====================
        if (oldState.serverDeaf !== newState.serverDeaf) {
            const action = newState.serverDeaf ? '🔇 Server Deafened' : '🔊 Server Undeafened';
            let description = `**User:** ${member.user.tag} (<@${member.id}>)\n`;
            description += `**Channel:** <#${newState.channelId}>\n`;
            if (executor) {
                description += `**Deafened By:** ${executor.tag} (<@${executor.id}>)\n`;
                description += `**Deafened By ID:** \`${executor.id}\`\n`;
            }
            await sendLog(guild, action, description, newState.serverDeaf ? '#EF4444' : '#22C55E');
        }

        // ==================== DISCONNECT (Force) ====================
        if (oldState.channelId && !newState.channelId && executor) {
            let description = `**User:** ${member.user.tag} (<@${member.id}>)\n`;
            description += `**Channel:** <#${oldState.channelId}>\n`;
            description += `**Disconnected By:** ${executor.tag} (<@${executor.id}>)\n`;
            description += `**Disconnected By ID:** \`${executor.id}\`\n`;
            await sendLog(guild, '🔌 Disconnected from Voice', description, '#EF4444');
        }

        // ==================== LIVE STREAM ====================
        if (oldState.streaming !== newState.streaming) {
            const action = newState.streaming ? '📺 Started Live Stream' : '📺 Stopped Live Stream';
            await sendLog(guild, action, `**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${newState.channelId}>`, newState.streaming ? '#22C55E' : '#EF4444');
        }

        // ==================== CAMERA ON/OFF ====================
        if (oldState.selfVideo !== newState.selfVideo) {
            const action = newState.selfVideo ? '📹 Camera On' : '📹 Camera Off';
            await sendLog(guild, action, `**User:** ${member.user.tag} (<@${member.id}>)\n**Channel:** <#${newState.channelId}>`, newState.selfVideo ? '#22C55E' : '#EF4444');
        }
    }
};
