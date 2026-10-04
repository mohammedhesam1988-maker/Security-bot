module.exports = {
    name: 'commandHandler',

    // ================= چێککردنی چانێل =================
    async checkChannel(interaction, commandName, config) {
        try {
            if (!config.utility || !config.utility[commandName]) return true;

            const cmdSettings = config.utility[commandName];

            if (cmdSettings.channelId) {
                if (interaction.channel.id !== cmdSettings.channelId) {
                    await interaction.reply({
                        content: `❌ ئەم فەرمانە تەنها لە چانێلی <#${cmdSettings.channelId}> دەکرێت بەکاربهێنرێت.`,
                        ephemeral: true
                    }).catch(() => {});
                    return false;
                }
            }
            return true;
        } catch (e) {
            console.error(`checkChannel Error: ${e.message}`);
            return true;
        }
    },

    // ================= چێککردنی ڕۆڵ =================
    async checkRoles(interaction, commandName, config) {
        try {
            if (!config.utility || !config.utility[commandName]) return true;

            const cmdSettings = config.utility[commandName];

            if (cmdSettings.enabledRoles && cmdSettings.enabledRoles.length > 0) {
                if (!interaction.member.roles.cache.some(r => cmdSettings.enabledRoles.includes(r.id))) {
                    await interaction.reply({
                        content: '❌ تۆ ڕۆڵی پێویستت نییە بۆ بەکارهێنانی ئەم فەرمانە.',
                        ephemeral: true
                    }).catch(() => {});
                    return false;
                }
            }

            if (cmdSettings.disabledRoles && cmdSettings.disabledRoles.length > 0) {
                if (interaction.member.roles.cache.some(r => cmdSettings.disabledRoles.includes(r.id))) {
                    await interaction.reply({
                        content: '❌ تۆ ناتوانیت ئەم فەرمانە بەکاربهێنیت.',
                        ephemeral: true
                    }).catch(() => {});
                    return false;
                }
            }
            return true;
        } catch (e) {
            console.error(`checkRoles Error: ${e.message}`);
            return true;
        }
    },

    // ================= چێککردنی سنووری فەرمان =================
    async checkLimit(interaction, commandName, config) {
        try {
            if (!config.utility || !config.utility[commandName]) return true;

            const cmdSettings = config.utility[commandName];
            if (!cmdSettings.maxLimit || cmdSettings.maxLimit <= 0) return true;

            if (!global.commandUsage) global.commandUsage = new Map();
            const key = `${interaction.user.id}-${commandName}`;
            const usage = global.commandUsage.get(key) || 0;

            if (usage >= cmdSettings.maxLimit) {
                await interaction.reply({
                    content: `❌ تۆ زۆرترین جار ئەم فەرمانەت بەکارهێناوە (${cmdSettings.maxLimit} جار).`,
                    ephemeral: true
                }).catch(() => {});
                return false;
            }

            global.commandUsage.set(key, usage + 1);
            return true;
        } catch (e) {
            console.error(`checkLimit Error: ${e.message}`);
            return true;
        }
    },

    // ================= چێککردنی Whitelist =================
    async checkWhitelistLimit(interaction, commandName, config) {
        try {
            if (!config.whitelist || !config.whitelist.users || !config.whitelist.users.all) return true;

            const isWhitelisted = config.whitelist.users.all.includes(interaction.user.id);
            if (isWhitelisted) return true;

            const limit = config.whitelist.users.limit || 5;
            const window = config.whitelist.users.window || 600000;

            if (!global.whitelistUsage) global.whitelistUsage = new Map();
            const key = `${interaction.user.id}-${commandName}`;
            const usage = global.whitelistUsage.get(key) || [];

            const now = Date.now();
            const validUsage = usage.filter(t => now - t < window);
            global.whitelistUsage.set(key, validUsage);

            if (validUsage.length >= limit) {
                const punishment = config.securityLimits?.botAdd?.punishment || 'kick';

                if (punishment === 'kick' && interaction.member.kickable) {
                    await interaction.member.kick('Whitelist Limit Exceeded').catch(() => {});
                } else if (punishment === 'ban' && interaction.member.bannable) {
                    await interaction.member.ban({ reason: 'Whitelist Limit Exceeded' }).catch(() => {});
                } else if (punishment === 'timeout' && interaction.member.moderatable) {
                    await interaction.member.timeout(10 * 60 * 1000, 'Whitelist Limit Exceeded').catch(() => {});
                }

                await interaction.reply({
                    content: `❌ تۆ زۆرترین جار ئەم فەرمانەت بەکارهێناوە (${limit} جار) لە ${window / 60000} خولەکدا.`,
                    ephemeral: true
                }).catch(() => {});

                return false;
            }

            validUsage.push(now);
            global.whitelistUsage.set(key, validUsage);
            return true;
        } catch (e) {
            console.error(`checkWhitelistLimit Error: ${e.message}`);
            return true;
        }
    }
};
