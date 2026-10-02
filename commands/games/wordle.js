const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wordle')
        .setDescription('🎯 یاری وشەسازی'),

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
        if (!settings.games?.enabled || !settings.games?.wordle) {
            return interaction.reply({
                content: '❌ یاری وشەسازی لەم سێرڤەرەدا چالاک نییە.',
                ephemeral: true
            });
        }

        if (settings.games?.channelId && interaction.channel.id !== settings.games.channelId) {
            return interaction.reply({
                content: `❌ تکایە ئەم فەرمانە لە چانێلی <#${settings.games.channelId}> بەکاربهێنە.`,
                ephemeral: true
            });
        }

        // ==================== وشەکان ====================
        const words = [
            'کوردستان', 'بەغدا', 'هەولێر', 'سلێمانی', 'دهۆک',
            'کەرکووک', 'زاخۆ', 'ئاکرێ', 'ڕانیە', 'دووکان',
            'هەڵەبجە', 'پێنجوێن', 'چەمچەماڵ', 'کەلار', 'خانەقین',
            'سەیدسادق', 'دەربەندیخان', 'قەڵادزێ', 'مەرگەسۆر', 'شەقڵاوە'
        ];

        const word = words[Math.floor(Math.random() * words.length)];
        const wordLength = word.length;

        // ==================== ناردنی پەیامی سەرەتا ====================
        await interaction.reply({
            content:
                `🎮 **یاری وشەسازی**\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `> وشەیەکی **${wordLength}** پیتیت هەیە.\n` +
                `> تەنیا **${wordLength}** هەوڵت هەیە.\n\n` +
                `**وشەکە بنووسە:**\n` +
                `━━━━━━━━━━━━━━━━━━`
        });

        const filter = response =>
            response.author.id === interaction.user.id &&
            response.content.length === wordLength;

        for (let i = 0; i < wordLength; i++) {
            try {
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
                const guess = collected.first().content;
                let result = '';

                for (let j = 0; j < wordLength; j++) {
                    if (guess[j] === word[j]) result += '🟩';
                    else if (word.includes(guess[j])) result += '🟨';
                    else result += '⬛';
                }

                await interaction.followUp(result);

                if (guess === word) {
                    await interaction.followUp(
                        `🎉 **ئافەرین!**\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `> وشەکە **${word}** بوو.\n` +
                        `━━━━━━━━━━━━━━━━━━`
                    );
                    return;
                }
            } catch {
                await interaction.followUp(
                    `⏰ **کاتی تەواو بوو!**\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `> وشەکە **${word}** بوو.\n` +
                    `━━━━━━━━━━━━━━━━━━`
                );
                return;
            }
        }

        await interaction.followUp(
            `😢 **هەوڵەکانت تەواو بوون!**\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `> وشەکە **${word}** بوو.\n` +
            `━━━━━━━━━━━━━━━━━━`
        );
    }
};
