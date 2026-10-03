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
        "language": "ar"
    },
    "games": {
        "enabled": true,
        "channelId": null,
        "trivia": true,
        "wordle": true,
        "truthordare": true,
        "wouldyourather": true,
        "showCorrectAnswer": true,
        "showWrongAnswer": true,
        "pointsPerWin": 10
    },
    "announcements": {
        "enabled": true,
        "defaultChannel": null,
        "mentionEveryone": false,
        "embed": true,
        "color": "#5865F2"
    },
    "moderation": {
        "enabled": true,
        "logChannelId": null,
        "muteRoleId": null
    },
    "tickets": {
        "enabled": false,
        "categoryId": null,
        "supportRoleId": null,
        "logChannelId": null,
        "maxTickets": 3,
        "transcripts": true
    },
    "giveaways": {
        "enabled": false,
        "defaultDuration": 86400000,
        "defaultWinners": 1,
        "requiredRoleId": null,
        "requiredLevel": 0
    },
    "colorRoles": {
        "enabled": false,
        "channelId": null,
        "maxRoles": 1,
        "allowMultiple": false,
        "roles": {}
    },
    "warns": {
        "enabled": true,
        "autoPunish": true,
        "maxWarns": 3,
        "punishment": "timeout",
        "logChannelId": null
    },
    "levels": {
        "enabled": true,
        "channelId": null,
        "pointsPerMessage": 5,
        "pointsPerVoice": 10,
        "cooldown": 60000,
        "levelUpChannel": null,
        "levelUpMessage": "🎉 Congratulations {userMention}! You reached level {level}!",
        "levelUpEmbed": true,
        "levelUpColor": "#57F287",
        "announceInDM": false,
        "xpPerMessage": {
            "min": 15,
            "max": 25
        },
        "roles": {}
    },
    "autoRole": {
        "enabled": false,
        "roles": [],
        "botRoles": [],
        "delay": 0,
        "ignoreBots": true,
        "ignoreRoles": []
    },
    "logChannels": {
        "general": null,
        "moderation": null,
        "security": null,
        "member": null,
        "memberJoined": null,
        "memberLeft": null,
        "messageDeleted": null,
        "messageEdited": null,
        "voiceJoined": null,
        "voiceLeft": null,
        "voiceMoved": null,
        "channelCreated": null,
        "channelDeleted": null,
        "channelUpdated": null,
        "channelPermissionsUpdated": null,
        "roleCreated": null,
        "roleDeleted": null,
        "roleUpdated": null,
        "memberBanned": null,
        "memberUnbanned": null,
        "nicknameChanged": null,
        "serverUpdated": null
    },
    "welcome": {
        "enabled": false,
        "channelId": null,
        "message": "Welcome {userMention} to the server!",
        "embed": false,
        "color": "#5865F2",
        "imageUrl": null,
        "thumbnailUrl": null,
        "footer": null,
        "emoji": null
    },
    "goodbye": {
        "enabled": false,
        "channelId": null,
        "message": "Goodbye {userMention}! We will miss you.",
        "embed": false,
        "color": "#ED4245",
        "imageUrl": null,
        "thumbnailUrl": null,
        "footer": null,
        "emoji": null
    },
    "reactionRoles": {
        "enabled": false,
        "roles": []
    },
    "inviteTracker": {
        "enabled": false,
        "channelId": null
    },
    "verification": {
        "enabled": false,
        "channelId": null,
        "roleId": null,
        "type": "button"
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
        "dangerousRolePermissions": {
            "enabled": true,
            "punishment": "kick"
        },
        "dangerousRoleAdd": {
            "enabled": true,
            "punishment": "kick"
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
        "roleRename": {
            "enabled": true,
            "punishment": "kick"
        },
        "channelRename": {
            "enabled": true,
            "punishment": "kick"
        },
        "channelTopicChange": {
            "enabled": true,
            "punishment": "kick"
        },
        "emojiCreate": {
            "enabled": true,
            "punishment": "kick"
        },
        "emojiDelete": {
            "enabled": true,
            "punishment": "kick"
        },
        "inviteDelete": {
            "enabled": true,
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
        "voiceSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "voiceConnectSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "timeout"
        }
    },
    "antiRaid": {
        "enabled": true,
        "minAccountAge": 7,
        "checkAvatar": true,
        "checkUsername": true,
        "joinRate": 5,
        "timeWindow": 10000,
        "punishment": "kick",
        "ignoredUsers": [],
        "ignoredRoles": []
    },
    "autoMod": {
        "spam": {
            "enabled": true,
            "threshold": 5,
            "window": 5000,
            "punishment": "timeout"
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
        "phishing": {
            "enabled": true,
            "punishment": "ban"
        },
        "bannedWords": {
            "enabled": true,
            "words": [],
            "punishment": "delete"
        },
        "caps": {
            "enabled": true,
            "max": 10,
            "punishment": "delete"
        },
        "emoji": {
            "enabled": true,
            "max": 10,
            "punishment": "delete"
        },
        "mentions": {
            "enabled": true,
            "max": 5,
            "punishment": "delete"
        },
        "duplicates": {
            "enabled": true,
            "threshold": 3,
            "window": 10000,
            "punishment": "timeout"
        },
        "zalgo": {
            "enabled": true,
            "punishment": "delete"
        },
        "charRepeat": {
            "enabled": true,
            "max": 10,
            "punishment": "delete"
        },
        "personalInfo": {
            "enabled": true,
            "punishment": "delete"
        },
        "massMention": {
            "enabled": true,
            "punishment": "ban"
        },
        "stickerSpam": {
            "enabled": true,
            "max": 5,
            "punishment": "timeout"
        },
        "attachmentSpam": {
            "enabled": true,
            "maxJoins": 3,
            "window": 10000,
            "punishment": "timeout"
        },
        "voiceSpam": {
            "enabled": true,
            "maxJoins": 3,
            "window": 10000,
            "punishment": "kick"
        },
        "voiceConnectSpam": {
            "enabled": true,
            "maxConnects": 2,
            "window": 5000,
            "punishment": "timeout"
        },
        "voiceMuteSpam": {
            "enabled": true,
            "max": 5,
            "punishment": "timeout"
        },
        "voiceDeafenSpam": {
            "enabled": true,
            "max": 5,
            "punishment": "timeout"
        },
        "voiceJoinLeaveSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "timeout"
        },
        "voiceMoveSpam": {
            "enabled": true,
            "max": 3,
            "punishment": "timeout"
        }
    },
    "beastMode": {
        "enabled": false,
        "actions": {
            "ban": {
                "enabled": true,
                "max": 5,
                "punishment": "ban"
            },
            "kick": {
                "enabled": true,
                "max": 5,
                "punishment": "ban"
            },
            "channelCreate": {
                "enabled": true,
                "max": 3,
                "punishment": "ban"
            },
            "channelDelete": {
                "enabled": true,
                "max": 3,
                "punishment": "ban"
            },
            "roleCreate": {
                "enabled": true,
                "max": 3,
                "punishment": "ban"
            },
            "roleDelete": {
                "enabled": true,
                "max": 3,
                "punishment": "ban"
            },
            "mention": {
                "enabled": true,
                "max": 3,
                "punishment": "ban"
            },
            "botAdd": {
                "enabled": true,
                "max": 1,
                "punishment": "ban"
            }
        }
    },
    "roleLimits": {
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
        "roleCreate": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        },
        "roleDelete": {
            "enabled": true,
            "max": 3,
            "punishment": "kick"
        }
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
            "prune": [],
            "limits": {}
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
    "autoBan": {
        "enabled": true
    },
    "utility": {
        "ping": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "serverinfo": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "userinfo": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "avatar": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "poll": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "say": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "help": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "invite": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "server": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "user": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "about": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "credits": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "daily": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "move": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "profile": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "rep": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "roles": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "roll": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "short": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "vote": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "rank": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "leaderboard": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "reactionrole": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        },
        "logs": {
            "enabled": true,
            "channels": [],
            "disabledChannels": [],
            "roles": [],
            "disabledRoles": [],
            "users": [],
            "disabledUsers": [],
            "maxLimit": 4,
            "limitWindow": 600000,
            "customName": "",
            "aliases": [],
            "autoDeleteMessage": false,
            "autoDeleteInvocation": false,
            "autoDeleteReply": false
        }
    }
};
