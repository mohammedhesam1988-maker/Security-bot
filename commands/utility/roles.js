const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Get a list of server roles and member counts.'),
    async execute(interaction, client, config) {
        const roles = interaction.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => `${role} - ${role.members.size} members`)
            .slice(0, 20)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📋 Server Roles')
            .setDescription(roles || 'No roles found.')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
