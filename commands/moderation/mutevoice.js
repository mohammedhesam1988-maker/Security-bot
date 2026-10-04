const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mutevoice')
        .setDescription('بێدەنگکردنی دەنگی ئەندامێک')
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('ئەو بەکارهێنەرەی کە دەتەوێت بێدەنگی بکەیت')
                .setRequired(true)),
    async execute(interaction, client, config) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        try {
            if (!member.voice.channel) {
                return interaction.reply({ content: '❌ ئەم ئەندامە لە چانێلی دەنگیدا نییە.', ephemeral: true });
            }
            await member.voice.setMute(true);
            return interaction.reply({ content: `✅ **${user.tag}** لە دەنگ بێدەنگکرا.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ ناتوانم ئەندامەکە بێدەنگ بکەم.', ephemeral: true });
        }
    }
};
