const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('کردنەوەی کەناڵ')
        .addChannelOption(o => o.setName('channel').setDescription('کەناڵ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });
        return interaction.reply(`🔓 ${channel} کرایەوە.`);
    },
};
