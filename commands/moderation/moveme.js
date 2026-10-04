const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moveme')
        .setDescription('خۆت بگوازەوە بۆ چانێلێکی دەنگی دیاریکراو')
        .addChannelOption(opt =>
            opt.setName('channel')
                .setDescription('ئەو چانێلەی دەنگ کە دەتەوێت بچیتێی')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const channel = interaction.options.getChannel('channel');
        const member = interaction.member;
        try {
            if (!member.voice.channel) {
                return interaction.reply({ content: '❌ تۆ لە هیچ چانێلێکی دەنگیدا نیت.', ephemeral: true });
            }
            await member.voice.setChannel(channel);
            return interaction.reply({ content: `✅ تۆ جوڵێنرایت بۆ **${channel.name}**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم بجوڵێم.', ephemeral: true });
        }
    }
};
