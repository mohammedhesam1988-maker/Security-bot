module.exports = {
    // ================= زانیاری بنەڕەتی =================
    token: process.env.TOKEN || "", // تۆکنەکەت لێرە دابنێ ئەگەر لە .env نییە
    prefix: "!",
    ownerId: "", // ئایدی خۆت لێرە دابنێ

    // ================= لیستی سپی (Whitelist) =================
    // گرنگ: ناوەکان دەبێت وەک خۆیان بن بۆ ئەوەی داشبۆردەکە کار بکات
    trustedUserIds: [ '421712596673101825' ], // ئایدی بەکارهێنەرە دڵنیاکان
    trustedRoleIds: [],                     // ئایدی ڕۆڵە دڵنیاکان
    
    // ئەم بەشە بۆ داشبۆردەکە زۆر گرنگە بۆ ئەوەی هەڵە نەدات
    whitelist: {
        users: [],
        roles: [],
        channels: []
    },

    // ================= بەشی ئەنتی-نیوک و ئەنتی-ڕەید =================
    antiNuke: { enabled: true },
    antiRaid: { enabled: true },
    autoBan: { enabled: true },
    beastMode: { enabled: false },

    // ================= بەشی لۆگ =================
    logChannelId: null,
    moderationLogChannelId: null,
    securityLogChannelId: null,

    // ================= بەشی AutoMod (ئۆتۆمۆد) =================
    autoMod: {
        spam: { enabled: true, threshold: 5, window: 5000 },
        invites: { enabled: true },
        links: { enabled: true, allowedDomains: [ 'youtube.com', 'twitter.com', 'github.com' ] },
        phishing: { enabled: true },
        bannedWords: { enabled: true, words: [] },
        caps: { enabled: true, max: 10 },
        emoji: { enabled: true, max: 10 },
        mentions: { enabled: true, max: 5 },
        duplicates: { enabled: true, threshold: 3, window: 10000 },
        zalgo: { enabled: true },
        charRepeat: { enabled: true, max: 10 },
        personalInfo: { enabled: true },
        massMention: { enabled: true },
        stickerSpam: { enabled: true, max: 5 },
        attachmentSpam: { enabled: true, max: 3 },
        voiceSpam: { enabled: true, maxJoins: 3, window: 10000 },
        voiceConnectSpam: { enabled: true, maxConnects: 2, window: 5000 }
    },

    // ================= بەشی Security Limits =================
    securityLimits: {
        ban: { enabled: true, max: 5, punishment: 'kick' },
        kick: { enabled: true, max: 5, punishment: 'kick' },
        channelCreate: { enabled: true, max: 3, punishment: 'kick' },
        channelDelete: { enabled: true, max: 3, punishment: 'kick' },
        roleCreate: { enabled: true, max: 3, punishment: 'kick' },
        roleDelete: { enabled: true, max: 3, punishment: 'kick' },
        mention: { enabled: true, max: 0, punishment: 'kick' },
        botAdd: { enabled: true, punishment: 'kick' },
        prune: { enabled: true, punishment: 'ban' },
        dangerousRolePermission: { enabled: true, punishment: 'kick' },
        dangerousRoleAdd: { enabled: true, punishment: 'kick' },
        vanityChange: { enabled: true, punishment: 'kick' },
        serverRename: { enabled: true, punishment: 'kick' },
        serverIconChange: { enabled: true, punishment: 'kick' },
        roleRename: { enabled: true, punishment: 'kick' },
        channelRename: { enabled: true, punishment: 'kick' },
        emojiDelete: { enabled: true, punishment: 'kick' },
        emojiRename: { enabled: true, punishment: 'kick' },
        inviteDelete: { enabled: true, punishment: 'kick' },
        inviteLink: { enabled: true, punishment: 'detect' },
        ghostPing: { enabled: true, punishment: 'detect' },
        voiceSpam: { enabled: true, max: 3, punishment: 'kick' },
        voiceConnectSpam: { enabled: true, max: 2, punishment: 'timeout' }
    }
};
