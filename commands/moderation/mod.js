const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Warning, Action } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('سیستەمی بەڕێوەبردنی ئەندامان')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

        // ================= BAN =================
        .addSubcommand(sub =>
            sub.setName('ban')
                .setDescription('قەدەغەکردنی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(false))
                .addIntegerOption(opt => opt.setName('days').setDescription('سڕینەوەی نامەکان بۆ چەند ڕۆژ (0-7)').setRequired(false).setMinValue(0).setMaxValue(7)))

        // ================= KICK =================
        .addSubcommand(sub =>
            sub.setName('kick')
                .setDescription('دەرکردنی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(false)))

        // ================= MUTE =================
        .addSubcommand(sub =>
            sub.setName('mute')
                .setDescription('بێدەنگکردنی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('ماوە بە خولەک').setRequired(true).setMinValue(1).setMaxValue(40320))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(false)))

        // ================= UNMUTE =================
        .addSubcommand(sub =>
            sub.setName('unmute')
                .setDescription('کردنەوەی دەنگی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true)))

        // ================= WARN =================
        .addSubcommand(sub =>
            sub.setName('warn')
                .setDescription('ئاگادارکردنەوەی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(true)))

        // ================= WARNINGS =================
        .addSubcommand(sub =>
            sub.setName('warnings')
                .setDescription('بینینی ئاگادارکردنەوەکانی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true)))

        // ================= CLEAR WARNINGS =================
        .addSubcommand(sub =>
            sub.setName('clearwarnings')
                .setDescription('سڕینەوەی ئاگادارکردنەوەکانی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true)))

        // ================= SOFTBAN =================
        .addSubcommand(sub =>
            sub.setName('softban')
                .setDescription('بانی نەرم (کیک + سڕینەوەی نامەکان)')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(false)))

        // ================= UNBAN =================
        .addSubcommand(sub =>
            sub.setName('unban')
                .setDescription('کردنەوەی قەدەغەی ئەندامێک')
                .addStringOption(opt => opt.setName('userid').setDescription('ID ئەندام').setRequired(true)))

        // ================= MUTETEXT =================
        .addSubcommand(sub =>
            sub.setName('mutetext')
                .setDescription('بێدەنگکردنی دەقی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('ماوە بە خولەک').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('هۆکار').setRequired(false)))

        // ================= MUTEVOICE =================
        .addSubcommand(sub =>
            sub.setName('mutevoice')
                .setDescription('بێدەنگکردنی دەنگی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true)))

        // ================= UNMUTEVOICE =================
        .addSubcommand(sub =>
            sub.setName('unmutevoice')
                .setDescription('کردنەوەی دەنگی ئەندامێک')
                .addUserOption(opt => opt.setName('user').setDescription('ئەندام').setRequired(true)))

        // ================= PRUNE =================
        .addSubcommand(sub =>
            sub.setName('prune')
                .setDescription('سڕینەوەی نامەکان')
                .addIntegerOption(opt => opt.setName('amount').setDescription('ژمارەی نامەکان (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)))

        // ================= SLOWMODE =================
        .addSubcommand(sub =>
            sub.setName('slowmode')
                .setDescription('دانانی slowmode لە چانێل')
                .addIntegerOption(opt => opt.setName('seconds').setDescription('چرکە (0-21600)').setRequired(true).setMinValue(0).setMaxValue(21600)))

        // ================= LOCK =================
        .addSubcommand(sub =>
            sub.setName('lock')
                .setDescription('داخستنی چانێل')
                .addChannelOption(opt => opt.setName('channel').setDescription('چانێل').setRequired(false)))

        // ================= UNLOCK =================
        .addSubcommand(sub =>
            sub.setName('unlock')
                .setDescription('کردنەوەی چانێل')
                .addChannelOption(opt => opt.setName('channel').setDescription('چانێل').setRequired(false))),

    async execute(interaction, client, config) {
        const sub = interaction.options.getSubcommand();
        const guild = interaction.guild;
        const moderator = interaction.user;

        try {
            // ================= BAN =================
            if (sub === 'ban') {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
                const days = interaction.options.getInteger('days') || 0;
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.bannable) return interaction.reply({ content: '❌ ناتوانم ئەم ئەندامە قەدەغە بکەم.', ephemeral: true });
                if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                    return interaction.reply({ content: '❌ ناتوانم ئەندامێک بە ڕۆڵی بەرزتر قەدەغە بکەم.', ephemeral: true });
                }

                await member.ban({ reason, deleteMessageSeconds: days * 86400 });
                await this.logAction(guild, config, 'ban', moderator, user, reason);
                return interaction.reply({ content: `✅ **${user.tag}** قەدەغە کرا.\n📝 هۆکار: ${reason}`, ephemeral: true });
            }

            // ================= KICK =================
            if (sub === 'kick') {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.kickable) return interaction.reply({ content: '❌ ناتوانم ئەم ئەندامە دەربکەم.', ephemeral: true });
                if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                    return interaction.reply({ content: '❌ ناتوانم ئەندامێک بە ڕۆڵی بەرزتر دەربکەم.', ephemeral: true });
                }

                await member.kick(reason);
                await this.logAction(guild, config, 'kick', moderator, user, reason);
                return interaction.reply({ content: `✅ **${user.tag}** دەرکرا.\n📝 هۆکار: ${reason}`, ephemeral: true });
            }

            // ================= MUTE =================
            if (sub === 'mute') {
                const user = interaction.options.getUser('user');
                const duration = interaction.options.getInteger('duration');
                const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.moderatable) return interaction.reply({ content: '❌ ناتوانم ئەم ئەندامە بێدەنگ بکەم.', ephemeral: true });

                await member.timeout(duration * 60 * 1000, reason);
                await this.logAction(guild, config, 'mute', moderator, user, reason, duration);
                return interaction.reply({ content: `✅ **${user.tag}** بێدەنگکرا بۆ ${duration} خولەک.\n📝 هۆکار: ${reason}`, ephemeral: true });
            }

            // ================= UNMUTE =================
            if (sub === 'unmute') {
                const user = interaction.options.getUser('user');
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                await member.timeout(null);
                return interaction.reply({ content: `✅ دەنگی **${user.tag}** کرایەوە.`, ephemeral: true });
            }

            // ================= WARN =================
            if (sub === 'warn') {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason');

                const warning = new Warning({
                    guildId: guild.id,
                    userId: user.id,
                    moderatorId: moderator.id,
                    reason: reason
                });
                await warning.save();

                const warnings = await Warning.find({ guildId: guild.id, userId: user.id });
                const warningCount = warnings.length;

                // ئاگادارکردنەوەی ئەندام
                if (config.warns.dmOnWarn) {
                    await user.send(`⚠️ تۆ ئاگادارکرایتەوە لە **${guild.name}**\n📝 هۆکار: ${reason}\n📊 کۆی ئاگادارکردنەوەکان: ${warningCount}`).catch(() => {});
                }

                // چێککردنی سزای خۆکار
                if (config.warns.autoPunish && warningCount >= config.warns.maxWarns) {
                    const punishment = config.warns.punishment;
                    const member = await guild.members.fetch(user.id).catch(() => null);

                    if (member && punishment === 'timeout') {
                        await member.timeout(10 * 60 * 1000, 'Auto-punish: Max warnings reached');
                    } else if (member && punishment === 'kick') {
                        await member.kick('Auto-punish: Max warnings reached');
                    } else if (member && punishment === 'ban') {
                        await member.ban({ reason: 'Auto-punish: Max warnings reached' });
                    }
                }

                await this.logAction(guild, config, 'warn', moderator, user, reason);
                return interaction.reply({ content: `✅ **${user.tag}** ئاگادارکرایەوە.\n📝 هۆکار: ${reason}\n📊 کۆی ئاگادارکردنەوەکان: ${warningCount}`, ephemeral: true });
            }

            // ================= WARNINGS =================
            if (sub === 'warnings') {
                const user = interaction.options.getUser('user');
                const warnings = await Warning.find({ guildId: guild.id, userId: user.id });

                if (warnings.length === 0) {
                    return interaction.reply({ content: `❌ **${user.tag}** هیچ ئاگادارکردنەوەیەکی نییە.`, ephemeral: true });
                }

                const list = warnings.map((w, i) => `**${i + 1}.** ${w.reason}\n> لەلایەن: <@${w.moderatorId}>\n> کات: <t:${Math.floor(w.timestamp.getTime() / 1000)}:R>`).join('\n\n');

                const embed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(`⚠️ ئاگادارکردنەوەکانی ${user.tag}`)
                    .setDescription(list)
                    .setFooter({ text: `کۆی گشتی: ${warnings.length}` })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // ================= CLEAR WARNINGS =================
            if (sub === 'clearwarnings') {
                const user = interaction.options.getUser('user');
                const result = await Warning.deleteMany({ guildId: guild.id, userId: user.id });

                if (result.deletedCount === 0) {
                    return interaction.reply({ content: `❌ **${user.tag}** هیچ ئاگادارکردنەوەیەکی نییە.`, ephemeral: true });
                }

                return interaction.reply({ content: `✅ هەموو ئاگادارکردنەوەکانی **${user.tag}** سڕدرانەوە.`, ephemeral: true });
            }

            // ================= SOFTBAN =================
            if (sub === 'softban') {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.bannable) return interaction.reply({ content: '❌ ناتوانم ئەم ئەندامە بانی نەرم بکەم.', ephemeral: true });

                await member.ban({ reason, deleteMessageSeconds: 604800 });
                await guild.members.unban(user.id, 'Softban');
                await this.logAction(guild, config, 'softban', moderator, user, reason);
                return interaction.reply({ content: `✅ **${user.tag}** بانی نەرم کرا.\n📝 هۆکار: ${reason}`, ephemeral: true });
            }

            // ================= UNBAN =================
            if (sub === 'unban') {
                const userId = interaction.options.getString('userid');
                try {
                    const user = await client.users.fetch(userId);
                    await guild.members.unban(userId);
                    await this.logAction(guild, config, 'unban', moderator, user, 'Unbanned');
                    return interaction.reply({ content: `✅ **${user.tag}** لە قەدەغە دەرکرا.`, ephemeral: true });
                } catch (error) {
                    return interaction.reply({ content: '❌ ئەم IDـە لە قەدەغەدا نییە یان هەڵەیە.', ephemeral: true });
                }
            }

            // ================= MUTETEXT =================
            if (sub === 'mutetext') {
                const user = interaction.options.getUser('user');
                const duration = interaction.options.getInteger('duration');
                const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەدراوە';
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                await member.timeout(duration * 60 * 1000, reason);
                return interaction.reply({ content: `✅ **${user.tag}** بێدەنگکرا لە دەق بۆ ${duration} خولەک.\n📝 هۆکار: ${reason}`, ephemeral: true });
            }

            // ================= MUTEVOICE =================
            if (sub === 'mutevoice') {
                const user = interaction.options.getUser('user');
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.voice.channel) return interaction.reply({ content: '❌ ئەم ئەندامە لە چانێلی دەنگیدا نییە.', ephemeral: true });

                await member.voice.setMute(true);
                return interaction.reply({ content: `✅ **${user.tag}** لە دەنگ بێدەنگکرا.`, ephemeral: true });
            }

            // ================= UNMUTEVOICE =================
            if (sub === 'unmutevoice') {
                const user = interaction.options.getUser('user');
                const member = await guild.members.fetch(user.id).catch(() => null);

                if (!member) return interaction.reply({ content: '❌ ئەم ئەندامە نەدۆزرایەوە.', ephemeral: true });
                if (!member.voice.channel) return interaction.reply({ content: '❌ ئەم ئەندامە لە چانێلی دەنگیدا نییە.', ephemeral: true });

                await member.voice.setMute(false);
                return interaction.reply({ content: `✅ دەنگی **${user.tag}** کرایەوە.`, ephemeral: true });
            }

            // ================= PRUNE =================
            if (sub === 'prune') {
                const amount = interaction.options.getInteger('amount');
                const messages = await interaction.channel.bulkDelete(amount, true);
                return interaction.reply({ content: `✅ **${messages.size}** نامە سڕدرانەوە.`, ephemeral: true });
            }

            // ================= SLOWMODE =================
            if (sub === 'slowmode') {
                const seconds = interaction.options.getInteger('seconds');
                await interaction.channel.setRateLimitPerUser(seconds);
                return interaction.reply({ content: `✅ Slowmode دانرا بۆ **${seconds}** چرکە.`, ephemeral: true });
            }

            // ================= LOCK =================
            if (sub === 'lock') {
                const channel = interaction.options.getChannel('channel') || interaction.channel;
                await channel.permissionOverwrites.edit(guild.id, { SendMessages: false });
                return interaction.reply({ content: `✅ چانێلی **${channel.name}** داخرا.`, ephemeral: true });
            }

            // ================= UNLOCK =================
            if (sub === 'unlock') {
                const channel = interaction.options.getChannel('channel') || interaction.channel;
                await channel.permissionOverwrites.edit(guild.id, { SendMessages: null });
                return interaction.reply({ content: `✅ چانێلی **${channel.name}** کرایەوە.`, ephemeral: true });
            }

        } catch (error) {
            console.error('Mod Command Error:', error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا لە کاتی جێبەجێکردنی فەرمانەکە.', ephemeral: true });
        }
    },

    // ================= تۆمارکردنی لۆگ =================
    async logAction(guild, config, action, moderator, target, reason, duration = null) {
        try {
            if (!config.logChannels || !config.logChannels.moderation) return;
            const logChannel = guild.channels.cache.get(config.logChannels.moderation);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle(`🔨 ${action.toUpperCase()}`)
                .addFields(
                    { name: 'بەڕێوەبەر', value: `${moderator.tag} (${moderator.id})`, inline: true },
                    { name: 'ئامانج', value: `${target.tag} (${target.id})`, inline: true },
                    { name: 'هۆکار', value: reason, inline: false }
                )
                .setTimestamp();

            if (duration) embed.addFields({ name: 'ماوە', value: `${duration} خولەک`, inline: true });

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Log Action Error:', error);
        }
    }
};
