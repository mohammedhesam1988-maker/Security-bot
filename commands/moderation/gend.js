const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Giveaway } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gend')
        .setDescription('🎁 کۆتاییپێهێنانی خەڵاتکردن')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ئایدی پەیامی خەڵاتکردن')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');
        const giveaway = await Giveaway.findOne({
            guildId: interaction.guild.id,
            messageId: messageId,
            ended: false
        });

        if (!giveaway) {
            return interaction.reply({
                content: '❌ خەڵاتکردن نەدۆزرایەوە یان پێشتر کۆتاییهاتووە.',
                ephemeral: true
            });
        }

        // ==================== هەڵبژاردنی براوە ====================
        if (giveaway.participants.length === 0) {
            giveaway.ended = true;
            await giveaway.save();
            return interaction.reply({ content: '❌ هیچ کەس بەشداری نەکردبوو.', ephemeral: true });
        }

        const shuffled = giveaway.participants.sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, giveaway.winners);

        giveaway.ended = true;
        giveaway.winnersList = winners;
        await giveaway.save();

        // ==================== ناردنی ئەنجام ====================
        const channel = await interaction.guild.channels.fetch(giveaway.channelId);
        const embed = new EmbedBuilder()
            .setTitle(`🎉 کۆتایی خەڵاتکردن: ${giveaway.prize}`)
            .setDescription(
                `**براوەکان:**\n` +
                winners.map(w => `<@${w}>`).join('\n') +
                `\n\n**خەڵات:** ${giveaway.prize}`
            )
            .setColor('#00ff00')
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        await interaction.reply({
            content: '✅ خەڵاتکردن کۆتاییهات و براوەکان دیاریکران.',
            ephemeral: true
        });
    }
};
