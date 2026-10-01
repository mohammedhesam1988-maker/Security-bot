const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('ناچالاککردنی سیستەمی ئاسایش')
        .addStringOption(o => o.setName('system').setDescription('سیستەم').setRequired(true)
            .addChoices(
                { name: 'Anti-Nuke', value: 'antiNuke' },
                { name: 'Anti-Raid', value: 'antiRaid' },
                { name: 'Anti-Spam', value: 'antiSpam' },
                { name: 'Beast Mode', value: 'beastMode' }
            ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const system = interaction.options.getString('system');
        const config = require('../../config');
        if (config[system]) config[system].enabled = false;
        return interaction.reply(`❌ ${system} ناچالاک کرا.`);
    },
};
