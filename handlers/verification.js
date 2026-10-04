const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');

// ================= سیستەمی کۆدی پشتڕاستکردنەوە =================
const verificationCodes = new Map();
const verificationAttempts = new Map();

// ================= دروستکردنی کۆدی پشتڕاستکردنەوە =================
function generateCaptcha(length = 6, type = 'numbers') {
    let result = '';
    let characters = '';

    if (type === 'numbers') {
        characters = '0123456789';
    } else if (type === 'letters') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (type === 'mixed') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    } else {
        characters = '0123456789';
    }

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

// ================= دروستکردنی وێنەی کۆد =================
async function generateCaptchaImage(code, config) {
    try {
        // ئێمە دەتوانین لە ڕێگەی canvas یان وێنەکێشەرەوە وێنەیەک دروست بکەین
        // بەڵام لەبەر ئەوەی canvas پێویستی بە داگرتن هەیە، تەنها کۆدەکە دەنێرین

        const colors = config.verification?.captchaColors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // بۆ ئێستا، تەنها کۆدەکە دەنێرین
        return code;
    } catch (error) {
        console.error('Generate Captcha Image Error:', error);
        return code;
    }
}

// ================= ناردنی پەیامی پشتڕاستکردنەوە =================
async function sendVerificationMessage(member, config) {
    try {
        if (!config.verification?.enabled) return false;

        const guild = member.guild;
        const channelId = config.verification.channelId;

        if (!channelId) return false;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) return false;

        // دروستکردنی کۆد
        const code = generateCaptcha(member, config);
        verificationCodes.set(member.id, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        // دروستکردنی ئیمبێد
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🔐 پشتڕاستکردنەوە')
            .setDescription(
                `بەخێربێیت ${member.user.tag}!\n\n` +
                `تکایە کۆدی خوارەوە بنووسە بۆ پشتڕاستکردنەوەی خۆت:\n\n` +
                `**کۆد:** \`${code}\`\n\n` +
                `⚠️ تەنها **${config.verification.maxAttempts || 3}** هەوڵت هەیە.`
            )
            .setTimestamp();

        await channel.send({ content: `<@${member.id}>`, embeds: [embed] }).catch(() => {});

        // ناردنی DM
        if (config.verification.welcomeDM) {
            await member.send(
                `بەخێربێیت بۆ ${guild.name}!\n` +
                `تکایە کۆدی خوارەوە بنووسە:\n\n` +
                `**${code}**`
            ).catch(() => {});
        }

        return true;
    } catch (error) {
        console.error('Send Verification Message Error:', error);
        return false;
    }
}

// ================= پشکنینی کۆد =================
async function checkVerificationCode(message, config) {
    try {
        if (!message.guild) return false;
        if (message.author.bot) return false;
        if (!config.verification?.enabled) return false;

        const userId = message.author.id;
        const data = verificationCodes.get(userId);
        if (!data) return false;

        // ================= چێککردنی ماوە =================
        const timeout = config.verification.timeout || 300000;
        if (Date.now() - data.timestamp > timeout) {
            verificationCodes.delete(userId);
            await message.reply('❌ کۆدەکە بەسەرچووە. تکایە دووبارە هەوڵ بدە.').catch(() => {});
            return true;
        }

        // ================= چێککردنی کۆد =================
        if (message.content.trim() === data.code) {
            // کۆدەکە دروستە
            await verifyMember(message.member, config);
            verificationCodes.delete(userId);
            await message.reply('✅ پشتڕاستکرایتەوە!').catch(() => {});
            return true;
        } else {
            // کۆدەکە هەڵەیە
            data.attempts += 1;
            verificationCodes.set(userId, data);

            const maxAttempts = config.verification.maxAttempts || 3;
            if (data.attempts >= maxAttempts) {
                verificationCodes.delete(userId);
                if (config.verification.kickOnFail) {
                    await message.member.kick('Verification failed: Max attempts reached').catch(() => {});
                }
                await message.reply('❌ زۆرترین هەوڵت بەکارهێنا. تکایە دووبارە هەوڵ بدە.').catch(() => {});
            } else {
                await message.reply(`❌ کۆدەکە هەڵەیە. ${maxAttempts - data.attempts} هەوڵت ماوە.`).catch(() => {});
            }
            return true;
        }
    } catch (error) {
        console.error('Check Verification Code Error:', error);
        return false;
    }
}

// ================= پشتڕاستکردنەوەی ئەندام =================
async function verifyMember(member, config) {
    try {
        const roleId = config.verification.roleId;
        if (roleId) {
            await member.roles.add(roleId).catch(() => {});
        }

        // ================= لۆگ =================
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? member.guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('✅ ئەندام پشتڕاستکرایەوە')
                .setDescription(`**ئەندام:** ${member.user.tag} (<@${member.id}>)`)
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        return true;
    } catch (error) {
        console.error('Verify Member Error:', error);
        return false;
    }
}

// ================= ناردنی پەیامی پشتڕاستکردنەوە بە Button =================
async function sendVerificationButton(member, config) {
    try {
        if (!config.verification?.enabled) return false;

        const guild = member.guild;
        const channelId = config.verification.channelId;

        if (!channelId) return false;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) return false;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🔐 پشتڕاستکردنەوە')
            .setDescription('کلیک بکە لەسەر دوگمەی خوارەوە بۆ پشتڕاستکردنەوەی خۆت.')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('پشتڕاستکردنەوە')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
            );

        await channel.send({ content: `<@${member.id}>`, embeds: [embed], components: [row] }).catch(() => {});

        return true;
    } catch (error) {
        console.error('Send Verification Button Error:', error);
        return false;
    }
}

// ================= بەڕێوەبردنی دوگمەی پشتڕاستکردنەوە =================
async function handleVerificationButton(interaction, config) {
    try {
        if (!config.verification?.enabled) return;

        const member = interaction.member;

        // پشتڕاستکردنەوە
        await verifyMember(member, config);

        // وەڵامدانەوە
        const embed = new EmbedBuilder()
            .setColor('#57F287')
            .setTitle('✅ پشتڕاستکرایتەوە')
            .setDescription('بە سەرکەوتوویی پشتڕاستکرایتەوە! بەخێربێیت بۆ سێرڤەر.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
    } catch (error) {
        console.error('Handle Verification Button Error:', error);
    }
}

// ================= سڕینەوەی کۆدی پشتڕاستکردنەوە =================
function clearVerificationCode(userId) {
    verificationCodes.delete(userId);
}

// ================= وەرگرتنی دۆخی پشتڕاستکردنەوە =================
function getVerificationStatus(userId) {
    return verificationCodes.get(userId) || null;
}

module.exports = {
    generateCaptcha,
    generateCaptchaImage,
    sendVerificationMessage,
    checkVerificationCode,
    verifyMember,
    sendVerificationButton,
    handleVerificationButton,
    clearVerificationCode,
    getVerificationStatus
};
