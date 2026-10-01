const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpunishment')
        .setDescription('گۆڕینی جۆری سزای کردارێک')
        .addStringOption(o => o.setName('action').setDescription('کردار').setRequired(true)
            .addChoices(
                { name: 'Anti Ban', value: 'ban' },
                { name: 'Anti Kick', value: 'kick' },
                { name: 'Anti Role Create', value: 'roleCreate' },
                { name: 'Anti Role Delete', value: 'roleDelete' },
                { name: 'Anti Channel Create', value: 'channelCreate' },
                { name: 'Anti Channel Delete', value: 'channelDelete' },
                { name: 'Anti Mention', value: 'mention' },
                { name: 'Anti Bot Add', value: 'botAdd' },
                { name: 'Anti Prune', value: 'prune' }
            ))
        .addStringOption(o => o.setName('punishment').setDescription('سزا').setRequired(true)
            .addChoices(
                { name: 'Kick', value: 'kick' },
                { name: 'Ban', value: 'ban' },
                { name: 'Clear Roles', value: 'clearRoles' },
                { name: 'Detect Only', value: 'detect' }
            ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const punishment = interaction.options.getString('punishment');
        const config = require('../../config');

        if (config.securityLimits[action]) {
            config.securityLimits[action].punishment = punishment;
            return interaction.reply(`✅ سزای **${action}** گۆڕدرا بۆ **${punishment}**.`);
        }
        return interaction.reply({ content: '❌ کردارەکە نەدۆزرایەوە.', ephemeral: true });
    },
};
