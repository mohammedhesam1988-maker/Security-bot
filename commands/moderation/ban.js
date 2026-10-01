const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('بانکردنی ئەندامێک')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('هۆکار'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ';
        const member = await interaction.guild.members.fetch(user.id);
        if (!member.bannable) return interaction.reply({ content: '❌ ناتوانم.', ephemeral: true });
        await member.ban({ reason });
        return interaction.reply(`🔨 ${user.tag} بانکرا.`);
    },
};
