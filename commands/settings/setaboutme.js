const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setaboutme')
        .setDescription('دانانی دەربارەی من بۆ پرۆفایل')
        .addStringOption(option => option.setName('text').setDescription('دەقی دەربارەی من').setRequired(true)),
    async execute(interaction, client, config) {
        const text = interaction.options.getString('text');
        try {
            let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!userData) userData = new User({ userId: interaction.user.id, guildId: interaction.guild.id });
            userData.aboutMe = text;
            await userData.save();
            return interaction.reply({ content: `✅ دەربارەی منت نۆژەنکردەوە.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵە.', ephemeral: true });
        }
    }
};
