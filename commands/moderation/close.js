const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Ticket } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('🔒 داخستنی تیکتەکە')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.channel;
        const guild = interaction.guild;

        // ==================== پشکنین ====================
        const ticket = await Ticket.findOne({
            guildId: guild.id,
            channelId: channel.id,
            status: 'open'
        });

        if (!ticket) {
            return interaction.reply({
                content: '❌ ئەم چانێلە تیکت نییە یان پێشتر داخراوە.',
                ephemeral: true
            });
        }

        // ==================== نۆژەنکردنەوە ====================
        ticket.status = 'closed';
        ticket.closedAt = new Date();
        ticket.closedBy = interaction.user.id;
        await ticket.save();

        await interaction.reply({
            content:
                `🔒 **تیکت داخرا**\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `> **لەلایەن:** ${interaction.user.tag}\n` +
                `> **چانێل:** ${channel.name}\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `ئەم چانێلە لە ماوەی ٥ چرکەدا دەسڕدرێتەوە.`
        });

        setTimeout(() => {
            channel.delete().catch(() => {});
        }, 5000);
    }
};
