const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('تایم ئاوتی ئەندامێک')
        .addUserOption(o => o.setName('user').setDescription('بەکارهێنەر').setRequired(true))
        .addIntegerOption(o => o.setName('minutes').setDescription('خولەک').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const minutes = interaction.options.getInteger('minutes');
        const member = await interaction.guild.members.fetch(user.id);
        await member.timeout(minutes * 60 * 1000);
        return interaction.reply(`🔇 ${user.tag} تایم ئاوت کرا.`);
    },
};
