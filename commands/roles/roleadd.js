const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleadd')
        .setDescription('زیادکردنی ڕۆڵ بۆ بەکارهێنەرێکی دیاریکراو')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('ڕۆڵ').setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = await interaction.guild.members.fetch(user.id);
        try {
            await member.roles.add(role);
            return interaction.reply({ content: `✅ ڕۆڵی **${role.name}** درا بە **${user.tag}**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ڕۆڵەکە بدەم.', ephemeral: true });
        }
    }
};
