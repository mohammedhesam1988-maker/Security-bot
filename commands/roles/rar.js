const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rar')
        .setDescription('لابردنی هەموو ڕۆڵەکان لە ئەندامێک')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(o => o.setName('user').setDescription('ئەو بەکارهێنەرەی کە دەتەوێت ڕۆڵەکانی لابەریت').setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        try {
            const rolesToRemove = member.roles.cache.filter(r => r.id !== interaction.guild.id);
            await member.roles.remove(rolesToRemove);
            return interaction.reply({ content: `✅ هەموو ڕۆڵەکان لابردران لە **${user.tag}**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ڕۆڵەکان لابەرم.', ephemeral: true });
        }
    }
};
