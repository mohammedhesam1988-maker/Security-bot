const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Settings, Ticket } = require('../../models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('🎫 دروستکردنی تیکتێکی پشتگیری')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('هۆکاری تیکتەکە')
                .setRequired(true)),

    async execute(interaction) {
        const reason = interaction.options.getString('reason');
        const guild = interaction.guild;
        const user = interaction.user;

        // ==================== وەرگرتنی ڕێکخستنەکان ====================
        let settings = await Settings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = await Settings.create({ guildId: guild.id });
        }

        // ==================== پشکنینی چالاکی ====================
        if (!settings.tickets?.enabled) {
            return interaction.reply({
                content: '❌ سیستەمی تیکت لەم سێرڤەرەدا چالاک نییە.',
                ephemeral: true
            });
        }

        // ==================== پشکنینی تیکتی پێشوو ====================
        const existingTicket = await Ticket.findOne({
            guildId: guild.id,
            userId: user.id,
            status: 'open'
        });

        if (existingTicket) {
            return interaction.reply({
                content: `❌ تۆ پێشتر تیکتێکی کراوەت هەیە: <#${existingTicket.channelId}>`,
                ephemeral: true
            });
        }

        // ==================== دروستکردنی چانێل ====================
        const categoryId = settings.tickets?.categoryId;
        const supportRoleId = settings.tickets?.supportRoleId;

        const ticketChannel = await guild.channels.create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId || null,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                ...(supportRoleId ? [{
                    id: supportRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }] : [])
            ]
        });

        // ==================== تۆمارکردنی تیکت ====================
        await Ticket.create({
            guildId: guild.id,
            userId: user.id,
            channelId: ticketChannel.id,
            reason: reason,
            status: 'open',
            createdAt: new Date()
        });

        // ==================== ناردنی پەیام ====================
        await ticketChannel.send({
            content:
                `🎫 **تیکتی نوێ**\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `> **ئەندام:** <@${user.id}>\n` +
                `> **هۆکار:** ${reason}\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `تکایە چاوەڕوانی وەڵامی ستاف بکە.`
        });

        await interaction.reply({
            content: `✅ تیکتەکەت دروستکرا: <#${ticketChannel.id}>`,
            ephemeral: true
        });
    }
};
