const { logMemberAdd } = require('../handlers/logger');
const { checkRaid } = require('../handlers/antiRaid');
const { autoVerifyNewMember } = require('../handlers/verification');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client, config) {
        const { guild } = member;

        // ==================== AUTO ROLE ====================
        if (config.autoRole && config.autoRole.enabled) {
            let shouldIgnore = false;

            if (member.user.bot && config.autoRole.ignoreBots) {
                shouldIgnore = true;
            }

            if (config.autoRole.ignoreRoles && config.autoRole.ignoreRoles.length > 0) {
                if (member.roles.cache.some(role => config.autoRole.ignoreRoles.includes(role.id))) {
                    shouldIgnore = true;
                }
            }

            if (!shouldIgnore) {
                if (member.user.bot) {
                    const botRoles = config.autoRole.botRoles || [];
                    for (const roleId of botRoles) {
                        try {
                            const role = guild.roles.cache.get(roleId);
                            if (role) await member.roles.add(role).catch(() => {});
                        } catch (e) {
                            console.error(`Auto Role Error (Bot): ${e.message}`);
                        }
                    }
                } else {
                    const humanRoles = config.autoRole.roles || [];
                    for (const roleId of humanRoles) {
                        try {
                            const role = guild.roles.cache.get(roleId);
                            if (role) await member.roles.add(role).catch(() => {});
                        } catch (e) {
                            console.error(`Auto Role Error (Human): ${e.message}`);
                        }
                    }
                }
            }
        }

        // ==================== WELCOME MESSAGE ====================
        if (config.welcome && config.welcome.enabled && config.welcome.channelId) {
            try {
                const channel = guild.channels.cache.get(config.welcome.channelId);
                if (channel) {
                    let message = config.welcome.message || '%member_mention% Welcome!';
                    message = message
                        .replace(/%member_mention%/g, `<@${member.id}>`)
                        .replace(/%member_name%/g, member.user.username)
                        .replace(/%member_tag%/g, member.user.tag)
                        .replace(/%member_id%/g, member.id)
                        .replace(/%server_name%/g, guild.name)
                        .replace(/%member_count%/g, guild.memberCount);

                    let sentMessage = null;

                    if (config.welcome.embed) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor(config.welcome.color || '#5865F2')
                            .setDescription(message)
                            .setTimestamp();

                        if (config.welcome.imageUrl) embed.setImage(config.welcome.imageUrl);
                        if (config.welcome.thumbnailUrl) embed.setThumbnail(config.welcome.thumbnailUrl);
                        if (config.welcome.footer) embed.setFooter({ text: config.welcome.footer, iconURL: config.welcome.footerIcon });

                        sentMessage = await channel.send({ embeds: [embed] }).catch(() => null);
                    } else {
                        sentMessage = await channel.send({ content: message }).catch(() => null);
                    }

                    if (sentMessage && config.welcome.emoji) {
                        await sentMessage.react(config.welcome.emoji).catch(() => {});
                    }
                }
            } catch (e) {
                console.error(`Welcome Message Error: ${e.message}`);
            }
        }

        // ==================== INVITE TRACKER ====================
        if (config.inviteTracker && config.inviteTracker.enabled && config.inviteTracker.channelId) {
            try {
                const channel = guild.channels.cache.get(config.inviteTracker.channelId);
                if (channel) {
                    let message = config.inviteTracker.message || '%member_mention% was invited.';
                    message = message
                        .replace(/%member_mention%/g, `<@${member.id}>`)
                        .replace(/%member_name%/g, member.user.username)
                        .replace(/%member_tag%/g, member.user.tag)
                        .replace(/%server_name%/g, guild.name);

                    if (config.inviteTracker.embed) {
                        const { EmbedBuilder } = require('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor(config.inviteTracker.color || '#57F287')
                            .setDescription(message)
                            .setTimestamp();
                        await channel.send({ embeds: [embed] }).catch(() => {});
                    } else {
                        await channel.send({ content: message }).catch(() => {});
                    }
                }
            } catch (e) {
                console.error(`Invite Tracker Error: ${e.message}`);
            }
        }

        // ==================== ANTI-RAID ====================
        try {
            await checkRaid(guild, member, config);
        } catch (e) {
            console.error(`Anti-Raid Error: ${e.message}`);
        }

        // ==================== VERIFICATION ====================
        try {
            await autoVerifyNewMember(member);
        } catch (e) {
            console.error(`Verification Error: ${e.message}`);
        }

        // ==================== LOG ====================
        try {
            await logMemberAdd(member);
        } catch (e) {
            console.error(`Logger Error: ${e.message}`);
        }
    }
};
