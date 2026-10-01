const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('لینکی بانگهێشتی بۆت'),
    async execute(interaction) {
        const client = interaction.client;
        const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
        return interaction.reply(`🔗 لینکی بانگهێشتی بۆت:\n${link}`);
    },
};
