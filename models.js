const mongoose = require('mongoose');

// ==================== Action (کردارەکان) ====================
const actionSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    action: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
});

// ==================== Warning (وارنەکان) ====================
const warningSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    moderatorId: String,
    reason: String,
    timestamp: { type: Date, default: Date.now }
});

// ==================== Invite (بانگهێشت) ====================
const inviteSchema = new mongoose.Schema({
    guildId: String,
    inviterId: String,
    inviteCode: String,
    uses: { type: Number, default: 0 },
    maxUses: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
});

// ==================== InviteUse (بەکارهێنانی بانگهێشت) ====================
const inviteUseSchema = new mongoose.Schema({
    guildId: String,
    inviterId: String,
    invitedId: String,
    inviteCode: String,
    joinedAt: { type: Date, default: Date.now },
    leftAt: Date,
    isActive: { type: Boolean, default: true }
});

// ==================== MemberStats (ئاماری ئەندام) ====================
const memberStatsSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    invites: { type: Number, default: 0 },
    realInvites: { type: Number, default: 0 },
    leaves: { type: Number, default: 0 },
    fakeInvites: { type: Number, default: 0 },
    bonusInvites: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

// ==================== Level (ئاست) ====================
const levelSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    totalXp: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    voiceMinutes: { type: Number, default: 0 },
    lastMessage: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// ==================== Welcome (بەخێرهاتن) ====================
const welcomeSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    message: String,
    embedColor: { type: String, default: '#FFD700' },
    showAvatar: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true }
});

// ==================== Ticket (تیکێت) ====================
const ticketSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    userId: String,
    subject: String,
    status: { type: String, default: 'open' },
    claimedBy: String,
    createdAt: { type: Date, default: Date.now },
    closedAt: Date,
    closedBy: String,
    transcript: String
});

// ==================== ReactionRole (ڕۆڵ بە ڕیاکشن) ====================
const reactionRoleSchema = new mongoose.Schema({
    guildId: String,
    messageId: String,
    channelId: String,
    emoji: String,
    roleId: String,
    createdAt: { type: Date, default: Date.now }
});

// ==================== Giveaway (خەڵات) ====================
const giveawaySchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    hostId: String,
    prize: String,
    winners: { type: Number, default: 1 },
    endsAt: Date,
    ended: { type: Boolean, default: false },
    participants: [String],
    winnerIds: [String],
    createdAt: { type: Date, default: Date.now }
});

// ==================== AntiNukeConfig (ڕێکخستنی دژە-نیوک) ====================
const antiNukeConfigSchema = new mongoose.Schema({
    guildId: String,
    config: { type: Object, default: {} },
    updatedAt: { type: Date, default: Date.now }
});

// ==================== LogConfig (ڕێکخستنی لۆگ) ====================
const logConfigSchema = new mongoose.Schema({
    guildId: String,
    logChannelId: String,
    moderationLogChannelId: String,
    securityLogChannelId: String,
    updatedAt: { type: Date, default: Date.now }
});

// ==================== Models ====================
const Action = mongoose.model('Action', actionSchema);
const Warning = mongoose.model('Warning', warningSchema);
const Invite = mongoose.model('Invite', inviteSchema);
const InviteUse = mongoose.model('InviteUse', inviteUseSchema);
const MemberStats = mongoose.model('MemberStats', memberStatsSchema);
const Level = mongoose.model('Level', levelSchema);
const Welcome = mongoose.model('Welcome', welcomeSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);
const ReactionRole = mongoose.model('ReactionRole', reactionRoleSchema);
const Giveaway = mongoose.model('Giveaway', giveawaySchema);
const AntiNukeConfig = mongoose.model('AntiNukeConfig', antiNukeConfigSchema);
const LogConfig = mongoose.model('LogConfig', logConfigSchema);

// ==================== Settings (ڕێکخستنەکان) ====================
const settingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    games: {
        enabled: { type: Boolean, default: true },
        channelId: { type: String, default: null }, // <--- ئەمە زیاد بکە
        trivia: { type: Boolean, default: true },
        wordle: { type: Boolean, default: true },
        truthordare: { type: Boolean, default: true },
        wouldyourather: { type: Boolean, default: true },
        showCorrectAnswer: { type: Boolean, default: true }, // <--- ئەمە زیاد بکە
        showWrongAnswer: { type: Boolean, default: true }  // <--- ئەمە زیاد بکە
    },
    announcements: {
        enabled: { type: Boolean, default: true },
        channelId: { type: String, default: null },
        mentionEveryone: { type: Boolean, default: false },
        useEmbed: { type: Boolean, default: true },
        color: { type: String, default: '#fbbf24' }
    },
    moderation: {
        enabled: { type: Boolean, default: true },
        logChannelId: { type: String, default: null },
        muteRoleId: { type: String, default: null }
    }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = {
    Action,
    Warning,
    Invite,
    InviteUse,
    MemberStats,
    Level,
    Welcome,
    Ticket,
    ReactionRole,
    Giveaway,
    AntiNukeConfig,
    LogConfig,
    Settings,
};
