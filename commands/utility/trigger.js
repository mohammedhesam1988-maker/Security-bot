const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const triggerHandler = require('../../handlers/triggerHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trigger')
        .setDescription('بەڕێوەبردنی ترێگەرەکان')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('زیادکردنی ترێگەرێکی نوێ')
                .addStringOption(opt =>
                    opt.setName('trigger')
                        .setDescription('وشە یان دەقەکە')
                        .setRequired(true))
                .addStringOption(opt =>
                    opt.setName('response')
                        .setDescription('وەڵامەکە')
                        .setRequired(true))
                .addStringOption(opt =>
                    opt.setName('matchtype')
                        .setDescription('جۆری هاوتاکردن')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Normal', value: 'normal' },
                            { name: 'Exact', value: 'exact' },
                            { name: 'StartsWith', value: 'startsWith' },
                            { name: 'EndsWith', value: 'endsWith' },
                            { name: 'Regex', value: 'regex' }
                        ))
                .addBooleanOption(opt =>
                    opt.setName('useembed')
                        .setDescription('وەڵام بە ئیمبێد بێت')
                        .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('سڕینەوەی ترێگەرێک')
                .addStringOption(opt =>
                    opt.setName('trigger')
                        .setDescription('ترێگەرەکە')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('لیستی ترێگەرەکان')),

    async execute(interaction, client, config) {
        const sub = interaction.options.getSubcommand();

        try {
            if (sub === 'add') {
                const triggerText = interaction.options.getString('trigger');
                const responseText = interaction.options.getString('response');
                const matchType = interaction.options.getString('matchtype') || 'normal';
                const useEmbed = interaction.options.getBoolean('useembed') || false;

                const result = await triggerHandler.addTrigger({
                    trigger: triggerText,
                    response: responseText,
                    matchType: matchType,
                    useEmbed: useEmbed,
                    createdBy: interaction.user.id,
                    createdAt: Date.now()
                }, config);

                if (!result.success) {
                    return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
                }

                return interaction.reply({ content: `✅ ترێگەر **${triggerText}** زیادکرا.`, ephemeral: true });
            }

            if (sub === 'remove') {
                const triggerText = interaction.options.getString('trigger');
                const result = await triggerHandler.removeTrigger(triggerText, config);

                if (!result.success) {
                    return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
                }

                return interaction.reply({ content: `✅ ترێگەر **${triggerText}** سڕدرایەوە.`, ephemeral: true });
            }

            if (sub === 'list') {
                const result = await triggerHandler.listTriggers(config);

                if (!result.success) {
                    return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
                }

                const list = result.triggers.map((t, i) => `**${i + 1}.** \`${t.trigger}\` → ${t.response.substring(0, 50)}...`).join('\n');

                const embed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('📋 لیستی ترێگەرەکان')
                    .setDescription(list || 'هیچ ترێگەرێک نییە.')
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

        } catch (error) {
            console.error('Trigger Command Error:', error);
            return interaction.reply({ content: '❌ هەڵەیەک ڕوویدا.', ephemeral: true });
        }
    }
};
