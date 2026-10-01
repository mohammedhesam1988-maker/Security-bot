const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('لابردنی تایم ئاوت')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        await member.timeout(null);
        return interaction.reply(`🔊 تایم ئاوتی ${user.tag} لابرا.`);
    },
};
