const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('ڕێپۆتەیشن بە کەسێک بدە')
        .addUserOption(option => option.setName('user').setDescription('ئەو بەکارهێنەرەی کە دەتەوێت ڕێپۆتەیشنی پێ بدەیت').setRequired(true)),
    async execute(interaction, client, config) {
        const targetUser = interaction.options.getUser('user');
        const guildId = interaction.guild.id;
        if (targetUser.id === interaction.user.id) return interaction.reply({ content: '❌ ناتوانیت بە خۆت بدەیت.', ephemeral: true });
        if (targetUser.bot) return interaction.reply({ content: '❌ ناتوانیت بە بۆت بدەیت.', ephemeral: true });
        try {
            let targetData = await User.findOne({ userId: targetUser.id, guildId });
            if (!targetData) targetData = new User({ userId: targetUser.id, guildId });
            targetData.rep += 1;
            await targetData.save();
            return interaction.reply({ content: `✅ تۆ **1** ڕێپۆتەیشنت بە **${targetUser.tag}** دا.` });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
