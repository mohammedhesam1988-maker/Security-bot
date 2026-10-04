const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Level } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevel')
        .setDescription('دانانی ئاستی ئەندام')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addIntegerOption(option => option.setName('level').setDescription('ئاست').setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level');
        try {
            let levelData = await Level.findOne({ guildId: interaction.guild.id, userId: user.id });
            if (!levelData) levelData = new Level({ guildId: interaction.guild.id, userId: user.id });
            levelData.level = level;
            await levelData.save();
            return interaction.reply({ content: `✅ ئاستی **${user.tag}** دانرا بۆ **${level}**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵە.', ephemeral: true });
        }
    }
};
