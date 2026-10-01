const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlimit')
        .setDescription('گۆڕینی سنووری کردارێک')
        .addStringOption(o => o.setName('action').setDescription('کردار').setRequired(true)
            .addChoices(
                { name: 'Anti Ban', value: 'ban' },
                { name: 'Anti Kick', value: 'kick' },
                { name: 'Anti Role Create', value: 'roleCreate' },
                { name: 'Anti Role Delete', value: 'roleDelete' },
                { name: 'Anti Channel Create', value: 'channelCreate' },
                { name: 'Anti Channel Delete', value: 'channelDelete' },
                { name: 'Anti Mention', value: 'mention' }
            ))
        .addIntegerOption(o => o.setName('limit').setDescription('سنوور').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const limit = interaction.options.getInteger('limit');
        const config = require('../../config');

        if (config.securityLimits[action]) {
            config.securityLimits[action].max = limit;
            try {
                const configPath = path.join(__dirname, '../../config.js');
                const configContent = `module.exports = ${JSON.stringify(config, null, 4)};`;
                fs.writeFileSync(configPath, configContent);
            } catch (e) {}
            return interaction.reply(`✅ سنووری **${action}** گۆڕدرا بۆ **${limit}**.`);
        }
        return interaction.reply({ content: '❌ کردارەکە نەدۆزرایەوە.', ephemeral: true });
    },
};
