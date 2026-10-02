const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('🪨 یاری بەرد، مەقەست، مەقام')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('هەڵبژاردنەکەت دیاری بکە')
                .setRequired(true)
                .addChoices(
                    { name: '🪨 بەرد', value: 'بەرد' },
                    { name: '✂️ مەقەست', value: 'مەقەست' },
                    { name: '📄 مەقام', value: 'مەقام' }
                )),

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
        if (!settings.games?.enabled) {
            return interaction.reply({
                content: '❌ یارییەکان لەم سێرڤەرەدا چالاک نین.',
                ephemeral: true
            });
        }

        if (settings.games?.channelId && interaction.channel.id !== settings.games.channelId) {
            return interaction.reply({
                content: `❌ تکایە ئەم فەرمانە لە چانێلی <#${settings.games.channelId}> بەکاربهێنە.`,
                ephemeral: true
            });
        }

        // ==================== یاری ====================
        const userChoice = interaction.options.getString('choice');
        const choices = ['بەرد', 'مەقەست', 'مەقام'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        // دیاریکردنی ئەنجام
        let result = '';

        if (userChoice === botChoice) {
            result = '🤝 **یەکسان!**';
        } else if (
            (userChoice === 'بەرد' && botChoice === 'مەقام') ||
            (userChoice === 'مەقەست' && botChoice === 'بەرد') ||
            (userChoice === 'مەقام' && botChoice === 'مەقەست')
        ) {
            result = '🏆 **تۆ براوە بووی!** 🎉';
        } else {
            result = '🤖 **بۆت براوە بوو!**';
        }

        // ==================== ناردنی ئەنجام ====================
        await interaction.reply({
            content:
                `**🎮 یاری RPS**\n\n` +
                `> **تۆ:** ${userChoice}\n` +
                `> **بۆت:** ${botChoice}\n\n` +
                `${result}`
        });
    }
};
