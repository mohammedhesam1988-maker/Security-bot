const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('لیستی فەرمانەکان ببینە')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('پۆلی فەرمانەکان')
                .setRequired(false)
                .addChoices(
                    { name: '🎮 یارییەکان', value: 'games' },
                    { name: '🛡️ سەرپەرشتیکردن', value: 'moderation' },
                    { name: '🔨 مۆدێرەیشن', value: 'mod' },
                    { name: '🔒 ئاسایش', value: 'security' },
                    { name: '📋 لیستی سپی', value: 'whitelist' },
                    { name: '✅ پشتڕاستکردنەوە', value: 'verification' },
                    { name: '💰 ئابووری', value: 'economy' },
                    { name: '⚙️ ڕێکخستن', value: 'settings' },
                    { name: '🎭 ڕۆڵەکان', value: 'roles' },
                    { name: '🔧 ئامرازەکان', value: 'utility' },
                    { name: '🎁 ڕاگەیاندن و خەڵات', value: 'giveaway' },
                    { name: '📝 لۆگ', value: 'logs' }
                )),

    async execute(interaction, client, config) {
        const category = interaction.options.getString('category');

        const categories = {
            games: {
                title: '🎮 یارییەکان',
                icon: '🎮',
                commands: [
                    { name: '/trivia', desc: 'یاری پرسیار و وەڵام' },
                    { name: '/rps', desc: 'بەرد، مەقەست، مەقام' },
                    { name: '/wouldyourather', desc: 'کامەیانانت پێ باشترە' },
                    { name: '/truthordare', desc: 'ڕاستی یان ئازار' },
                    { name: '/wordle', desc: 'یاری وشەسازی' }
                ]
            },
            moderation: {
                title: '🛡️ سەرپەرشتیکردن',
                icon: '🛡️',
                commands: [
                    { name: '/warn', desc: 'ئاگادارکردنەوەی ئەندام' },
                    { name: '/warnings', desc: 'بینینی ئاگادارییەکان' },
                    { name: '/clearwarnings', desc: 'سڕینەوەی ئاگادارییەکان' }
                ]
            },
            mod: {
                title: '🔨 مۆدێرەیشن',
                icon: '🔨',
                commands: [
                    { name: '/ban', desc: 'قەدەغەکردنی ئەندام' },
                    { name: '/softban', desc: 'قەدەغەکردنی نەرم' },
                    { name: '/unban', desc: 'لابردنی قەدەغە' },
                    { name: '/kick', desc: 'دەرکردنی ئەندام' },
                    { name: '/mute', desc: 'بێدەنگکردنی ئەندام' },
                    { name: '/unmute', desc: 'کردنەوەی دەنگی ئەندام' },
                    { name: '/clear', desc: 'سڕینەوەی پەیامەکان' }
                ]
            },
            security: {
                title: '🔒 ئاسایش',
                icon: '🔒',
                commands: [
                    { name: '/lock', desc: 'داخستنی چانێل' },
                    { name: '/unlock', desc: 'کردنەوەی چانێل' },
                    { name: '/lockall', desc: 'داخستنی هەموو چانێلەکان' },
                    { name: '/unlockall', desc: 'کردنەوەی هەموو چانێلەکان' },
                    { name: '/enable', desc: 'چالاککردنی سیستەم' },
                    { name: '/disable', desc: 'ناچالاککردنی سیستەم' },
                    { name: '/settings', desc: 'ڕێکخستنەکان' },
                    { name: '/setlimit', desc: 'دانانی سنوور' },
                    { name: '/setpunishment', desc: 'دانانی سزا' },
                    { name: '/setmuterole', desc: 'دانانی ڕۆڵی بێدەنگی' },
                    { name: '/scan', desc: 'پشکنینی سێرڤەر' }
                ]
            },
            whitelist: {
                title: '📋 لیستی سپی',
                icon: '📋',
                commands: [
                    { name: '/whitelist_add_user', desc: 'زیادکردنی بەکارهێنەر' },
                    { name: '/whitelist_remove_user', desc: 'لابردنی بەکارهێنەر' },
                    { name: '/whitelist_add_role', desc: 'زیادکردنی ڕۆڵ' },
                    { name: '/whitelist_remove_role', desc: 'لابردنی ڕۆڵ' },
                    { name: '/whitelist_add_channel', desc: 'زیادکردنی چانێل' },
                    { name: '/whitelist_remove_channel', desc: 'لابردنی چانێل' },
                    { name: '/whitelist_view_users', desc: 'بینینی بەکارهێنەران' },
                    { name: '/whitelist_view_roles', desc: 'بینینی ڕۆڵەکان' },
                    { name: '/whitelist_view_channels', desc: 'بینینی چانێلەکان' }
                ]
            },
            verification: {
                title: '✅ پشتڕاستکردنەوە',
                icon: '✅',
                commands: [
                    { name: '/verify', desc: 'پشتڕاستکردنەوەی بەکارهێنەر' },
                    { name: '/verification_enable', desc: 'چالاککردنی پشتڕاستکردنەوە' },
                    { name: '/verification_disable', desc: 'ناچالاککردنی پشتڕاستکردنەوە' },
                    { name: '/verification_reset', desc: 'ڕێستکردنی پشتڕاستکردنەوە' },
                    { name: '/verification_type', desc: 'جۆری پشتڕاستکردنەوە' },
                    { name: '/verification_verify', desc: 'پشتڕاستکردنەوە' },
                    { name: '/verification_setup_channel', desc: 'ڕێکخستنی چانێل' },
                    { name: '/verification_setup_role', desc: 'ڕێکخستنی ڕۆڵ' }
                ]
            },
            economy: {
                title: '💰 ئابووری',
                icon: '💰',
                commands: [
                    { name: '/daily', desc: 'خەڵاتی ڕۆژانە' },
                    { name: '/profile', desc: 'بینینی پرۆفایل' },
                    { name: '/rep', desc: 'پێدانی ڕێپۆتەیشن' },
                    { name: '/rank', desc: 'بینینی ئاست' },
                    { name: '/leaderboard', desc: 'لیستی باشترین ئەندامان' },
                    { name: '/points set', desc: 'دانانی خاڵ' },
                    { name: '/reset server', desc: 'ڕێستکردنی سێرڤەر' },
                    { name: '/reset user', desc: 'ڕێستکردنی بەکارهێنەر' }
                ]
            },
            settings: {
                title: '⚙️ ڕێکخستن',
                icon: '⚙️',
                commands: [
                    { name: '/setxp', desc: 'دانانی ئێکسپی' },
                    { name: '/setlevel', desc: 'دانانی ئاست' },
                    { name: '/setnickname', desc: 'دانانی نازناو' },
                    { name: '/setaboutme', desc: 'دانانی دەربارەی من' },
                    { name: '/setwelcome', desc: 'ڕێکخستنی بەخێرهاتن' },
                    { name: '/setlang', desc: 'دانانی زمان' }
                ]
            },
            roles: {
                title: '🎭 ڕۆڵەکان',
                icon: '🎭',
                commands: [
                    { name: '/roleadd', desc: 'زیادکردنی ڕۆڵ' },
                    { name: '/roleremove', desc: 'لابردنی ڕۆڵ' },
                    { name: '/rar', desc: 'لابردنی هەموو ڕۆڵەکان' },
                    { name: '/roleall', desc: 'دانانی ڕۆڵ بۆ هەمووان' },
                    { name: '/colorrole', desc: 'ڕۆڵی ڕەنگ' },
                    { name: '/reactionrole', desc: 'ڕۆڵی کاردانەوە' }
                ]
            },
            utility: {
                title: '🔧 ئامرازەکان',
                icon: '🔧',
                commands: [
                    { name: '/help', desc: 'لیستی فەرمانەکان' },
                    { name: '/invite', desc: 'بانگهێشتی بۆت' },
                    { name: '/server', desc: 'زانیاری سێرڤەر' },
                    { name: '/user', desc: 'زانیاری بەکارهێنەر' },
                    { name: '/about', desc: 'دەربارەی بۆت' },
                    { name: '/ping', desc: 'خێرایی بۆت' },
                    { name: '/avatar', desc: 'وێنەی پرۆفایل' },
                    { name: '/banner', desc: 'بانەری بەکارهێنەر' },
                    { name: '/color', desc: 'گۆڕینی ڕەنگ' },
                    { name: '/create_invite', desc: 'دروستکردنی لینکی بانگهێشت' },
                    { name: '/commands', desc: 'لیستی کۆماندەکان' },
                    { name: '/debug', desc: 'زانیاری بۆت' },
                    { name: '/addemojis', desc: 'زیادکردنی ئیمۆجی' },
                    { name: '/addstickers', desc: 'زیادکردنی ستیکەر' },
                    { name: '/move', desc: 'جوڵاندنی ئەندام' },
                    { name: '/moveme', desc: 'جوڵاندنی خۆت' },
                    { name: '/mutetext', desc: 'بێدەنگکردنی دەق' },
                    { name: '/mutevoice', desc: 'بێدەنگکردنی دەنگ' },
                    { name: '/report', desc: 'ڕاپۆرتکردن' },
                    { name: '/prison', desc: 'زیندانیکردن' },
                    { name: '/modlist', desc: 'لیستی بەڕێوەبردن' },
                    { name: '/trigger', desc: 'بەڕێوەبردنی ترێگەر' }
                ]
            },
            giveaway: {
                title: '🎁 ڕاگەیاندن و خەڵات',
                icon: '🎁',
                commands: [
                    { name: '/announce', desc: 'ناردنی ڕاگەیاندن' },
                    { name: '/giveaway', desc: 'دەستپێکردنی خەڵاتکردن' },
                    { name: '/gend', desc: 'کۆتاییهێنانی خەڵاتکردن' }
                ]
            },
            logs: {
                title: '📝 لۆگ',
                icon: '📝',
                commands: [
                    { name: '/logs_mod', desc: 'لۆگی مۆدێرەیشن' },
                    { name: '/logs_security', desc: 'لۆگی ئاسایش' }
                ]
            }
        };

        try {
            if (category) {
                const cat = categories[category];
                if (!cat) {
                    return interaction.reply({ content: '❌ ئەم پۆلە نەدۆزرایەوە.', ephemeral: true });
                }

                const commandList = cat.commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n');

                const embed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle(`${cat.icon} ${cat.title}`)
                    .setDescription(commandList || 'هیچ فەرمانێک نییە')
                    .setFooter({ text: `کۆی گشتی: ${cat.commands.length} فەرمان` })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('📜 لیستی فەرمانەکان')
                .setDescription('بۆ بینینی فەرمانەکانی هەر پۆلێک، لە `/help` دا پۆلەکە هەڵبژێرە.\n\n**پۆلەکان:**')
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: `کۆی گشتی: ${client.commands.size} فەرمان` })
                .setTimestamp();

            Object.keys(categories).forEach(key => {
                const cat = categories[key];
                embed.addFields({
                    name: `${cat.icon} ${cat.title}`,
                    value: `\`${cat.commands.length}\` فەرمان — بۆ بینینی: \`/help category:${key}\``,
                    inline: false
                });
            });

            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Help Command Error:', error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا لە کاتی جێبەجێکردنی فەرمانەکە.', ephemeral: true });
        }
    }
};
