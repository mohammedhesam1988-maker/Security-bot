const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('بانی نەرم (کیک + سڕینەوەی نامەکان)')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('هۆکار'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ';
        const member = await interaction.guild.members.fetch(user.id);
        await member.ban({ reason, deleteMessageSeconds: 604800 });
        await interaction.guild.members.unban(user.id);
        return interaction.reply(`🧹 ${user.tag} سۆفتبان کرا.`);
    },
};
