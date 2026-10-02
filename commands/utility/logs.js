const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('📝 ڕێکخستنی تۆمارەکان')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('دانانی چانێلی تۆمار')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('جۆری تۆمار')
                        .setRequired(true)
                        .addChoices(
                            { name: 'گشتی', value: 'general' },
                            { name: 'مۆدێرەیشن', value: 'moderation' },
                            { name: 'ئاسایش', value: 'security' },
                            { name: 'ئەندام', value: 'member' },
                            { name: 'پەیامەکان', value: 'messageDeleted' },
                            { name: 'دەنگ', value: 'voiceJoined' },
                            { name: 'چانێلەکان', value: 'channelCreated' },
                            { name: 'ڕۆڵەکان', value: 'roleCreated' }
                        ))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('ئەو چانێلەی تۆمارەکان تێدا بنێردرێن')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');

        // ==================== وەرگرتنی ڕێکخستنەکان ====================
        const configPath = path.join(__dirname, '..', '..', 'config.js');
        let config = require(configPath);

        if (!config.logChannels) config.logChannels = {};
        config.logChannels[type] = channel.id;

        // ==================== پاشەکەوتکردن ====================
        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 4)};`);

        // ==================== ناردنی ئەنجام ====================
        const embed = new EmbedBuilder()
            .setTitle('✅ تۆمارەکان ڕێکخران')
            .setColor('#57F287')
            .setDescription(`**جۆر:** ${type}\n**چانێل:** <#${channel.id}>`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
