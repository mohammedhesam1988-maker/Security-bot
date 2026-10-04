const { EmbedBuilder } = require('discord.js');

// ================= سیستەمی چاودێری =================
const joinCache = new Map();

// ================= چێککردنی لیستی سپی =================
function isWhitelisted(member, config) {
    if (!member) return false;
    if (member.id === member.guild.ownerId) return true;
    if (config.whitelist?.users?.all?.includes(member.id)) return true;
    if (config.whitelist?.roles?.all) {
        if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
    }
    return false;
}

// ================= چێککردنی هێرش =================
async function checkRaid(guild, member, config) {
    try {
        if (!config.antiRaid || !config.antiRaid.enabled) return false;
        if (isWhitelisted(member, config)) return false;

        const now = Date.now();
        const key = guild.id;

        // ================= تەمەنی ئەکاونت =================
        const accountAge = now - member.user.createdTimestamp;
        const minAge = (config.antiRaid.minAccountAge || 7) * 24 * 60 * 60 * 1000;

        if (accountAge < minAge) {
            await punish(guild, member, 'سەلماندنی ئەکاونت', config);
            return true;
        }

        // ================= پشکنینی وێنە =================
        if (config.antiRaid.checkAvatar !== false && !member.user.avatar) {
            await punish(guild, member, 'بەبێ وێنەی پرۆفایل', config);
            return true;
        }

        // ================= پشکنینی ناو =================
        if (config.antiRaid.checkUsername !== false) {
            const username = member.user.username;
            const suspiciousPattern = /^[a-z]{5,}\d{3,5}$/i;
            if (suspiciousPattern.test(username)) {
                await punish(guild, member, 'ناوی گوماناوی', config);
                return true;
            }
        }

        // ================= چێککردنی هاتنەژوورەوە =================
        if (!joinCache.has(key)) joinCache.set(key, []);
        const joins = joinCache.get(key);
        joins.push({ id: member.id, time: now });

        const window = config.antiRaid.timeWindow || 10000;
        const recentJoins = joins.filter(j => now - j.time < window);
        joinCache.set(key, recentJoins);

        const joinRate = config.antiRaid.joinRate || 5;

        if (recentJoins.length >= joinRate) {
            await lockdown(guild, config);
            joinCache.set(key, []);
            return true;
        }

        return false;
    } catch (e) {
        console.error(`checkRaid Error: ${e.message}`);
        return false;
    }
}

// ================= سزادان =================
async function punish(guild, member, reason, config) {
    try {
        const action = config.antiRaid.punishment || 'kick';

        if (action === 'kick' && member.kickable) {
            await member.kick(reason).catch(() => {});
        } else if (action === 'ban' && member.bannable) {
            await member.ban({ reason }).catch(() => {});
        }

        // ================= لۆگ =================
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ED4245')
                .setTitle('🚨 Anti-Raid: ئەندام سزا درا')
                .setDescription(`**ئەندام:** <@${member.id}>\n**ناو:** ${member.user.tag}\n**هۆکار:** ${reason}\n**سزا:** ${action}`)
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    } catch (e) {
        console.error(`Punish Error: ${e.message}`);
    }
}

// ================= داخستن =================
async function lockdown(guild, config) {
    try {
        // بەرزکردنەوەی ئاستی پاراستن
        await guild.setVerificationLevel(4).catch(() => {});

        // ئاگادارکردنی خاوەن
        const owner = await guild.fetchOwner().catch(() => null);
        if (owner) {
            await owner.send(`🚨 هێرش دۆزرایەوە لە ${guild.name}! چانێلەکان داخراون.`).catch(() => {});
        }

        // ================= لۆگ =================
        const logChannelId = config.logChannels?.security || config.logChannels?.general;
        const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ED4245')
                .setTitle('🚨 Anti-Raid: هێرش دۆزرایەوە')
                .setDescription('چانێلەکان داخراون. تکایە دەستبەجێ ئەندامە گوماناوییەکان لابەرە.')
                .setTimestamp();
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    } catch (e) {
        console.error(`Lockdown Error: ${e.message}`);
    }
}

// ================= کردنەوە =================
async function unlockServer(guild) {
    try {
        await guild.setVerificationLevel(0).catch(() => {});
    } catch (e) {
        console.error(`Unlock Error: ${e.message}`);
    }
}

module.exports = {
    checkRaid,
    punish,
    lockdown,
    unlockServer,
    isWhitelisted
};
