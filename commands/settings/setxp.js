const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Level } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setxp')
        .setDescription('دانانی ئێکسپی ئەندام')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('بڕی ئێکسپی').setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        try {
            let levelData = await Level.findOne({ guildId: interaction.guild.id, userId: user.id });
            if (!levelData) levelData = new Level({ guildId: interaction.guild.id, userId: user.id });
            levelData.xp = amount;
            levelData.totalXp = amount;
            await levelData.save();
            return interaction.reply({ content: `✅ ئێکسپی **${user.tag}** دانرا بۆ **${amount}**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵە.', ephemeral: true });
        }
    }
};
