const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('دەرکردنی ئەندامێک')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('هۆکار'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ';
        const member = await interaction.guild.members.fetch(user.id);
        if (!member.kickable) return interaction.reply({ content: '❌ ناتوانم.', ephemeral: true });
        await member.kick(reason);
        return interaction.reply(`👢 ${user.tag} دەرکرا.`);
    },
};
