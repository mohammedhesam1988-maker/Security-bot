const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription('دانان یان سڕینەوەی نازناو')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .addUserOption(option => option.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addStringOption(option => option.setName('nickname').setDescription('ناوی نوێ (بەتاڵ بهێڵەوە بۆ سڕینەوە)').setRequired(false)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');
        const member = await interaction.guild.members.fetch(user.id);
        try {
            await member.setNickname(nickname);
            if (nickname) return interaction.reply({ content: `✅ نازناوی **${user.tag}** گۆڕدرا بۆ **${nickname}**.`, ephemeral: true });
            else return interaction.reply({ content: `✅ نازناوی **${user.tag}** سڕدرایەوە.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم نازناوەکە بگۆڕم.', ephemeral: true });
        }
    }
};
