module.exports = {
token: process.env.TOKEN || '',
    "prefix": "!",
    "ownerId": "",
    "general": {
        "botName": "Security Bot",
        "botDescription": "Advanced Protection System",
        "botStatus": "online",
        "botActivity": "Watching over the server",
        "botActivityType": "WATCHING",
        "theme": "dark",
        "accentColor": "#fbbf24",
        "language": "en"
    },
    "premium": {
        "enabled": true,
        "tier": "platinum",
        "tiers": {
            "free": {
                "name": "Free",
                "color": "#94a3b8",
                "features": []
            },
            "bronze": {
                "name": "Bronze",
                "color": "#cd7f32",
                "features": [
                    "customName",
                    "aliases"
                ]
            },
            "silver": {
                "name": "Silver",
                "color": "#c0c0c0",
                "features": [
                    "customName",
                    "aliases",
                    "analytics"
                ]
            },
            "gold": {
                "name": "Gold",
                "color": "#ffd700",
                "features": [
                    "customName",
                    "aliases",
                    "analytics",
                    "giveaway"
                ]
            },
            "platinum": {
                "name": "Platinum",
                "color": "#e5e4e2",
                "features": [
                    "customName",
                    "aliases",
                    "analytics",
                    "giveaway",
                    "music"
                ]
            }
        },
        "ownerOverride": true,
        "whitelistOverride": true
    },
    "analytics": {
        "enabled": true,
        "trackMessages": true,
        "trackVoice": true,
        "trackMembers": true,
        "trackCommands": true,
        "dailyReport": true,
        "weeklyReport": true,
        "monthlyReport": true,
        "reportChannel": null,
        "reportTime": "00:00"
    },
    "whitelist": {
        "users": {
            "all": [],
            "ban": [],
            "kick": [],
            "botAdd": [],
            "roleUpdate": [],
            "roleAdd": [],
            "channelCreate": [],
            "channelDelete": [],
            "roleCreate": [],
            "roleDelete": [],
            "inviteLink": [],
            "prune": []
        },
        "roles": {
            "all": [],
            "ban": [],
            "kick": [],
            "botAdd": [],
            "roleUpdate": [],
            "roleAdd": [],
            "channelCreate": [],
            "channelDelete": [],
            "roleCreate": [],
            "roleDelete": [],
            "inviteLink": [],
            "prune": []
        },
        "channels": {
            "all": [],
            "inviteLink": [],
            "channelDelete": []
        }
    },
    "antiNuke": {
        "enabled": true
    },
    "antiRaid": {
        "enabled": true,
        "joinRate": 5,
        "timeWindow": 10000,
        "punishment": "kick"
    },
    "autoBan": {
        "enabled": true
    },
    "beastMode": {
        "enabled": false,
        "actions": {
            "ban": {
                "max": 5,
                "punishment": "kick"
            },
            "kick": {
                "max": 5,
                "punishment": "kick"
            },
            "channelDelete": {
                "max": 3,
                "punishment": "kick"
            },
            "roleDelete": {
                "max": 3,
                "punishment": "kick"
            }
        }
    },
    "logChannels": {
        "memberBanned": null,
        "memberUnbanned": null,
        "memberKicked": null,
        "memberJoined": null,
        "memberLeft": null,
        "nicknameChanged": null,
        "memberRolesUpdated": null,
        "memberTimeout": null,
        "channelCreated": null,
        "channelDeleted": null,
        "channelUpdated": null,
        "channelPermissionsUpdated": null,
        "roleCreated": null,
        "roleDeleted": null,
        "roleUpdated": null,
        "rolePermissionsUpdated": null,
        "roleGiven": null,
        "roleRemoved": null,
        "voiceJoined": null,
        "voiceLeft": null,
        "voiceMoved": null,
        "voiceStateUpdated": null,
        "voiceMicMuted": null,
        "voiceMicUnmuted": null,
        "voiceDeafened": null,
        "voiceUndeafened": null,
        "voiceStreamStarted": null,
        "voiceStreamStopped": null,
        "voiceCameraOn": null,
        "voiceCameraOff": null,
        "messageDeleted": null,
        "messageEdited": null,
        "serverUpdated": null,
        "threadCreated": null,
        "threadDeleted": null,
        "threadUpdated": null,
        "general": null
    },
    "autoMod": {
        "spam": {
            "enabled": true,
            "threshold": 5,
            "window": 5000,
            "punishment": "timeout",
            "timeoutDuration": 60000
        },
        "duplicates": {
            "enabled": true,
            "threshold": 3,
            "window": 10000,
            "punishment": "timeout",
            "timeoutDuration": 60000
        },
        "emoji": {
            "enabled": true,
            "max": 10,
            "punishment": "delete",
            "timeoutDuration": 30000
        },
        "mentions": {
            "enabled": true,
            "max": 5,
            "punishment": "timeout",
            "timeoutDuration": 120000
        },
        "caps": {
            "enabled": true,
            "max": 10,
            "punishment": "delete"
        },
        "invites": {
            "enabled": true,
            "punishment": "delete"
        },
        "links": {
            "enabled": true,
            "allowedDomains": [
                "youtube.com",
                "twitter.com",
                "github.com"
            ],
            "punishment": "delete"
        },
        "charRepeat": {
            "enabled": true,
            "max": 10,
            "punishment": "delete"
        },
        "zalgo": {
            "enabled": true,
            "punishment": "delete"
        },
        "massMention": {
            "enabled": true,
            "max": 10,
            "punishment": "kick"
        },
        "bannedWords": {
            "enabled": true,
            "words": [],
            "punishment": "delete"
        },
        "personalInfo": {
            "enabled": true,
            "punishment": "delete"
        },
        "phishing": {
            "enabled": true,
            "punishment": "ban"
        },
        "nsfw": {
            "enabled": true,
            "punishment": "delete"
        },
        "stickerSpam": {
            "enabled": true,
            "max": 5,
            "punishment": "delete",
            "timeoutDuration": 30000
        },
        "attachmentSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "delete",
            "timeoutDuration": 30000
        },
        "voiceSpam": {
            "enabled": true,
            "maxJoins": 3,
            "window": 10000,
            "punishment": "kick",
            "timeoutDuration": 300000
        },
        "voiceConnectSpam": {
            "enabled": true,
            "maxConnects": 2,
            "window": 5000,
            "punishment": "timeout",
            "timeoutDuration": 60000
        },
        "voiceMicSpam": {
            "enabled": true,
            "max": 5,
            "punishment": "timeout",
            "timeoutDuration": 60000
        },
        "voiceLiveSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "kick",
            "timeoutDuration": 300000
        },
        "voiceJoinLeaveSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "kick",
            "timeoutDuration": 300000
        },
        "voiceMoveSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "kick",
            "timeoutDuration": 300000
        }
    },
    "securityLimits": {
        "ban": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "kick": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "channelCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "channelDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "channelUpdate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "channelPermissionsUpdate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "mention": {
            "enabled": true,
            "max": 0,
            "punishment": "kick"
        },
        "botAdd": {
            "enabled": true,
            "punishment": "kick"
        },
        "prune": {
            "enabled": true,
            "punishment": "ban"
        },
        "emojiDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "emojiRename": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "emojiCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "inviteDelete": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "inviteCreate": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "inviteLink": {
            "enabled": true,
            "punishment": "detect"
        },
        "ghostPing": {
            "enabled": true,
            "punishment": "detect"
        },
        "vanityChange": {
            "enabled": true,
            "punishment": "kick"
        },
        "serverRename": {
            "enabled": true,
            "punishment": "kick"
        },
        "serverIconChange": {
            "enabled": true,
            "punishment": "kick"
        },
        "webhookCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "webhookDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "webhookUpdate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "threadCreate": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "threadDelete": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "stickerCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "stickerDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        }
    },
    "roleLimits": {
        "roleAdd": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "roleRemove": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "roleUpdate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "roleCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "roleDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "roleRename": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "dangerousRolePermission": {
            "enabled": true,
            "max": 1,
            "punishment": "kick"
        },
        "dangerousRoleAdd": {
            "enabled": true,
            "max": 1,
            "punishment": "kick"
        },
        "rolePositionUpdate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "roleColorUpdate": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "roleHoistUpdate": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        },
        "roleMentionableUpdate": {
            "enabled": true,
            "max": 5,
            "punishment": "kick"
        }
    },
    "verification": {
        "enabled": false,
        "channelId": null,
        "roleId": null
    },
    "moderation": {
        "enabled": true,
        "logChannelId": null,
        "muteRoleId": null
    },
    "autoRole": {
        "enabled": false,
        "roles": [],
        "botRoles": [],
        "delay": 0,
        "ignoreBots": true,
        "ignoreRoles": []
    },
    "welcome": {
        "enabled": false,
        "channelId": null,
        "message": "%member_mention% Welcome to the server!",
        "embed": false,
        "color": "#5865F2",
        "imageUrl": null,
        "thumbnailUrl": null,
        "footer": null,
        "footerIcon": null,
        "emoji": null,
        "banner": {
            "enabled": false,
            "type": "normal",
            "imageUrl": null
        }
    },
    "goodbye": {
        "enabled": false,
        "channelId": null,
        "message": "%member_name% has left the server.",
        "embed": false,
        "color": "#ED4245"
    },
    "reactionRoles": {
        "enabled": false,
        "roles": []
    },
    "inviteTracker": {
        "enabled": false,
        "channelId": null,
        "message": "%member_mention% was invited by %inviter% and now has %inviter_invites% invites.",
        "embed": false,
        "color": "#57F287"
    },
    "levels": {
        "enabled": true,
        "xpPerMessage": {
            "min": 15,
            "max": 25
        },
        "cooldown": 60000,
        "levelUpChannel": null,
        "levelUpMessage": "🎉 %member_mention% has reached **Level %level%**!",
        "levelUpEmbed": false,
        "levelUpColor": "#57F287",
        "announceInDM": false,
        "roles": {},
        "xpMultiplier": {},
        "blacklistedChannels": [],
        "blacklistedRoles": [],
        "ignoredUsers": []
    },
    "tickets": {
        "enabled": false,
        "categoryId": null,
        "supportRoleId": null,
        "logChannelId": null,
        "maxTickets": 3,
        "autoClose": false,
        "autoCloseTime": 86400000,
        "transcripts": true,
        "ticketMessage": "Thank you for creating a ticket. Our support team will be with you shortly."
    },
    "giveaways": {
        "enabled": false,
        "defaultDuration": 86400000,
        "defaultWinners": 1,
        "requireRole": null,
        "requireLevel": 0,
        "bonusRoles": {},
        "blacklistedRoles": [],
        "giveawayChannel": null
    },
    "warns": {
        "enabled": true,
        "autoPunish": true,
        "maxWarns": 3,
        "punishment": "timeout",
        "warnExpiry": 604800000,
        "logChannelId": null,
        "allowAppeal": false
    },
    "games": {
        "enabled": true,
        "channelId": "1551638376745275502",
        "trivia": true,
        "wordle": true,
        "truthordare": true,
        "wouldyourather": true,
        "showCorrectAnswer": true,
        "showWrongAnswer": true,
        "pointsPerWin": "1"
    },
    "announcements": {
        "enabled": true,
        "defaultChannel": null,
        "mentionEveryone": false,
        "embed": true,
        "color": "#5865F2"
    },
    "colorRoles": {
        "enabled": false,
        "channelId": null,
        "roles": {},
        "maxRoles": 1,
        "allowMultiple": false
    },
    "utility": {
        "ping": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "server": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "user": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "avatar": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "roles": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "moveme": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "credits": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "daily": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "vote": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "rep": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "points": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "profile": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "roll": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "short": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "kick": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "ban": {
            "enabled": true,
            "customName": "",
            "aliases": [],
            "enabledRoles": [],
            "disabledRoles": [],
            "enabledChannels": [],
            "disabledChannels": [],
            "maxLimit": 4,
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        }
    },
    "antiSpam": {
        "enabled": true
    },
    "permissions": {}
};
