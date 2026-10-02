const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📖 لیستی هەموو فەرمانەکان'),

    async execute(interaction) {
        // ==================== دروستکردنی Embed ====================
        const embed = new EmbedBuilder()
            .setTitle('📖 لیستی فەرمانەکان')
            .setDescription('لێرەدا لیستی هەموو فەرمانەکان دەبینیت کە بۆتەکە پشتگیریان دەکات.')
            .setColor('#FFD700')
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' })
            .setTimestamp();

        // ==================== 🎮 یارییەکان ====================
        embed.addFields({
            name: '🎮 یارییەکان',
            value:
                '> `/trivia` — یاری پرسیار و وەڵام\n' +
                '> `/rps` — بەرد، مەقەست، مەقام\n' +
                '> `/wouldyourather` — کامەیانت پێ باشترە\n' +
                '> `/truthordare` — ڕاستی یان ئازار\n' +
                '> `/wordle` — یاری وشەسازی',
            inline: false
        });

        // ==================== 🛡️ سەرپەرشتیکردن ====================
        embed.addFields({
            name: '🛡️ سەرپەرشتیکردن',
            value:
                '> `/warn` — ئاگادارکردنەوەی ئەندام\n' +
                '> `/warnings` — بینینی ئاگادارییەکان\n' +
                '> `/clearwarnings` — سڕینەوەی ئاگادارییەکان',
            inline: false
        });

        // ==================== 🔨 مۆدێرەیشن ====================
        embed.addFields({
            name: '🔨 مۆدێرەیشن',
            value:
                '> `/ban` — قەدەغەکردنی ئەندام\n' +
                '> `/softban` — قەدەغەکردنی نەرم\n' +
                '> `/unban` — لابردنی قەدەغە\n' +
                '> `/kick` — دەرکردنی ئەندام\n' +
                '> `/mute` — بێدەنگکردنی ئەندام\n' +
                '> `/unmute` — کردنەوەی دەنگی ئەندام\n' +
                '> `/clear` — سڕینەوەی پەیامەکان',
            inline: false
        });

        // ==================== 🔒 ئاسایش ====================
        embed.addFields({
            name: '🔒 ئاسایش',
            value:
                '> `/lock` — داخستنی چانێل\n' +
                '> `/unlock` — کردنەوەی چانێل\n' +
                '> `/lockall` — داخستنی هەموو چانێلەکان\n' +
                '> `/unlockall` — کردنەوەی هەموو چانێلەکان\n' +
                '> `/enable` — چالاککردنی سیستەم\n' +
                '> `/disable` — ناچالاککردنی سیستەم\n' +
                '> `/settings` — ڕێکخستنەکان\n' +
                '> `/setlimit` — دانانی سنوور\n' +
                '> `/setpunishment` — دانانی سزا\n' +
                '> `/setmuterole` — دانانی ڕۆڵی بێدەنگی\n' +
                '> `/scan` — پشکنینی سێرڤەر',
            inline: false
        });

        // ==================== 📋 لیستی سپی ====================
        embed.addFields({
            name: '📋 لیستی سپی',
            value:
                '> `/whitelist_add_user` — زیادکردنی بەکارهێنەر\n' +
                '> `/whitelist_remove_user` — لابردنی بەکارهێنەر\n' +
                '> `/whitelist_add_role` — زیادکردنی ڕۆڵ\n' +
                '> `/whitelist_remove_role` — لابردنی ڕۆڵ\n' +
                '> `/whitelist_add_channel` — زیادکردنی چانێل\n' +
                '> `/whitelist_remove_channel` — لابردنی چانێل\n' +
                '> `/whitelist_view_users` — بینینی بەکارهێنەران\n' +
                '> `/whitelist_view_roles` — بینینی ڕۆڵەکان\n' +
                '> `/whitelist_view_channels` — بینینی چانێلەکان',
            inline: false
        });

        // ==================== 🔐 پشتڕاستکردنەوە ====================
        embed.addFields({
            name: '🔐 پشتڕاستکردنەوە',
            value:
                '> `/verify` — پشتڕاستکردنەوەی بەکارهێنەر\n' +
                '> `/verification_enable` — چالاککردنی پشتڕاستکردنەوە\n' +
                '> `/verification_disable` — ناچالاککردنی پشتڕاستکردنەوە\n' +
                '> `/verification_reset` — ڕێستکردنی پشتڕاستکردنەوە\n' +
                '> `/verification_type` — جۆری پشتڕاستکردنەوە\n' +
                '> `/verification_verify` — پشتڕاستکردنەوە\n' +
                '> `/verification_setup_channel` — ڕێکخستنی چانێل\n' +
                '> `/verification_setup_role` — ڕێکخستنی ڕۆڵ',
            inline: false
        });

        // ==================== 📊 ڕێکخستن ====================
        embed.addFields({
            name: '📊 ڕێکخستن',
            value:
                '> `/permission_add` — زیادکردنی دەسەڵات\n' +
                '> `/permission_remove` — لابردنی دەسەڵات\n' +
                '> `/permission_reset` — ڕێستکردنی دەسەڵات\n' +
                '> `/permission_reset_id` — ڕێستکردن بە ئایدی\n' +
                '> `/permission_view_user` — بینینی دەسەڵاتی بەکارهێنەر\n' +
                '> `/permission_view_permission` — بینینی دەسەڵاتەکان',
            inline: false
        });

        // ==================== 📝 لۆگ ====================
        embed.addFields({
            name: '📝 لۆگ',
            value:
                '> `/logs_mod` — لۆگی مۆدێرەیشن\n' +
                '> `/logs_security` — لۆگی ئاسایش',
            inline: false
        });

        // ==================== 🎫 پشتگیری ====================
        embed.addFields({
            name: '🎫 پشتگیری',
            value:
                '> `/ticket` — دروستکردنی تیکت\n' +
                '> `/close` — داخستنی تیکت',
            inline: false
        });

        // ==================== 📢 ڕاگەیاندن و خەڵات ====================
        embed.addFields({
            name: '📢 ڕاگەیاندن و خەڵات',
            value:
                '> `/announce` — ناردنی ڕاگەیاندن\n' +
                '> `/giveaway` — دەستپێکردنی خەڵاتکردن\n' +
                '> `/gend` — کۆتاییپێهێنانی خەڵاتکردن',
            inline: false
        });

        // ==================== 🎨 ڕۆڵەکان ====================
        embed.addFields({
            name: '🎨 ڕۆڵەکان',
            value:
                '> `/colorrole` — هەڵبژاردنی ڕەنگ\n' +
                '> `/reactionrole` — ڕۆڵی کاردانەوە',
            inline: false
        });

        // ==================== 🔧 ئامرازەکان ====================
        embed.addFields({
            name: '🔧 ئامرازەکان',
            value:
                '> `/help` — لیستی فەرمانەکان\n' +
                '> `/invite` — بانگهێشتی بۆت\n' +
                '> `/server` — زانیاری سێرڤەر\n' +
                '> `/user` — زانیاری بەکارهێنەر\n' +
                '> `/about` — دەربارەی بۆت',
            inline: false
        });

        // ==================== ناردنی ئەنجام ====================
        await interaction.reply({ embeds: [embed] });
    }
};
