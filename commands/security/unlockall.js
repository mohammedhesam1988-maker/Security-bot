const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlockall')
        .setDescription('کردنەوەی هەموو کەناڵەکان')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channels = interaction.guild.channels.cache.filter(c => c.type === 0);
        for (const [id, channel] of channels) {
            await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).catch(() => {});
        }
        return interaction.reply(`🔓 ${channels.size} کەناڵ کرایەوە.`);
    },
};
