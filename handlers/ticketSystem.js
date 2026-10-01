// ==================== TICKET SYSTEM HANDLER ====================

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

async function createTicket(interaction, config) {
    try {
        const guild = interaction.guild;
        const user = interaction.user;

        const existing = guild.channels.cache.find(c => c.name === `ticket-${user.id}`);
        if (existing) {
            return interaction.reply({ content: `❌ You already have a ticket open: <#${existing.id}>`, ephemeral: true });
        }

        const ticketChannel = await guild.channels.create({
            name: `ticket-${user.id}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                }
            ]
        }).catch(() => null);

        if (!ticketChannel) {
            return interaction.reply({ content: '❌ Failed to create ticket channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('🎫 Ticket Created')
            .setDescription(`Hello ${user}, a staff member will be with you shortly.\n\n**Describe your issue below.**`)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [row] }).catch(() => {});

        await interaction.reply({ content: `✅ Ticket created: <#${ticketChannel.id}>`, ephemeral: true });
    } catch (e) {
        console.error(`createTicket Error: ${e.message}`);
    }
}

async function closeTicket(interaction, config) {
    try {
        const channel = interaction.channel;
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
        }

        await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...', ephemeral: false }).catch(() => {});

        setTimeout(async () => {
            await channel.delete().catch(() => {});
        }, 5000);
    } catch (e) {
        console.error(`closeTicket Error: ${e.message}`);
    }
}

module.exports = {
    createTicket,
    closeTicket
};
