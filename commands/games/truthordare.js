const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truthordare')
        .setDescription('🎭 یاری ڕاستی یان ئازار'),

    async execute(interaction) {
        // ==================== ڕێکخستنەکان ====================
        let settings = await Settings.findOne({ guildId: interaction.guild.id });
        if (!settings) {
            settings = await Settings.create({
                guildId: interaction.guild.id,
                games: {
                    enabled: true,
                    channelId: null,
                    trivia: true,
                    wordle: true,
                    truthordare: true,
                    wouldyourather: true,
                    showCorrectAnswer: true,
                    showWrongAnswer: true
                }
            });
        }

        // ==================== پشکنینەکان ====================
        if (!settings.games?.enabled || !settings.games?.truthordare) {
            return interaction.reply({
                content: '❌ یاری ڕاستی یان ئازار لەم سێرڤەرەدا چالاک نییە.',
                ephemeral: true
            });
        }

        if (settings.games?.channelId && interaction.channel.id !== settings.games.channelId) {
            return interaction.reply({
                content: `❌ تکایە ئەم فەرمانە لە چانێلی <#${settings.games.channelId}> بەکاربهێنە.`,
                ephemeral: true
            });
        }

        // ==================== پرسیارەکانی ڕاستی ====================
        const truths = [
            'گەورەترین ترسەکەت چییە؟',
            'دوایین جار کەی درۆت کردووە و بۆچی؟',
            'ناخۆشترین شت کە کردووتە چییە؟',
            'کێ لەم سێرڤەرەدا زۆرترین حەزت لێیە؟',
            'نەفرەتترین خواردن چییە؟',
            'گەورەترین خەونەکەت چییە؟',
            'شەرمەزارترین یادەوەریت چییە؟',
            'دوایین جار کەی گریاوی و بۆچی؟',
            'کێ لە خێزانەکەت زۆرترین حەزت لێیە؟',
            'ئەگەر بیتوانیایە یەک شت بگۆڕیت لە ژیانتدا، چی دەبوو؟',
            'گەورەترین نهێنییەکەت چییە؟',
            'کێ لە هاوڕێکانت زۆرترین متمانەت پێی هەیە؟',
            'دوایین جار کەی دڵت شکاوە؟',
            'ئەگەر بیتوانیایە یەک کەس ببینیت، کێ دەبوو؟',
            'گەورەترین خەمۆکییەکەت چییە؟'
        ];

        // ==================== ئازارەکان ====================
        const dares = [
            'بۆ ماوەی ١٠ چرکە بە دەنگی بەرز بخەنە.',
            'وێنەیەکی خۆت بنێرە بۆ چانێلەکە.',
            'بۆ ماوەی ٥ خولەک تەنیا بە ئینگلیزی قسە بکە.',
            'بۆ چانێلی گشتی پەیامێکی خۆشەویستی بنێرە.',
            'ناوی خۆشەویستەکەت بنووسە.',
            'بۆ ماوەی ٣٠ چرکە بە سەر خۆتدا بچۆ.',
            'پەیامێک بۆ کەسێک بنێرە کە زۆر حەزت لێی نییە.',
            'بۆ ماوەی ٢ خولەک بە شێوەی منداڵ قسە بکە.',
            'ناوی دوایین کەس بنووسە کە پەیامێکی بۆ ناردویت.',
            'بۆ ماوەی ١ خولەک بە شێوەی ڕۆبۆت قسە بکە.',
            'بۆ ماوەی ١ خولەک بە شێوەی پیرەمێرد قسە بکە.',
            'ناوی کەسێک بنووسە کە زۆر حەزت لێی نییە.',
            'بۆ ماوەی ٣٠ چرکە بە شێوەی منداڵی ساوا قسە بکە.',
            'پەیامێکی خۆشەویستی بۆ دایکت بنێرە.',
            'بۆ ماوەی ١ خولەک تەنیا بە ئیمۆجی قسە بکە.'
        ];

        // ==================== هەڵبژاردن ====================
        const choice = Math.random() < 0.5 ? 'truth' : 'dare';

        if (choice === 'truth') {
            const truth = truths[Math.floor(Math.random() * truths.length)];
            await interaction.reply({
                content:
                    `🤔 **ڕاستی**\n` +
                    `━━━━━━━━━━━━━━━━━━\n\n` +
                    `> ${truth}\n\n` +
                    `━━━━━━━━━━━━━━━━━━`
            });
        } else {
            const dare = dares[Math.floor(Math.random() * dares.length)];
            await interaction.reply({
                content:
                    `😈 **ئازار**\n` +
                    `━━━━━━━━━━━━━━━━━━\n\n` +
                    `> ${dare}\n\n` +
                    `━━━━━━━━━━━━━━━━━━`
            });
        }
    }
};
