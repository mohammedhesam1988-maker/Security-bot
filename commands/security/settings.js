const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('بینینی ڕێکخستنەکانی سێرڤەر')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = require('../../config');
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('⚙️ ڕێکخستنەکانی سێرڤەر')
            .addFields(
                { name: 'Anti-Nuke', value: config.antiNuke?.enabled ? '✅' : '❌', inline: true },
                { name: 'Anti-Raid', value: config.antiRaid?.enabled ? '✅' : '❌', inline: true },
                { name: 'Anti-Spam', value: config.antiSpam?.enabled ? '✅' : '❌', inline: true },
                { name: 'Beast Mode', value: config.beastMode?.enabled ? '✅' : '❌', inline: true }
            )
            .setFooter({ text: 'Security Bot • Cold. Precise. Unbreakable.' })
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    },
};
