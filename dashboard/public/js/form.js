/* ============================================================
 * form.js - FULL Dynamic Form Builder
 * Security Bot Dashboard - Complete Config Coverage
 * 2026 (c) KBoloorian
 * ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
   * REUSABLE FIELD TEMPLATES
   * ------------------------------------------------------------ */
  function cmdFields() {
    return [
      { key: 'enabled',              label: 'Enabled',              type: 'boolean' },
      { key: 'channels',             label: 'Allowed Channels',     type: "channelArray" },
      { key: 'disabledChannels',     label: 'Disabled Channels',    type: "channelArray" },
      { key: 'roles',                label: 'Allowed Roles',        type: "roleArray" },
      { key: 'disabledRoles',        label: 'Disabled Roles',       type: "roleArray" },
      { key: 'users',                label: 'Allowed Users',        type: 'stringArray' },
      { key: 'disabledUsers',        label: 'Disabled Users',       type: 'stringArray' },
      { key: 'maxLimit',             label: 'Max Limit',            type: 'number' },
      { key: 'limitWindow',          label: 'Limit Window (ms)',    type: 'number' },
      { key: 'customName',           label: 'Custom Name',          type: 'text' },
      { key: 'aliases',              label: 'Aliases',              type: 'stringArray' },
      { key: 'autoDeleteMessage',    label: 'Auto Delete Message',  type: 'boolean' },
      { key: 'autoDeleteInvocation', label: 'Auto Delete Invoke',   type: 'boolean' },
      { key: 'autoDeleteReply',      label: 'Auto Delete Reply',    type: 'boolean' }
    ];
  }

  function cmdEntry(title) {
    return { title: title, fields: cmdFields() };
  }

  var SCHEMA = {

    general: {
      title: 'General',
      fields: [
        { key: 'botName',          label: 'Bot Name',           type: 'text' },
        { key: 'botDescription',   label: 'Description',        type: 'text' },
        { key: 'botStatus',        label: 'Status',             type: 'select', options: ['online','idle','dnd','invisible'] },
        { key: 'botActivity',      label: 'Activity',           type: 'text' },
        { key: 'botActivityType',  label: 'Activity Type',      type: 'select', options: ['PLAYING','WATCHING','LISTENING','COMPETING','STREAMING'] },
        { key: 'theme',            label: 'Theme',              type: 'select', options: ['dark','light'] },
        { key: 'accentColor',      label: 'Accent Color',       type: 'color' },
        { key: 'language',         label: 'Language',           type: 'select', options: ['ar','en','ku'] },
        { key: 'maxWarnings',      label: 'Max Warnings',       type: 'number' },
        { key: 'warningExpiry',    label: 'Warning Expiry',     type: 'number' },
        { key: 'maintenanceMode',  label: 'Maintenance Mode',   type: 'boolean' },
        { key: 'debugMode',        label: 'Debug Mode',         type: 'boolean' },
        { key: 'autoUpdate',       label: 'Auto Update',        type: 'boolean' },
        { key: 'version',          label: 'Version',            type: 'text' }
      ]
    },

    welcome: {
      title: 'Welcome',
      fields: [
        { key: 'enabled',          label: 'Enabled',            type: 'boolean' },
        { key: 'channelId',        label: 'Channel',            type: 'channel' },
        { key: 'message',          label: 'Message',            type: 'textarea' },
        { key: 'embed',            label: 'Embed',              type: 'boolean' },
        { key: 'color',            label: 'Color',              type: 'color' },
        { key: 'imageUrl',         label: 'Image URL',          type: 'text' },
        { key: 'thumbnailUrl',     label: 'Thumbnail URL',      type: 'text' },
        { key: 'footer',           label: 'Footer',             type: 'text' },
        { key: 'emoji',            label: 'Emoji',              type: 'text' },
        { key: 'autoDelete',       label: 'Auto Delete',        type: 'boolean' },
        { key: 'autoDeleteDelay',  label: 'Auto Delete Delay',  type: 'number' },
        { key: 'mentionUser',      label: 'Mention User',       type: 'boolean' },
        { key: 'sendDM',           label: 'Send DM',            type: 'boolean' },
        { key: 'dmMessage',        label: 'DM Message',         type: 'textarea' },
        { key: 'roleReward',       label: 'Role Reward',        type: 'role' },
        { key: 'backgroundImage',  label: 'Background Image',   type: 'text' },
        { key: 'font',             label: 'Font',               type: 'text' },
        { key: 'textColor',        label: 'Text Color',         type: 'color' }
      ]
    },

    goodbye: {
      title: 'Goodbye',
      fields: [
        { key: 'enabled',          label: 'Enabled',            type: 'boolean' },
        { key: 'channelId',        label: 'Channel',            type: 'channel' },
        { key: 'message',          label: 'Message',            type: 'textarea' },
        { key: 'embed',            label: 'Embed',              type: 'boolean' },
        { key: 'color',            label: 'Color',              type: 'color' },
        { key: 'imageUrl',         label: 'Image URL',          type: 'text' },
        { key: 'thumbnailUrl',     label: 'Thumbnail URL',      type: 'text' },
        { key: 'footer',           label: 'Footer',             type: 'text' },
        { key: 'emoji',            label: 'Emoji',              type: 'text' },
        { key: 'autoDelete',       label: 'Auto Delete',        type: 'boolean' },
        { key: 'autoDeleteDelay',  label: 'Auto Delete Delay',  type: 'number' },
        { key: 'mentionUser',      label: 'Mention User',       type: 'boolean' },
        { key: 'sendDM',           label: 'Send DM',            type: 'boolean' },
        { key: 'dmMessage',        label: 'DM Message',         type: 'textarea' }
      ]
    },

    moderation: {
      title: 'Moderation',
      fields: [
        { key: 'enabled',              label: 'Enabled',                  type: 'boolean' },
        { key: 'logChannelId',         label: 'Log Channel',              type: 'channel' },
        { key: 'muteRoleId',           label: 'Mute Role',                type: 'role' },
        { key: 'autoDeleteMessages',   label: 'Auto Delete Messages',     type: 'boolean' },
        { key: 'autoDeleteDelay',      label: 'Auto Delete Delay',        type: 'number' },
        { key: 'maxWarnings',          label: 'Max Warnings',             type: 'number' },
        { key: 'warningExpiry',        label: 'Warning Expiry',           type: 'number' },
        { key: 'dmOnPunish',           label: 'DM On Punish',             type: 'boolean' },
        { key: 'dmOnWarn',             label: 'DM On Warn',               type: 'boolean' },
        { key: 'dmOnMute',             label: 'DM On Mute',               type: 'boolean' },
        { key: 'dmOnKick',             label: 'DM On Kick',               type: 'boolean' },
        { key: 'dmOnBan',              label: 'DM On Ban',                type: 'boolean' },
        { key: 'appealSystem',         label: 'Appeal System',            type: 'boolean' },
        { key: 'appealChannelId',      label: 'Appeal Channel',           type: 'channel' },
        { key: 'autoPunish',           label: 'Auto Punish',              type: 'boolean' },
        { key: 'autoPunishThreshold',  label: 'Auto Punish Threshold',    type: 'number' },
        { key: 'autoPunishAction',     label: 'Auto Punish Action',       type: 'select', options: ['timeout','kick','ban'] }
      ]
    },

    tickets: {
      title: 'Tickets',
      fields: [
        { key: 'enabled',           label: 'Enabled',              type: 'boolean' },
        { key: 'categoryId',        label: 'Category',             type: 'channel' },
        { key: 'supportRoleId',     label: 'Support Role',         type: 'role' },
        { key: 'logChannelId',      label: 'Log Channel',          type: 'channel' },
        { key: 'maxTickets',        label: 'Max Tickets',          type: 'number' },
        { key: 'transcripts',       label: 'Transcripts',          type: 'boolean' },
        { key: 'autoClose',         label: 'Auto Close (ms)',      type: 'number' },
        { key: 'closeReason',       label: 'Close Reason',         type: 'text' },
        { key: 'dmOnClose',         label: 'DM On Close',          type: 'boolean' },
        { key: 'ratingSystem',      label: 'Rating System',        type: 'boolean' },
        { key: 'ratingChannelId',   label: 'Rating Channel',       type: 'channel' },
        { key: 'ticketNameFormat',  label: 'Ticket Name Format',   type: 'text' },
        { key: 'welcomeMessage',    label: 'Welcome Message',      type: 'textarea' }
      ]
    },

    giveaways: {
      title: 'Giveaways',
      fields: [
        { key: 'enabled',           label: 'Enabled',                type: 'boolean' },
        { key: 'defaultDuration',   label: 'Default Duration (ms)',  type: 'number' },
        { key: 'defaultWinners',    label: 'Default Winners',        type: 'number' },
        { key: 'requiredRoleId',    label: 'Required Role',          type: 'role' },
        { key: 'requiredLevel',     label: 'Required Level',         type: 'number' },
        { key: 'minAccountAge',     label: 'Min Account Age',        type: 'number' },
        { key: 'requireBoost',      label: 'Require Boost',          type: 'boolean' },
        { key: 'autoDelete',        label: 'Auto Delete',            type: 'boolean' },
        { key: 'rerollEnabled',     label: 'Reroll Enabled',         type: 'boolean' },
        { key: 'maxRerolls',        label: 'Max Rerolls',            type: 'number' },
        { key: 'dmWinners',         label: 'DM Winners',             type: 'boolean' },
        { key: 'bonusEntries',      label: 'Bonus Entries',          type: 'stringArray' },
        { key: 'hostBonus',         label: 'Host Bonus',             type: 'number' },
        { key: 'boosterBonus',      label: 'Booster Bonus',          type: 'number' }
      ]
    },

    colorRoles: {
      title: 'Color Roles',
      fields: [
        { key: 'enabled',         label: 'Enabled',            type: 'boolean' },
        { key: 'channelId',       label: 'Channel',            type: 'channel' },
        { key: 'maxRoles',        label: 'Max Roles',          type: 'number' },
        { key: 'allowMultiple',   label: 'Allow Multiple',     type: 'boolean' },
        { key: 'roles',           label: 'Roles',              type: 'stringArray' },
        { key: 'requireBoost',    label: 'Require Boost',      type: 'boolean' },
        { key: 'requireLevel',    label: 'Require Level',      type: 'number' },
        { key: 'cooldown',        label: 'Cooldown (ms)',      type: 'number' }
      ]
    },

    levels: {
      title: 'Levels',
      fields: [
        { key: 'enabled',            label: 'Enabled',                type: 'boolean' },
        { key: 'channelId',          label: 'Channel',                type: 'channel' },
        { key: 'pointsPerMessage',   label: 'Points Per Message',     type: 'number' },
        { key: 'pointsPerVoice',     label: 'Points Per Voice',       type: 'number' },
        { key: 'cooldown',           label: 'Cooldown (ms)',          type: 'number' },
        { key: 'levelUpChannel',     label: 'Level Up Channel',       type: 'channel' },
        { key: 'levelUpMessage',     label: 'Level Up Message',       type: 'textarea' },
        { key: 'levelUpEmbed',       label: 'Level Up Embed',         type: 'boolean' },
        { key: 'levelUpColor',       label: 'Level Up Color',         type: 'color' },
        { key: 'announceInDM',       label: 'Announce In DM',         type: 'boolean' },
        { key: 'xpPerMessage.min',   label: 'XP Per Message - Min',   type: 'number' },
        { key: 'xpPerMessage.max',   label: 'XP Per Message - Max',   type: 'number' },
        { key: 'maxLevel',           label: 'Max Level',              type: 'number' },
        { key: 'xpMultiplier',       label: 'XP Multiplier',          type: 'number' },
        { key: 'roleRewards',        label: 'Role Rewards',           type: 'stringArray' },
        { key: 'ignoreChannels',     label: 'Ignore Channels',        type: 'stringArray' },
        { key: 'ignoreRoles',        label: 'Ignore Roles',           type: 'stringArray' },
        { key: 'ignoreUsers',        label: 'Ignore Users',           type: 'stringArray' },
        { key: 'voiceXP',            label: 'Voice XP',               type: 'boolean' },
        { key: 'messageXP',          label: 'Message XP',             type: 'boolean' },
        { key: 'streakBonus',        label: 'Streak Bonus',           type: 'boolean' },
        { key: 'streakMultiplier',   label: 'Streak Multiplier',      type: 'number' },
        { key: 'decayEnabled',       label: 'Decay Enabled',          type: 'boolean' },
        { key: 'decayDays',          label: 'Decay Days',             type: 'number' },
        { key: 'decayAmount',        label: 'Decay Amount',           type: 'number' }
      ]
    },

    warns: {
      title: 'Warns',
      fields: [
        { key: 'enabled',          label: 'Enabled',              type: 'boolean' },
        { key: 'autoPunish',       label: 'Auto Punish',          type: 'boolean' },
        { key: 'maxWarns',         label: 'Max Warns',            type: 'number' },
        { key: 'punishment',       label: 'Punishment',           type: 'select', options: ['timeout','kick','ban'] },
        { key: 'logChannelId',     label: 'Log Channel',          type: 'channel' },
        { key: 'dmOnWarn',         label: 'DM On Warn',           type: 'boolean' },
        { key: 'warningExpiry',    label: 'Warning Expiry',       type: 'number' },
        { key: 'appealable',       label: 'Appealable',           type: 'boolean' },
        { key: 'appealChannelId',  label: 'Appeal Channel',       type: 'channel' },
        { key: 'autoDelete',       label: 'Auto Delete',          type: 'boolean' },
        { key: 'warningReasons',   label: 'Warning Reasons',      type: 'stringArray' }
      ]
    },

    autoRole: {
      title: 'Auto Role',
      fields: [
        { key: 'enabled',               label: 'Enabled',                  type: 'boolean' },
        { key: 'roles',                 label: 'Roles',                    type: 'stringArray' },
        { key: 'botRoles',              label: 'Bot Roles',                type: 'stringArray' },
        { key: 'delay',                 label: 'Delay (ms)',               type: 'number' },
        { key: 'ignoreBots',            label: 'Ignore Bots',              type: 'boolean' },
        { key: 'ignoreRoles',           label: 'Ignore Roles',             type: 'stringArray' },
        { key: 'requireVerification',   label: 'Require Verification',     type: 'boolean' },
        { key: 'humanOnly',             label: 'Human Only',               type: 'boolean' },
        { key: 'roleDelay',             label: 'Role Delay (ms)',          type: 'number' }
      ]
    },

    verification: {
      title: 'Verification',
      fields: [
        { key: 'enabled',            label: 'Enabled',              type: 'boolean' },
        { key: 'channelId',          label: 'Channel',              type: 'channel' },
        { key: 'roleId',             label: 'Role',                 type: 'role' },
        { key: 'type',               label: 'Type',                 type: 'select', options: ['button','captcha','reaction'] },
        { key: 'captchaLength',      label: 'Captcha Length',       type: 'number' },
        { key: 'captchaType',        label: 'Captcha Type',         type: 'select', options: ['numbers','letters','mixed'] },
        { key: 'timeout',            label: 'Timeout (ms)',         type: 'number' },
        { key: 'maxAttempts',        label: 'Max Attempts',         type: 'number' },
        { key: 'kickOnFail',         label: 'Kick On Fail',         type: 'boolean' },
        { key: 'logChannelId',       label: 'Log Channel',          type: 'channel' },
        { key: 'welcomeDM',          label: 'Welcome DM',           type: 'boolean' },
        { key: 'welcomeDMMessage',   label: 'Welcome DM Message',   type: 'textarea' },
        { key: 'autoVerify',         label: 'Auto Verify',          type: 'boolean' },
        { key: 'autoVerifyRoles',    label: 'Auto Verify Roles',    type: 'stringArray' },
        { key: 'captchaColors',      label: 'Captcha Colors',       type: 'stringArray' },
        { key: 'captchaLines',       label: 'Captcha Lines',        type: 'number' },
        { key: 'captchaSensitivity', label: 'Captcha Sensitivity',  type: 'number' }
      ]
    },

    reactionRoles: {
      title: 'Reaction Roles',
      fields: [
        { key: 'enabled',               label: 'Enabled',                  type: 'boolean' },
        { key: 'roles',                 label: 'Roles',                    type: 'stringArray' },
        { key: 'maxRolesPerUser',       label: 'Max Roles Per User',       type: 'number' },
        { key: 'requireVerification',   label: 'Require Verification',     type: 'boolean' },
        { key: 'dmOnRole',              label: 'DM On Role',               type: 'boolean' },
        { key: 'autoRemove',            label: 'Auto Remove',              type: 'boolean' },
        { key: 'removeOnUnreact',       label: 'Remove On Unreact',        type: 'boolean' }
      ]
    },

    inviteTracker: {
      title: 'Invite Tracker',
      fields: [
        { key: 'enabled',                  label: 'Enabled',                    type: 'boolean' },
        { key: 'channelId',                label: 'Channel',                    type: 'channel' },
        { key: 'logJoins',                 label: 'Log Joins',                  type: 'boolean' },
        { key: 'logLeaves',                label: 'Log Leaves',                 type: 'boolean' },
        { key: 'trackFake',                label: 'Track Fake',                 type: 'boolean' },
        { key: 'minAccountAge',            label: 'Min Account Age',            type: 'number' },
        { key: 'rewardRoles',              label: 'Reward Roles',               type: 'stringArray' },
        { key: 'leaderboard',              label: 'Leaderboard',                type: 'boolean' },
        { key: 'leaderboardChannelId',     label: 'Leaderboard Channel',        type: 'channel' },
        { key: 'inviteRewards',            label: 'Invite Rewards',             type: 'stringArray' },
        { key: 'fakeInviteThreshold',      label: 'Fake Invite Threshold',      type: 'number' },
        { key: 'fakeInvitePunishment',     label: 'Fake Invite Punishment',     type: 'select', options: ['kick','ban'] }
      ]
    },

    securityLimits: {
      title: 'Security Limits',
      fields: [
        { key: 'ban.enabled',                    label: 'Ban - Enabled',                type: 'boolean' },
        { key: 'ban.max',                        label: 'Ban - Max',                    type: 'number' },
        { key: 'ban.punishment',                 label: 'Ban - Punishment',             type: 'select', options: ['kick','ban'] },
        { key: 'kick.enabled',                   label: 'Kick - Enabled',               type: 'boolean' },
        { key: 'kick.max',                       label: 'Kick - Max',                   type: 'number' },
        { key: 'kick.punishment',                label: 'Kick - Punishment',            type: 'select', options: ['kick','ban'] },
        { key: 'channelCreate.enabled',          label: 'Channel Create - Enabled',     type: 'boolean' },
        { key: 'channelCreate.max',              label: 'Channel Create - Max',         type: 'number' },
        { key: 'channelCreate.punishment',       label: 'Channel Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelDelete.enabled',          label: 'Channel Delete - Enabled',     type: 'boolean' },
        { key: 'channelDelete.max',              label: 'Channel Delete - Max',         type: 'number' },
        { key: 'channelDelete.punishment',       label: 'Channel Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelUpdate.enabled',          label: 'Channel Update - Enabled',     type: 'boolean' },
        { key: 'channelUpdate.max',              label: 'Channel Update - Max',         type: 'number' },
        { key: 'channelUpdate.punishment',       label: 'Channel Update - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelPermissionsUpdate.enabled', label: 'Channel Perms - Enabled',    type: 'boolean' },
        { key: 'channelPermissionsUpdate.max',   label: 'Channel Perms - Max',          type: 'number' },
        { key: 'channelPermissionsUpdate.punishment', label: 'Channel Perms - Punishment', type: 'select', options: ['kick','ban'] },
        { key: 'mention.enabled',                label: 'Mention - Enabled',            type: 'boolean' },
        { key: 'mention.max',                    label: 'Mention - Max',                type: 'number' },
        { key: 'mention.punishment',             label: 'Mention - Punishment',         type: 'select', options: ['kick','ban'] },
        { key: 'botAdd.enabled',                 label: 'Bot Add - Enabled',            type: 'boolean' },
        { key: 'botAdd.max',                     label: 'Bot Add - Max',                type: 'number' },
        { key: 'botAdd.punishment',              label: 'Bot Add - Punishment',         type: 'select', options: ['kick','ban'] },
        { key: 'prune.enabled',                  label: 'Prune - Enabled',              type: 'boolean' },
        { key: 'prune.max',                      label: 'Prune - Max',                  type: 'number' },
        { key: 'prune.punishment',               label: 'Prune - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'vanityChange.enabled',           label: 'Vanity Change - Enabled',      type: 'boolean' },
        { key: 'vanityChange.max',               label: 'Vanity Change - Max',          type: 'number' },
        { key: 'vanityChange.punishment',        label: 'Vanity Change - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'serverRename.enabled',           label: 'Server Rename - Enabled',      type: 'boolean' },
        { key: 'serverRename.max',               label: 'Server Rename - Max',          type: 'number' },
        { key: 'serverRename.punishment',        label: 'Server Rename - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'serverIconChange.enabled',       label: 'Server Icon - Enabled',        type: 'boolean' },
        { key: 'serverIconChange.max',           label: 'Server Icon - Max',            type: 'number' },
        { key: 'serverIconChange.punishment',    label: 'Server Icon - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'channelRename.enabled',          label: 'Channel Rename - Enabled',     type: 'boolean' },
        { key: 'channelRename.max',              label: 'Channel Rename - Max',         type: 'number' },
        { key: 'channelRename.punishment',       label: 'Channel Rename - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelTopicChange.enabled',     label: 'Channel Topic - Enabled',      type: 'boolean' },
        { key: 'channelTopicChange.max',         label: 'Channel Topic - Max',          type: 'number' },
        { key: 'channelTopicChange.punishment',  label: 'Channel Topic - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'emojiCreate.enabled',            label: 'Emoji Create - Enabled',       type: 'boolean' },
        { key: 'emojiCreate.max',                label: 'Emoji Create - Max',           type: 'number' },
        { key: 'emojiCreate.punishment',         label: 'Emoji Create - Punishment',    type: 'select', options: ['kick','ban'] },
        { key: 'emojiDelete.enabled',            label: 'Emoji Delete - Enabled',       type: 'boolean' },
        { key: 'emojiDelete.max',                label: 'Emoji Delete - Max',           type: 'number' },
        { key: 'emojiDelete.punishment',         label: 'Emoji Delete - Punishment',    type: 'select', options: ['kick','ban'] },
        { key: 'inviteDelete.enabled',           label: 'Invite Delete - Enabled',      type: 'boolean' },
        { key: 'inviteDelete.max',               label: 'Invite Delete - Max',          type: 'number' },
        { key: 'inviteDelete.punishment',        label: 'Invite Delete - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'inviteLink.enabled',             label: 'Invite Link - Enabled',        type: 'boolean' },
        { key: 'inviteLink.max',                 label: 'Invite Link - Max',            type: 'number' },
        { key: 'inviteLink.punishment',          label: 'Invite Link - Punishment',     type: 'select', options: ['detect','kick','ban'] },
        { key: 'ghostPing.enabled',              label: 'Ghost Ping - Enabled',         type: 'boolean' },
        { key: 'ghostPing.max',                  label: 'Ghost Ping - Max',             type: 'number' },
        { key: 'ghostPing.punishment',           label: 'Ghost Ping - Punishment',      type: 'select', options: ['detect','kick','ban'] },
        { key: 'voiceSpam.enabled',              label: 'Voice Spam - Enabled',         type: 'boolean' },
        { key: 'voiceSpam.max',                  label: 'Voice Spam - Max',             type: 'number' },
        { key: 'voiceSpam.punishment',           label: 'Voice Spam - Punishment',      type: 'select', options: ['kick','ban'] },
        { key: 'voiceConnectSpam.enabled',       label: 'Voice Connect - Enabled',      type: 'boolean' },
        { key: 'voiceConnectSpam.max',           label: 'Voice Connect - Max',          type: 'number' },
        { key: 'voiceConnectSpam.punishment',    label: 'Voice Connect - Punishment',   type: 'select', options: ['timeout','kick','ban'] },
        { key: 'webhookCreate.enabled',          label: 'Webhook Create - Enabled',     type: 'boolean' },
        { key: 'webhookCreate.max',              label: 'Webhook Create - Max',         type: 'number' },
        { key: 'webhookCreate.punishment',       label: 'Webhook Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'webhookDelete.enabled',          label: 'Webhook Delete - Enabled',     type: 'boolean' },
        { key: 'webhookDelete.max',              label: 'Webhook Delete - Max',         type: 'number' },
        { key: 'webhookDelete.punishment',       label: 'Webhook Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'webhookUpdate.enabled',          label: 'Webhook Update - Enabled',     type: 'boolean' },
        { key: 'webhookUpdate.max',              label: 'Webhook Update - Max',         type: 'number' },
        { key: 'webhookUpdate.punishment',       label: 'Webhook Update - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'threadCreate.enabled',           label: 'Thread Create - Enabled',      type: 'boolean' },
        { key: 'threadCreate.max',               label: 'Thread Create - Max',          type: 'number' },
        { key: 'threadCreate.punishment',        label: 'Thread Create - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'threadDelete.enabled',           label: 'Thread Delete - Enabled',      type: 'boolean' },
        { key: 'threadDelete.max',               label: 'Thread Delete - Max',          type: 'number' },
        { key: 'threadDelete.punishment',        label: 'Thread Delete - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'stickerCreate.enabled',          label: 'Sticker Create - Enabled',     type: 'boolean' },
        { key: 'stickerCreate.max',              label: 'Sticker Create - Max',         type: 'number' },
        { key: 'stickerCreate.punishment',       label: 'Sticker Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'stickerDelete.enabled',          label: 'Sticker Delete - Enabled',     type: 'boolean' },
        { key: 'stickerDelete.max',              label: 'Sticker Delete - Max',         type: 'number' },
        { key: 'stickerDelete.punishment',       label: 'Sticker Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'roleCreate.enabled',             label: 'Role Create - Enabled',        type: 'boolean' },
        { key: 'roleCreate.max',                 label: 'Role Create - Max',            type: 'number' },
        { key: 'roleCreate.punishment',          label: 'Role Create - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleDelete.enabled',             label: 'Role Delete - Enabled',        type: 'boolean' },
        { key: 'roleDelete.max',                 label: 'Role Delete - Max',            type: 'number' },
        { key: 'roleDelete.punishment',          label: 'Role Delete - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleRename.enabled',             label: 'Role Rename - Enabled',        type: 'boolean' },
        { key: 'roleRename.max',                 label: 'Role Rename - Max',            type: 'number' },
        { key: 'roleRename.punishment',          label: 'Role Rename - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleUpdate.enabled',             label: 'Role Update - Enabled',        type: 'boolean' },
        { key: 'roleUpdate.max',                 label: 'Role Update - Max',            type: 'number' },
        { key: 'roleUpdate.punishment',          label: 'Role Update - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'dangerousRolePermissions.enabled', label: 'Dangerous Role Perms - Enabled', type: 'boolean' },
        { key: 'dangerousRolePermissions.max',   label: 'Dangerous Role Perms - Max',   type: 'number' },
        { key: 'dangerousRolePermissions.punishment', label: 'Dangerous Role Perms - Punishment', type: 'select', options: ['kick','ban'] },
        { key: 'dangerousRoleAdd.enabled',       label: 'Dangerous Role Add - Enabled', type: 'boolean' },
        { key: 'dangerousRoleAdd.max',           label: 'Dangerous Role Add - Max',     type: 'number' },
        { key: 'dangerousRoleAdd.punishment',    label: 'Dangerous Role Add - Punishment', type: 'select', options: ['kick','ban'] }
      ]
    },

    antiRaid: {
      title: 'Anti Raid',
      fields: [
        { key: 'enabled',                label: 'Enabled',                     type: 'boolean' },
        { key: 'minAccountAge',          label: 'Min Account Age',             type: 'number' },
        { key: 'checkAvatar',            label: 'Check Avatar',                type: 'boolean' },
        { key: 'checkUsername',          label: 'Check Username',              type: 'boolean' },
        { key: 'joinRate',               label: 'Join Rate',                   type: 'number' },
        { key: 'timeWindow',             label: 'Time Window (ms)',            type: 'number' },
        { key: 'punishment',             label: 'Punishment',                  type: 'select', options: ['kick','ban'] },
        { key: 'ignoredUsers',           label: 'Ignored Users',               type: 'stringArray' },
        { key: 'ignoredRoles',           label: 'Ignored Roles',               type: 'stringArray' },
        { key: 'autoLockdown',           label: 'Auto Lockdown',               type: 'boolean' },
        { key: 'lockdownDuration',       label: 'Lockdown Duration (ms)',      type: 'number' },
        { key: 'alertChannel',           label: 'Alert Channel',               type: 'channel' },
        { key: 'whitelistBots',          label: 'Whitelist Bots',              type: 'stringArray' },
        { key: 'maxJoinsPerUser',        label: 'Max Joins Per User',          type: 'number' },
        { key: 'duplicateNameCheck',     label: 'Duplicate Name Check',        type: 'boolean' },
        { key: 'duplicateAvatarCheck',   label: 'Duplicate Avatar Check',      type: 'boolean' },
        { key: 'autoBan',                label: 'Auto Ban',                    type: 'boolean' },
        { key: 'autoBanThreshold',       label: 'Auto Ban Threshold',          type: 'number' }
      ]
    },

    autoMod: {
      title: 'Auto Mod',
      fields: [
        { key: 'spam.enabled',            label: 'Spam - Enabled',           type: 'boolean' },
        { key: 'spam.threshold',          label: 'Spam - Threshold',         type: 'number' },
        { key: 'spam.window',             label: 'Spam - Window (ms)',       type: 'number' },
        { key: 'spam.punishment',         label: 'Spam - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'invites.enabled',         label: 'Invites - Enabled',        type: 'boolean' },
        { key: 'invites.punishment',      label: 'Invites - Punishment',     type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'links.enabled',           label: 'Links - Enabled',          type: 'boolean' },
        { key: 'links.allowedDomains',    label: 'Links - Allowed Domains',  type: 'stringArray' },
        { key: 'links.punishment',        label: 'Links - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'phishing.enabled',        label: 'Phishing - Enabled',       type: 'boolean' },
        { key: 'phishing.punishment',     label: 'Phishing - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'bannedWords.enabled',     label: 'Banned Words - Enabled',   type: 'boolean' },
        { key: 'bannedWords.words',       label: 'Banned Words - List',      type: 'stringArray' },
        { key: 'bannedWords.punishment',  label: 'Banned Words - Punishment',type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'caps.enabled',            label: 'Caps - Enabled',           type: 'boolean' },
        { key: 'caps.max',                label: 'Caps - Max',               type: 'number' },
        { key: 'caps.punishment',         label: 'Caps - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'emoji.enabled',           label: 'Emoji - Enabled',          type: 'boolean' },
        { key: 'emoji.max',               label: 'Emoji - Max',              type: 'number' },
        { key: 'emoji.punishment',        label: 'Emoji - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'mentions.enabled',        label: 'Mentions - Enabled',       type: 'boolean' },
        { key: 'mentions.max',            label: 'Mentions - Max',           type: 'number' },
        { key: 'mentions.punishment',     label: 'Mentions - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'duplicates.enabled',      label: 'Duplicates - Enabled',     type: 'boolean' },
        { key: 'duplicates.threshold',    label: 'Duplicates - Threshold',   type: 'number' },
        { key: 'duplicates.window',       label: 'Duplicates - Window (ms)', type: 'number' },
        { key: 'duplicates.punishment',   label: 'Duplicates - Punishment',  type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'zalgo.enabled',           label: 'Zalgo - Enabled',          type: 'boolean' },
        { key: 'zalgo.punishment',        label: 'Zalgo - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'charRepeat.enabled',      label: 'Char Repeat - Enabled',    type: 'boolean' },
        { key: 'charRepeat.max',          label: 'Char Repeat - Max',        type: 'number' },
        { key: 'charRepeat.punishment',   label: 'Char Repeat - Punishment', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'personalInfo.enabled',    label: 'Personal Info - Enabled',  type: 'boolean' },
        { key: 'personalInfo.punishment', label: 'Personal Info - Punish',   type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'massMention.enabled',     label: 'Mass Mention - Enabled',   type: 'boolean' },
        { key: 'massMention.punishment',  label: 'Mass Mention - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'stickerSpam.enabled',     label: 'Sticker Spam - Enabled',   type: 'boolean' },
        { key: 'stickerSpam.max',         label: 'Sticker Spam - Max',       type: 'number' },
        { key: 'stickerSpam.punishment',  label: 'Sticker Spam - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'attachmentSpam.enabled',  label: 'Attachment Spam - Enabled',type: 'boolean' },
        { key: 'attachmentSpam.maxJoins', label: 'Attachment Spam - Max',    type: 'number' },
        { key: 'attachmentSpam.window',   label: 'Attachment Spam - Window', type: 'number' },
        { key: 'attachmentSpam.punishment', label: 'Attachment Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceSpam.enabled',       label: 'Voice Spam - Enabled',     type: 'boolean' },
        { key: 'voiceSpam.maxJoins',      label: 'Voice Spam - Max',         type: 'number' },
        { key: 'voiceSpam.window',        label: 'Voice Spam - Window',      type: 'number' },
        { key: 'voiceSpam.punishment',    label: 'Voice Spam - Punish',      type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceConnectSpam.enabled', label: 'Voice Connect - Enabled', type: 'boolean' },
        { key: 'voiceConnectSpam.maxConnects', label: 'Voice Connect - Max', type: 'number' },
        { key: 'voiceConnectSpam.window', label: 'Voice Connect - Window',   type: 'number' },
        { key: 'voiceConnectSpam.punishment', label: 'Voice Connect - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceMuteSpam.enabled',   label: 'Voice Mute Spam - Enabled',type: 'boolean' },
        { key: 'voiceMuteSpam.max',       label: 'Voice Mute Spam - Max',    type: 'number' },
        { key: 'voiceMuteSpam.punishment',label: 'Voice Mute Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceDeafenSpam.enabled', label: 'Voice Deafen Spam - Enabled', type: 'boolean' },
        { key: 'voiceDeafenSpam.max',     label: 'Voice Deafen Spam - Max',  type: 'number' },
        { key: 'voiceDeafenSpam.punishment', label: 'Voice Deafen Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceJoinLeaveSpam.enabled', label: 'Voice Join/Leave - Enabled', type: 'boolean' },
        { key: 'voiceJoinLeaveSpam.max',  label: 'Voice Join/Leave - Max',   type: 'number' },
        { key: 'voiceJoinLeaveSpam.punishment', label: 'Voice Join/Leave - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceMoveSpam.enabled',   label: 'Voice Move Spam - Enabled',type: 'boolean' },
        { key: 'voiceMoveSpam.max',       label: 'Voice Move Spam - Max',    type: 'number' },
        { key: 'voiceMoveSpam.punishment',label: 'Voice Move Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'mentionEveryone.enabled', label: 'Mention Everyone - Enabled', type: 'boolean' },
        { key: 'mentionEveryone.punishment', label: 'Mention Everyone - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'nsfwContent.enabled',     label: 'NSFW - Enabled',           type: 'boolean' },
        { key: 'nsfwContent.punishment',  label: 'NSFW - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'toxicWords.enabled',      label: 'Toxic Words - Enabled',    type: 'boolean' },
        { key: 'toxicWords.words',        label: 'Toxic Words - List',       type: 'stringArray' },
        { key: 'toxicWords.punishment',   label: 'Toxic Words - Punish',     type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'racialSlurs.enabled',     label: 'Racial Slurs - Enabled',   type: 'boolean' },
        { key: 'racialSlurs.words',       label: 'Racial Slurs - List',      type: 'stringArray' },
        { key: 'racialSlurs.punishment',  label: 'Racial Slurs - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'selfBot.enabled',         label: 'Self Bot - Enabled',       type: 'boolean' },
        { key: 'selfBot.punishment',      label: 'Self Bot - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'tokenGrabber.enabled',    label: 'Token Grabber - Enabled',  type: 'boolean' },
        { key: 'tokenGrabber.punishment', label: 'Token Grabber - Punish',   type: 'select', options: ['delete','timeout','kick','ban'] }
      ]
    },

    beastMode: {
      title: 'Beast Mode',
      fields: [
        { key: 'enabled',                       label: 'Enabled',                    type: 'boolean' },
        { key: 'actions.ban.enabled',           label: 'Ban - Enabled',              type: 'boolean' },
        { key: 'actions.ban.max',               label: 'Ban - Max',                  type: 'number' },
        { key: 'actions.ban.punishment',        label: 'Ban - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'actions.kick.enabled',          label: 'Kick - Enabled',             type: 'boolean' },
        { key: 'actions.kick.max',              label: 'Kick - Max',                 type: 'number' },
        { key: 'actions.kick.punishment',       label: 'Kick - Punishment',          type: 'select', options: ['kick','ban'] },
        { key: 'actions.channelCreate.enabled', label: 'Channel Create - Enabled',   type: 'boolean' },
        { key: 'actions.channelCreate.max',     label: 'Channel Create - Max',       type: 'number' },
        { key: 'actions.channelCreate.punishment', label: 'Channel Create - Punish', type: 'select', options: ['kick','ban'] },
        { key: 'actions.channelDelete.enabled', label: 'Channel Delete - Enabled',   type: 'boolean' },
        { key: 'actions.channelDelete.max',     label: 'Channel Delete - Max',       type: 'number' },
        { key: 'actions.channelDelete.punishment', label: 'Channel Delete - Punish', type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleCreate.enabled',    label: 'Role Create - Enabled',      type: 'boolean' },
        { key: 'actions.roleCreate.max',        label: 'Role Create - Max',          type: 'number' },
        { key: 'actions.roleCreate.punishment', label: 'Role Create - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleDelete.enabled',    label: 'Role Delete - Enabled',      type: 'boolean' },
        { key: 'actions.roleDelete.max',        label: 'Role Delete - Max',          type: 'number' },
        { key: 'actions.roleDelete.punishment', label: 'Role Delete - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleRename.enabled',    label: 'Role Rename - Enabled',      type: 'boolean' },
        { key: 'actions.roleRename.max',        label: 'Role Rename - Max',          type: 'number' },
        { key: 'actions.roleRename.punishment', label: 'Role Rename - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleUpdate.enabled',    label: 'Role Update - Enabled',      type: 'boolean' },
        { key: 'actions.roleUpdate.max',        label: 'Role Update - Max',          type: 'number' },
        { key: 'actions.roleUpdate.punishment', label: 'Role Update - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.mention.enabled',       label: 'Mention - Enabled',          type: 'boolean' },
        { key: 'actions.mention.max',           label: 'Mention - Max',              type: 'number' },
        { key: 'actions.mention.punishment',    label: 'Mention - Punish',           type: 'select', options: ['kick','ban'] },
        { key: 'actions.botAdd.enabled',        label: 'Bot Add - Enabled',          type: 'boolean' },
        { key: 'actions.botAdd.max',            label: 'Bot Add - Max',              type: 'number' },
        { key: 'actions.botAdd.punishment',     label: 'Bot Add - Punish',           type: 'select', options: ['kick','ban'] },
        { key: 'autoTrigger',                   label: 'Auto Trigger',               type: 'boolean' },
        { key: 'triggerThreshold',              label: 'Trigger Threshold',          type: 'number' },
        { key: 'alertAll',                      label: 'Alert All',                  type: 'boolean' },
        { key: 'autoLockdown',                  label: 'Auto Lockdown',              type: 'boolean' }
      ]
    },

    roleLimits: {
      title: 'Role Limits',
      fields: [
        { key: 'ban.enabled',             label: 'Ban - Enabled',              type: 'boolean' },
        { key: 'ban.max',                 label: 'Ban - Max',                  type: 'number' },
        { key: 'ban.punishment',          label: 'Ban - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'kick.enabled',            label: 'Kick - Enabled',             type: 'boolean' },
        { key: 'kick.max',                label: 'Kick - Max',                 type: 'number' },
        { key: 'kick.punishment',         label: 'Kick - Punishment',          type: 'select', options: ['kick','ban'] },
        { key: 'channelCreate.enabled',   label: 'Channel Create - Enabled',   type: 'boolean' },
        { key: 'channelCreate.max',       label: 'Channel Create - Max',       type: 'number' },
        { key: 'channelCreate.punishment', label: 'Channel Create - Punish',   type: 'select', options: ['kick','ban'] },
        { key: 'channelDelete.enabled',   label: 'Channel Delete - Enabled',   type: 'boolean' },
        { key: 'channelDelete.max',       label: 'Channel Delete - Max',       type: 'number' },
        { key: 'channelDelete.punishment', label: 'Channel Delete - Punish',   type: 'select', options: ['kick','ban'] },
        { key: 'roleCreate.enabled',      label: 'Role Create - Enabled',      type: 'boolean' },
        { key: 'roleCreate.max',          label: 'Role Create - Max',          type: 'number' },
        { key: 'roleCreate.punishment',   label: 'Role Create - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleDelete.enabled',      label: 'Role Delete - Enabled',      type: 'boolean' },
        { key: 'roleDelete.max',          label: 'Role Delete - Max',          type: 'number' },
        { key: 'roleDelete.punishment',   label: 'Role Delete - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleRename.enabled',      label: 'Role Rename - Enabled',      type: 'boolean' },
        { key: 'roleRename.max',          label: 'Role Rename - Max',          type: 'number' },
        { key: 'roleRename.punishment',   label: 'Role Rename - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleUpdate.enabled',      label: 'Role Update - Enabled',      type: 'boolean' },
        { key: 'roleUpdate.max',          label: 'Role Update - Max',          type: 'number' },
        { key: 'roleUpdate.punishment',   label: 'Role Update - Punish',       type: 'select', options: ['kick','ban'] }
      ]
    },

    antiPhishing: {
      title: 'Anti Phishing',
      fields: [
        { key: 'enabled',             label: 'Enabled',              type: 'boolean' },
        { key: 'punishment',          label: 'Punishment',           type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'whitelistDomains',    label: 'Whitelist Domains',    type: 'stringArray' },
        { key: 'checkLinks',          label: 'Check Links',          type: 'boolean' },
        { key: 'checkAttachments',    label: 'Check Attachments',    type: 'boolean' },
        { key: 'alertChannel',        label: 'Alert Channel',        type: 'channel' }
      ]
    },

    antiToken: {
      title: 'Anti Token',
      fields: [
        { key: 'enabled',      label: 'Enabled',          type: 'boolean' },
        { key: 'punishment',   label: 'Punishment',       type: 'select', options: ['delete','kick','ban'] },
        { key: 'alertChannel', label: 'Alert Channel',    type: 'channel' }
      ]
    },

    antiScam: {
      title: 'Anti Scam',
      fields: [
        { key: 'enabled',        label: 'Enabled',           type: 'boolean' },
        { key: 'punishment',     label: 'Punishment',        type: 'select', options: ['delete','kick','ban'] },
        { key: 'scamLinks',      label: 'Scam Links',        type: 'stringArray' },
        { key: 'checkDMs',       label: 'Check DMs',         type: 'boolean' },
        { key: 'checkChannels',  label: 'Check Channels',    type: 'boolean' },
        { key: 'alertChannel',   label: 'Alert Channel',     type: 'channel' }
      ]
    },

    autoLockdown: {
      title: 'Auto Lockdown',
      fields: [
        { key: 'enabled',         label: 'Enabled',               type: 'boolean' },
        { key: 'triggerRate',     label: 'Trigger Rate',          type: 'number' },
        { key: 'timeWindow',      label: 'Time Window (ms)',      type: 'number' },
        { key: 'duration',        label: 'Duration (ms)',         type: 'number' },
        { key: 'alertChannel',    label: 'Alert Channel',         type: 'channel' },
        { key: 'lockChannels',    label: 'Lock Channels',         type: 'boolean' },
        { key: 'lockRoles',       label: 'Lock Roles',            type: 'boolean' },
        { key: 'notifyOwner',     label: 'Notify Owner',          type: 'boolean' }
      ]
    },

    autoBan: {
      title: 'Auto Ban',
      fields: [
        { key: 'enabled',      label: 'Enabled',      type: 'boolean' },
        { key: 'threshold',    label: 'Threshold',    type: 'number' },
        { key: 'punishment',   label: 'Punishment',   type: 'select', options: ['delete','timeout','kick','ban'] }
      ]
    },

    securityLimits: {
      title: 'Security Limits',
      fields: [
        { key: 'ban.enabled',                    label: 'Ban - Enabled',                type: 'boolean' },
        { key: 'ban.max',                        label: 'Ban - Max',                    type: 'number' },
        { key: 'ban.punishment',                 label: 'Ban - Punishment',             type: 'select', options: ['kick','ban'] },
        { key: 'kick.enabled',                   label: 'Kick - Enabled',               type: 'boolean' },
        { key: 'kick.max',                       label: 'Kick - Max',                   type: 'number' },
        { key: 'kick.punishment',                label: 'Kick - Punishment',            type: 'select', options: ['kick','ban'] },
        { key: 'channelCreate.enabled',          label: 'Channel Create - Enabled',     type: 'boolean' },
        { key: 'channelCreate.max',              label: 'Channel Create - Max',         type: 'number' },
        { key: 'channelCreate.punishment',       label: 'Channel Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelDelete.enabled',          label: 'Channel Delete - Enabled',     type: 'boolean' },
        { key: 'channelDelete.max',              label: 'Channel Delete - Max',         type: 'number' },
        { key: 'channelDelete.punishment',       label: 'Channel Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelUpdate.enabled',          label: 'Channel Update - Enabled',     type: 'boolean' },
        { key: 'channelUpdate.max',              label: 'Channel Update - Max',         type: 'number' },
        { key: 'channelUpdate.punishment',       label: 'Channel Update - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelPermissionsUpdate.enabled', label: 'Channel Perms - Enabled',    type: 'boolean' },
        { key: 'channelPermissionsUpdate.max',   label: 'Channel Perms - Max',          type: 'number' },
        { key: 'channelPermissionsUpdate.punishment', label: 'Channel Perms - Punishment', type: 'select', options: ['kick','ban'] },
        { key: 'mention.enabled',                label: 'Mention - Enabled',            type: 'boolean' },
        { key: 'mention.max',                    label: 'Mention - Max',                type: 'number' },
        { key: 'mention.punishment',             label: 'Mention - Punishment',         type: 'select', options: ['kick','ban'] },
        { key: 'botAdd.enabled',                 label: 'Bot Add - Enabled',            type: 'boolean' },
        { key: 'botAdd.max',                     label: 'Bot Add - Max',                type: 'number' },
        { key: 'botAdd.punishment',              label: 'Bot Add - Punishment',         type: 'select', options: ['kick','ban'] },
        { key: 'prune.enabled',                  label: 'Prune - Enabled',              type: 'boolean' },
        { key: 'prune.max',                      label: 'Prune - Max',                  type: 'number' },
        { key: 'prune.punishment',               label: 'Prune - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'vanityChange.enabled',           label: 'Vanity Change - Enabled',      type: 'boolean' },
        { key: 'vanityChange.max',               label: 'Vanity Change - Max',          type: 'number' },
        { key: 'vanityChange.punishment',        label: 'Vanity Change - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'serverRename.enabled',           label: 'Server Rename - Enabled',      type: 'boolean' },
        { key: 'serverRename.max',               label: 'Server Rename - Max',          type: 'number' },
        { key: 'serverRename.punishment',        label: 'Server Rename - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'serverIconChange.enabled',       label: 'Server Icon - Enabled',        type: 'boolean' },
        { key: 'serverIconChange.max',           label: 'Server Icon - Max',            type: 'number' },
        { key: 'serverIconChange.punishment',    label: 'Server Icon - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'channelRename.enabled',          label: 'Channel Rename - Enabled',     type: 'boolean' },
        { key: 'channelRename.max',              label: 'Channel Rename - Max',         type: 'number' },
        { key: 'channelRename.punishment',       label: 'Channel Rename - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'channelTopicChange.enabled',     label: 'Channel Topic - Enabled',      type: 'boolean' },
        { key: 'channelTopicChange.max',         label: 'Channel Topic - Max',          type: 'number' },
        { key: 'channelTopicChange.punishment',  label: 'Channel Topic - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'emojiCreate.enabled',            label: 'Emoji Create - Enabled',       type: 'boolean' },
        { key: 'emojiCreate.max',                label: 'Emoji Create - Max',           type: 'number' },
        { key: 'emojiCreate.punishment',         label: 'Emoji Create - Punishment',    type: 'select', options: ['kick','ban'] },
        { key: 'emojiDelete.enabled',            label: 'Emoji Delete - Enabled',       type: 'boolean' },
        { key: 'emojiDelete.max',                label: 'Emoji Delete - Max',           type: 'number' },
        { key: 'emojiDelete.punishment',         label: 'Emoji Delete - Punishment',    type: 'select', options: ['kick','ban'] },
        { key: 'inviteDelete.enabled',           label: 'Invite Delete - Enabled',      type: 'boolean' },
        { key: 'inviteDelete.max',               label: 'Invite Delete - Max',          type: 'number' },
        { key: 'inviteDelete.punishment',        label: 'Invite Delete - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'inviteLink.enabled',             label: 'Invite Link - Enabled',        type: 'boolean' },
        { key: 'inviteLink.max',                 label: 'Invite Link - Max',            type: 'number' },
        { key: 'inviteLink.punishment',          label: 'Invite Link - Punishment',     type: 'select', options: ['detect','kick','ban'] },
        { key: 'ghostPing.enabled',              label: 'Ghost Ping - Enabled',         type: 'boolean' },
        { key: 'ghostPing.max',                  label: 'Ghost Ping - Max',             type: 'number' },
        { key: 'ghostPing.punishment',           label: 'Ghost Ping - Punishment',      type: 'select', options: ['detect','kick','ban'] },
        { key: 'voiceSpam.enabled',              label: 'Voice Spam - Enabled',         type: 'boolean' },
        { key: 'voiceSpam.max',                  label: 'Voice Spam - Max',             type: 'number' },
        { key: 'voiceSpam.punishment',           label: 'Voice Spam - Punishment',      type: 'select', options: ['kick','ban'] },
        { key: 'voiceConnectSpam.enabled',       label: 'Voice Connect - Enabled',      type: 'boolean' },
        { key: 'voiceConnectSpam.max',           label: 'Voice Connect - Max',          type: 'number' },
        { key: 'voiceConnectSpam.punishment',    label: 'Voice Connect - Punishment',   type: 'select', options: ['timeout','kick','ban'] },
        { key: 'webhookCreate.enabled',          label: 'Webhook Create - Enabled',     type: 'boolean' },
        { key: 'webhookCreate.max',              label: 'Webhook Create - Max',         type: 'number' },
        { key: 'webhookCreate.punishment',       label: 'Webhook Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'webhookDelete.enabled',          label: 'Webhook Delete - Enabled',     type: 'boolean' },
        { key: 'webhookDelete.max',              label: 'Webhook Delete - Max',         type: 'number' },
        { key: 'webhookDelete.punishment',       label: 'Webhook Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'webhookUpdate.enabled',          label: 'Webhook Update - Enabled',     type: 'boolean' },
        { key: 'webhookUpdate.max',              label: 'Webhook Update - Max',         type: 'number' },
        { key: 'webhookUpdate.punishment',       label: 'Webhook Update - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'threadCreate.enabled',           label: 'Thread Create - Enabled',      type: 'boolean' },
        { key: 'threadCreate.max',               label: 'Thread Create - Max',          type: 'number' },
        { key: 'threadCreate.punishment',        label: 'Thread Create - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'threadDelete.enabled',           label: 'Thread Delete - Enabled',      type: 'boolean' },
        { key: 'threadDelete.max',               label: 'Thread Delete - Max',          type: 'number' },
        { key: 'threadDelete.punishment',        label: 'Thread Delete - Punishment',   type: 'select', options: ['kick','ban'] },
        { key: 'stickerCreate.enabled',          label: 'Sticker Create - Enabled',     type: 'boolean' },
        { key: 'stickerCreate.max',              label: 'Sticker Create - Max',         type: 'number' },
        { key: 'stickerCreate.punishment',       label: 'Sticker Create - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'stickerDelete.enabled',          label: 'Sticker Delete - Enabled',     type: 'boolean' },
        { key: 'stickerDelete.max',              label: 'Sticker Delete - Max',         type: 'number' },
        { key: 'stickerDelete.punishment',       label: 'Sticker Delete - Punishment',  type: 'select', options: ['kick','ban'] },
        { key: 'roleCreate.enabled',             label: 'Role Create - Enabled',        type: 'boolean' },
        { key: 'roleCreate.max',                 label: 'Role Create - Max',            type: 'number' },
        { key: 'roleCreate.punishment',          label: 'Role Create - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleDelete.enabled',             label: 'Role Delete - Enabled',        type: 'boolean' },
        { key: 'roleDelete.max',                 label: 'Role Delete - Max',            type: 'number' },
        { key: 'roleDelete.punishment',          label: 'Role Delete - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleRename.enabled',             label: 'Role Rename - Enabled',        type: 'boolean' },
        { key: 'roleRename.max',                 label: 'Role Rename - Max',            type: 'number' },
        { key: 'roleRename.punishment',          label: 'Role Rename - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'roleUpdate.enabled',             label: 'Role Update - Enabled',        type: 'boolean' },
        { key: 'roleUpdate.max',                 label: 'Role Update - Max',            type: 'number' },
        { key: 'roleUpdate.punishment',          label: 'Role Update - Punishment',     type: 'select', options: ['kick','ban'] },
        { key: 'dangerousRolePermissions.enabled', label: 'Dangerous Role Perms - Enabled', type: 'boolean' },
        { key: 'dangerousRolePermissions.max',   label: 'Dangerous Role Perms - Max',   type: 'number' },
        { key: 'dangerousRolePermissions.punishment', label: 'Dangerous Role Perms - Punishment', type: 'select', options: ['kick','ban'] },
        { key: 'dangerousRoleAdd.enabled',       label: 'Dangerous Role Add - Enabled', type: 'boolean' },
        { key: 'dangerousRoleAdd.max',           label: 'Dangerous Role Add - Max',     type: 'number' },
        { key: 'dangerousRoleAdd.punishment',    label: 'Dangerous Role Add - Punishment', type: 'select', options: ['kick','ban'] }
      ]
    },

    antiRaid: {
      title: 'Anti Raid',
      fields: [
        { key: 'enabled',                label: 'Enabled',                     type: 'boolean' },
        { key: 'minAccountAge',          label: 'Min Account Age',             type: 'number' },
        { key: 'checkAvatar',            label: 'Check Avatar',                type: 'boolean' },
        { key: 'checkUsername',          label: 'Check Username',              type: 'boolean' },
        { key: 'joinRate',               label: 'Join Rate',                   type: 'number' },
        { key: 'timeWindow',             label: 'Time Window (ms)',            type: 'number' },
        { key: 'punishment',             label: 'Punishment',                  type: 'select', options: ['kick','ban'] },
        { key: 'ignoredUsers',           label: 'Ignored Users',               type: 'stringArray' },
        { key: 'ignoredRoles',           label: 'Ignored Roles',               type: 'stringArray' },
        { key: 'autoLockdown',           label: 'Auto Lockdown',               type: 'boolean' },
        { key: 'lockdownDuration',       label: 'Lockdown Duration (ms)',      type: 'number' },
        { key: 'alertChannel',           label: 'Alert Channel',               type: 'channel' },
        { key: 'whitelistBots',          label: 'Whitelist Bots',              type: 'stringArray' },
        { key: 'maxJoinsPerUser',        label: 'Max Joins Per User',          type: 'number' },
        { key: 'duplicateNameCheck',     label: 'Duplicate Name Check',        type: 'boolean' },
        { key: 'duplicateAvatarCheck',   label: 'Duplicate Avatar Check',      type: 'boolean' },
        { key: 'autoBan',                label: 'Auto Ban',                    type: 'boolean' },
        { key: 'autoBanThreshold',       label: 'Auto Ban Threshold',          type: 'number' }
      ]
    },

    autoMod: {
      title: 'Auto Mod',
      fields: [
        { key: 'spam.enabled',            label: 'Spam - Enabled',           type: 'boolean' },
        { key: 'spam.threshold',          label: 'Spam - Threshold',         type: 'number' },
        { key: 'spam.window',             label: 'Spam - Window (ms)',       type: 'number' },
        { key: 'spam.punishment',         label: 'Spam - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'invites.enabled',         label: 'Invites - Enabled',        type: 'boolean' },
        { key: 'invites.punishment',      label: 'Invites - Punishment',     type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'links.enabled',           label: 'Links - Enabled',          type: 'boolean' },
        { key: 'links.allowedDomains',    label: 'Links - Allowed Domains',  type: 'stringArray' },
        { key: 'links.punishment',        label: 'Links - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'phishing.enabled',        label: 'Phishing - Enabled',       type: 'boolean' },
        { key: 'phishing.punishment',     label: 'Phishing - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'bannedWords.enabled',     label: 'Banned Words - Enabled',   type: 'boolean' },
        { key: 'bannedWords.words',       label: 'Banned Words - List',      type: 'stringArray' },
        { key: 'bannedWords.punishment',  label: 'Banned Words - Punishment',type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'caps.enabled',            label: 'Caps - Enabled',           type: 'boolean' },
        { key: 'caps.max',                label: 'Caps - Max',               type: 'number' },
        { key: 'caps.punishment',         label: 'Caps - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'emoji.enabled',           label: 'Emoji - Enabled',          type: 'boolean' },
        { key: 'emoji.max',               label: 'Emoji - Max',              type: 'number' },
        { key: 'emoji.punishment',        label: 'Emoji - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'mentions.enabled',        label: 'Mentions - Enabled',       type: 'boolean' },
        { key: 'mentions.max',            label: 'Mentions - Max',           type: 'number' },
        { key: 'mentions.punishment',     label: 'Mentions - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'duplicates.enabled',      label: 'Duplicates - Enabled',     type: 'boolean' },
        { key: 'duplicates.threshold',    label: 'Duplicates - Threshold',   type: 'number' },
        { key: 'duplicates.window',       label: 'Duplicates - Window (ms)', type: 'number' },
        { key: 'duplicates.punishment',   label: 'Duplicates - Punishment',  type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'zalgo.enabled',           label: 'Zalgo - Enabled',          type: 'boolean' },
        { key: 'zalgo.punishment',        label: 'Zalgo - Punishment',       type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'charRepeat.enabled',      label: 'Char Repeat - Enabled',    type: 'boolean' },
        { key: 'charRepeat.max',          label: 'Char Repeat - Max',        type: 'number' },
        { key: 'charRepeat.punishment',   label: 'Char Repeat - Punishment', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'personalInfo.enabled',    label: 'Personal Info - Enabled',  type: 'boolean' },
        { key: 'personalInfo.punishment', label: 'Personal Info - Punish',   type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'massMention.enabled',     label: 'Mass Mention - Enabled',   type: 'boolean' },
        { key: 'massMention.punishment',  label: 'Mass Mention - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'stickerSpam.enabled',     label: 'Sticker Spam - Enabled',   type: 'boolean' },
        { key: 'stickerSpam.max',         label: 'Sticker Spam - Max',       type: 'number' },
        { key: 'stickerSpam.punishment',  label: 'Sticker Spam - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'attachmentSpam.enabled',  label: 'Attachment Spam - Enabled',type: 'boolean' },
        { key: 'attachmentSpam.maxJoins', label: 'Attachment Spam - Max',    type: 'number' },
        { key: 'attachmentSpam.window',   label: 'Attachment Spam - Window', type: 'number' },
        { key: 'attachmentSpam.punishment', label: 'Attachment Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceSpam.enabled',       label: 'Voice Spam - Enabled',     type: 'boolean' },
        { key: 'voiceSpam.maxJoins',      label: 'Voice Spam - Max',         type: 'number' },
        { key: 'voiceSpam.window',        label: 'Voice Spam - Window',      type: 'number' },
        { key: 'voiceSpam.punishment',    label: 'Voice Spam - Punish',      type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceConnectSpam.enabled', label: 'Voice Connect - Enabled', type: 'boolean' },
        { key: 'voiceConnectSpam.maxConnects', label: 'Voice Connect - Max', type: 'number' },
        { key: 'voiceConnectSpam.window', label: 'Voice Connect - Window',   type: 'number' },
        { key: 'voiceConnectSpam.punishment', label: 'Voice Connect - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceMuteSpam.enabled',   label: 'Voice Mute Spam - Enabled',type: 'boolean' },
        { key: 'voiceMuteSpam.max',       label: 'Voice Mute Spam - Max',    type: 'number' },
        { key: 'voiceMuteSpam.punishment',label: 'Voice Mute Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceDeafenSpam.enabled', label: 'Voice Deafen Spam - Enabled', type: 'boolean' },
        { key: 'voiceDeafenSpam.max',     label: 'Voice Deafen Spam - Max',  type: 'number' },
        { key: 'voiceDeafenSpam.punishment', label: 'Voice Deafen Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceJoinLeaveSpam.enabled', label: 'Voice Join/Leave - Enabled', type: 'boolean' },
        { key: 'voiceJoinLeaveSpam.max',  label: 'Voice Join/Leave - Max',   type: 'number' },
        { key: 'voiceJoinLeaveSpam.punishment', label: 'Voice Join/Leave - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'voiceMoveSpam.enabled',   label: 'Voice Move Spam - Enabled',type: 'boolean' },
        { key: 'voiceMoveSpam.max',       label: 'Voice Move Spam - Max',    type: 'number' },
        { key: 'voiceMoveSpam.punishment',label: 'Voice Move Spam - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'mentionEveryone.enabled', label: 'Mention Everyone - Enabled', type: 'boolean' },
        { key: 'mentionEveryone.punishment', label: 'Mention Everyone - Punish', type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'nsfwContent.enabled',     label: 'NSFW - Enabled',           type: 'boolean' },
        { key: 'nsfwContent.punishment',  label: 'NSFW - Punishment',        type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'toxicWords.enabled',      label: 'Toxic Words - Enabled',    type: 'boolean' },
        { key: 'toxicWords.words',        label: 'Toxic Words - List',       type: 'stringArray' },
        { key: 'toxicWords.punishment',   label: 'Toxic Words - Punish',     type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'racialSlurs.enabled',     label: 'Racial Slurs - Enabled',   type: 'boolean' },
        { key: 'racialSlurs.words',       label: 'Racial Slurs - List',      type: 'stringArray' },
        { key: 'racialSlurs.punishment',  label: 'Racial Slurs - Punish',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'selfBot.enabled',         label: 'Self Bot - Enabled',       type: 'boolean' },
        { key: 'selfBot.punishment',      label: 'Self Bot - Punishment',    type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'tokenGrabber.enabled',    label: 'Token Grabber - Enabled',  type: 'boolean' },
        { key: 'tokenGrabber.punishment', label: 'Token Grabber - Punish',   type: 'select', options: ['delete','timeout','kick','ban'] }
      ]
    },

    beastMode: {
      title: 'Beast Mode',
      fields: [
        { key: 'enabled',                       label: 'Enabled',                    type: 'boolean' },
        { key: 'actions.ban.enabled',           label: 'Ban - Enabled',              type: 'boolean' },
        { key: 'actions.ban.max',               label: 'Ban - Max',                  type: 'number' },
        { key: 'actions.ban.punishment',        label: 'Ban - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'actions.kick.enabled',          label: 'Kick - Enabled',             type: 'boolean' },
        { key: 'actions.kick.max',              label: 'Kick - Max',                 type: 'number' },
        { key: 'actions.kick.punishment',       label: 'Kick - Punishment',          type: 'select', options: ['kick','ban'] },
        { key: 'actions.channelCreate.enabled', label: 'Channel Create - Enabled',   type: 'boolean' },
        { key: 'actions.channelCreate.max',     label: 'Channel Create - Max',       type: 'number' },
        { key: 'actions.channelCreate.punishment', label: 'Channel Create - Punish', type: 'select', options: ['kick','ban'] },
        { key: 'actions.channelDelete.enabled', label: 'Channel Delete - Enabled',   type: 'boolean' },
        { key: 'actions.channelDelete.max',     label: 'Channel Delete - Max',       type: 'number' },
        { key: 'actions.channelDelete.punishment', label: 'Channel Delete - Punish', type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleCreate.enabled',    label: 'Role Create - Enabled',      type: 'boolean' },
        { key: 'actions.roleCreate.max',        label: 'Role Create - Max',          type: 'number' },
        { key: 'actions.roleCreate.punishment', label: 'Role Create - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleDelete.enabled',    label: 'Role Delete - Enabled',      type: 'boolean' },
        { key: 'actions.roleDelete.max',        label: 'Role Delete - Max',          type: 'number' },
        { key: 'actions.roleDelete.punishment', label: 'Role Delete - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleRename.enabled',    label: 'Role Rename - Enabled',      type: 'boolean' },
        { key: 'actions.roleRename.max',        label: 'Role Rename - Max',          type: 'number' },
        { key: 'actions.roleRename.punishment', label: 'Role Rename - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.roleUpdate.enabled',    label: 'Role Update - Enabled',      type: 'boolean' },
        { key: 'actions.roleUpdate.max',        label: 'Role Update - Max',          type: 'number' },
        { key: 'actions.roleUpdate.punishment', label: 'Role Update - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'actions.mention.enabled',       label: 'Mention - Enabled',          type: 'boolean' },
        { key: 'actions.mention.max',           label: 'Mention - Max',              type: 'number' },
        { key: 'actions.mention.punishment',    label: 'Mention - Punish',           type: 'select', options: ['kick','ban'] },
        { key: 'actions.botAdd.enabled',        label: 'Bot Add - Enabled',          type: 'boolean' },
        { key: 'actions.botAdd.max',            label: 'Bot Add - Max',              type: 'number' },
        { key: 'actions.botAdd.punishment',     label: 'Bot Add - Punish',           type: 'select', options: ['kick','ban'] },
        { key: 'autoTrigger',                   label: 'Auto Trigger',               type: 'boolean' },
        { key: 'triggerThreshold',              label: 'Trigger Threshold',          type: 'number' },
        { key: 'alertAll',                      label: 'Alert All',                  type: 'boolean' },
        { key: 'autoLockdown',                  label: 'Auto Lockdown',              type: 'boolean' }
      ]
    },

    roleLimits: {
      title: 'Role Limits',
      fields: [
        { key: 'ban.enabled',             label: 'Ban - Enabled',              type: 'boolean' },
        { key: 'ban.max',                 label: 'Ban - Max',                  type: 'number' },
        { key: 'ban.punishment',          label: 'Ban - Punishment',           type: 'select', options: ['kick','ban'] },
        { key: 'kick.enabled',            label: 'Kick - Enabled',             type: 'boolean' },
        { key: 'kick.max',                label: 'Kick - Max',                 type: 'number' },
        { key: 'kick.punishment',         label: 'Kick - Punishment',          type: 'select', options: ['kick','ban'] },
        { key: 'channelCreate.enabled',   label: 'Channel Create - Enabled',   type: 'boolean' },
        { key: 'channelCreate.max',       label: 'Channel Create - Max',       type: 'number' },
        { key: 'channelCreate.punishment', label: 'Channel Create - Punish',   type: 'select', options: ['kick','ban'] },
        { key: 'channelDelete.enabled',   label: 'Channel Delete - Enabled',   type: 'boolean' },
        { key: 'channelDelete.max',       label: 'Channel Delete - Max',       type: 'number' },
        { key: 'channelDelete.punishment', label: 'Channel Delete - Punish',   type: 'select', options: ['kick','ban'] },
        { key: 'roleCreate.enabled',      label: 'Role Create - Enabled',      type: 'boolean' },
        { key: 'roleCreate.max',          label: 'Role Create - Max',          type: 'number' },
        { key: 'roleCreate.punishment',   label: 'Role Create - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleDelete.enabled',      label: 'Role Delete - Enabled',      type: 'boolean' },
        { key: 'roleDelete.max',          label: 'Role Delete - Max',          type: 'number' },
        { key: 'roleDelete.punishment',   label: 'Role Delete - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleRename.enabled',      label: 'Role Rename - Enabled',      type: 'boolean' },
        { key: 'roleRename.max',          label: 'Role Rename - Max',          type: 'number' },
        { key: 'roleRename.punishment',   label: 'Role Rename - Punish',       type: 'select', options: ['kick','ban'] },
        { key: 'roleUpdate.enabled',      label: 'Role Update - Enabled',      type: 'boolean' },
        { key: 'roleUpdate.max',          label: 'Role Update - Max',          type: 'number' },
        { key: 'roleUpdate.punishment',   label: 'Role Update - Punish',       type: 'select', options: ['kick','ban'] }
      ]
    },

    antiPhishing: {
      title: 'Anti Phishing',
      fields: [
        { key: 'enabled',             label: 'Enabled',              type: 'boolean' },
        { key: 'punishment',          label: 'Punishment',           type: 'select', options: ['delete','timeout','kick','ban'] },
        { key: 'whitelistDomains',    label: 'Whitelist Domains',    type: 'stringArray' },
        { key: 'checkLinks',          label: 'Check Links',          type: 'boolean' },
        { key: 'checkAttachments',    label: 'Check Attachments',    type: 'boolean' },
        { key: 'alertChannel',        label: 'Alert Channel',        type: 'channel' }
      ]
    },

    antiToken: {
      title: 'Anti Token',
      fields: [
        { key: 'enabled',      label: 'Enabled',          type: 'boolean' },
        { key: 'punishment',   label: 'Punishment',       type: 'select', options: ['delete','kick','ban'] },
        { key: 'alertChannel', label: 'Alert Channel',    type: 'channel' }
      ]
    },

    antiScam: {
      title: 'Anti Scam',
      fields: [
        { key: 'enabled',        label: 'Enabled',           type: 'boolean' },
        { key: 'punishment',     label: 'Punishment',        type: 'select', options: ['delete','kick','ban'] },
        { key: 'scamLinks',      label: 'Scam Links',        type: 'stringArray' },
        { key: 'checkDMs',       label: 'Check DMs',         type: 'boolean' },
        { key: 'checkChannels',  label: 'Check Channels',    type: 'boolean' },
        { key: 'alertChannel',   label: 'Alert Channel',     type: 'channel' }
      ]
    },

    autoLockdown: {
      title: 'Auto Lockdown',
      fields: [
        { key: 'enabled',         label: 'Enabled',               type: 'boolean' },
        { key: 'triggerRate',     label: 'Trigger Rate',          type: 'number' },
        { key: 'timeWindow',      label: 'Time Window (ms)',      type: 'number' },
        { key: 'duration',        label: 'Duration (ms)',         type: 'number' },
        { key: 'alertChannel',    label: 'Alert Channel',         type: 'channel' },
        { key: 'lockChannels',    label: 'Lock Channels',         type: 'boolean' },
        { key: 'lockRoles',       label: 'Lock Roles',            type: 'boolean' },
        { key: 'notifyOwner',     label: 'Notify Owner',          type: 'boolean' }
      ]
    },

    autoBan: {
      title: 'Auto Ban',
      fields: [
        { key: 'enabled',      label: 'Enabled',      type: 'boolean' },
        { key: 'threshold',    label: 'Threshold',    type: 'number' },
        { key: 'punishment',   label: 'Punishment',   type: 'select', options: ['delete','timeout','kick','ban'] }
      ]
    },

    triggers: {
      title: 'Triggers',
      fields: [
        { key: 'enabled',              label: 'Enabled',                type: 'boolean' },
        { key: 'maxTriggers',          label: 'Max Triggers',           type: 'number' },
        { key: 'triggers',             label: 'Triggers',               type: 'stringArray' },
        { key: 'whitelistRoles',       label: 'Whitelist Roles',        type: 'stringArray' },
        { key: 'blacklistRoles',       label: 'Blacklist Roles',        type: 'stringArray' },
        { key: 'whitelistChannels',    label: 'Whitelist Channels',     type: 'stringArray' },
        { key: 'blacklistChannels',    label: 'Blacklist Channels',     type: 'stringArray' },
        { key: 'cooldown',             label: 'Cooldown (ms)',          type: 'number' },
        { key: 'deleteAfter',          label: 'Delete After (ms)',      type: 'number' },
        { key: 'replyToUser',          label: 'Reply To User',          type: 'boolean' },
        { key: 'useEmbed',             label: 'Use Embed',              type: 'boolean' },
        { key: 'embedColor',           label: 'Embed Color',            type: 'color' },
        { key: 'matchType',            label: 'Match Type',             type: 'select', options: ['normal','exact','contains','startsWith','endsWith','regex'] },
        { key: 'caseSensitive',        label: 'Case Sensitive',         type: 'boolean' }
      ]
    },

    announcements: {
      title: 'Announcements',
      fields: [
        { key: 'enabled',            label: 'Enabled',                type: 'boolean' },
        { key: 'defaultChannel',     label: 'Default Channel',        type: 'channel' },
        { key: 'mentionEveryone',    label: 'Mention Everyone',       type: 'boolean' },
        { key: 'embed',              label: 'Use Embed',              type: 'boolean' },
        { key: 'color',              label: 'Embed Color',            type: 'color' },
        { key: 'autoDelete',         label: 'Auto Delete',            type: 'boolean' },
        { key: 'autoDeleteDelay',    label: 'Auto Delete Delay',      type: 'number' },
        { key: 'schedule',           label: 'Schedule',               type: 'stringArray' },
        { key: 'allowAttachments',   label: 'Allow Attachments',      type: 'boolean' },
        { key: 'allowEmbeds',        label: 'Allow Embeds',           type: 'boolean' },
        { key: 'pinMessages',        label: 'Pin Messages',           type: 'boolean' },
        { key: 'crosspost',          label: 'Crosspost',              type: 'boolean' }
      ]
    },

    games: {
      title: 'Games',
      fields: [
        { key: 'enabled',              label: 'Enabled',                type: 'boolean' },
        { key: 'channelId',            label: 'Channel',                type: 'channel' },
        { key: 'trivia',               label: 'Trivia',                 type: 'boolean' },
        { key: 'wordle',               label: 'Wordle',                 type: 'boolean' },
        { key: 'truthordare',          label: 'Truth Or Dare',          type: 'boolean' },
        { key: 'wouldyourather',       label: 'Would You Rather',       type: 'boolean' },
        { key: 'showCorrectAnswer',    label: 'Show Correct Answer',    type: 'boolean' },
        { key: 'showWrongAnswer',      label: 'Show Wrong Answer',      type: 'boolean' },
        { key: 'pointsPerWin',         label: 'Points Per Win',         type: 'number' },
        { key: 'cooldown',             label: 'Cooldown (ms)',          type: 'number' },
        { key: 'maxQuestions',         label: 'Max Questions',          type: 'number' },
        { key: 'categories',           label: 'Categories',             type: 'stringArray' },
        { key: 'difficulty',           label: 'Difficulty',             type: 'select', options: ['easy','medium','hard'] },
        { key: 'timeLimit',            label: 'Time Limit (s)',         type: 'number' },
        { key: 'rewardMultiplier',     label: 'Reward Multiplier',      type: 'number' },
        { key: 'streakBonus',          label: 'Streak Bonus',           type: 'boolean' },
        { key: 'streakMultiplier',     label: 'Streak Multiplier',      type: 'number' }
      ]
    },

    logChannels: {
      title: 'Log Channels',
      fields: [
        { key: 'general',                 label: 'General',                  type: 'channel' },
        { key: 'moderation',              label: 'Moderation',               type: 'channel' },
        { key: 'security',                label: 'Security',                 type: 'channel' },
        { key: 'member',                  label: 'Member',                   type: 'channel' },
        { key: 'memberJoined',            label: 'Member Joined',            type: 'channel' },
        { key: 'memberLeft',              label: 'Member Left',              type: 'channel' },
        { key: 'messageDeleted',          label: 'Message Deleted',          type: 'channel' },
        { key: 'messageEdited',           label: 'Message Edited',           type: 'channel' },
        { key: 'voiceJoined',             label: 'Voice Joined',             type: 'channel' },
        { key: 'voiceLeft',               label: 'Voice Left',               type: 'channel' },
        { key: 'voiceMoved',              label: 'Voice Moved',              type: 'channel' },
        { key: 'channelCreated',          label: 'Channel Created',          type: 'channel' },
        { key: 'channelDeleted',          label: 'Channel Deleted',          type: 'channel' },
        { key: 'channelUpdated',          label: 'Channel Updated',          type: 'channel' },
        { key: 'channelPermissionsUpdated', label: 'Channel Perms Updated',  type: 'channel' },
        { key: 'roleCreated',             label: 'Role Created',             type: 'channel' },
        { key: 'roleDeleted',             label: 'Role Deleted',             type: 'channel' },
        { key: 'roleUpdated',             label: 'Role Updated',             type: 'channel' },
        { key: 'memberBanned',            label: 'Member Banned',            type: 'channel' },
        { key: 'memberUnbanned',          label: 'Member Unbanned',          type: 'channel' },
        { key: 'nicknameChanged',         label: 'Nickname Changed',         type: 'channel' },
        { key: 'serverUpdated',           label: 'Server Updated',           type: 'channel' },
        { key: 'webhookCreated',          label: 'Webhook Created',          type: 'channel' },
        { key: 'webhookDeleted',          label: 'Webhook Deleted',          type: 'channel' },
        { key: 'webhookUpdated',          label: 'Webhook Updated',          type: 'channel' },
        { key: 'threadCreated',           label: 'Thread Created',           type: 'channel' },
        { key: 'threadDeleted',           label: 'Thread Deleted',           type: 'channel' },
        { key: 'stickerCreated',          label: 'Sticker Created',          type: 'channel' },
        { key: 'stickerDeleted',          label: 'Sticker Deleted',          type: 'channel' },
        { key: 'cameraEnabled',           label: 'Camera Enabled',           type: 'channel' },
        { key: 'cameraDisabled',          label: 'Camera Disabled',          type: 'channel' },
        { key: 'streamStarted',           label: 'Stream Started',           type: 'channel' },
        { key: 'streamStopped',           label: 'Stream Stopped',           type: 'channel' },
        { key: 'screenShareStarted',      label: 'Screen Share Started',     type: 'channel' },
        { key: 'screenShareStopped',      label: 'Screen Share Stopped',     type: 'channel' },
        { key: 'voiceChannelJoin',        label: 'Voice Channel Join',       type: 'channel' },
        { key: 'voiceChannelLeave',       label: 'Voice Channel Leave',      type: 'channel' },
        { key: 'voiceChannelMove',        label: 'Voice Channel Move',       type: 'channel' },
        { key: 'voiceChannelMute',        label: 'Voice Channel Mute',       type: 'channel' },
        { key: 'voiceChannelUnmute',      label: 'Voice Channel Unmute',     type: 'channel' },
        { key: 'voiceChannelDeafen',      label: 'Voice Channel Deafen',     type: 'channel' },
        { key: 'voiceChannelUndeafen',    label: 'Voice Channel Undeafen',   type: 'channel' },
        { key: 'inviteCreated',           label: 'Invite Created',           type: 'channel' },
        { key: 'inviteDeleted',           label: 'Invite Deleted',           type: 'channel' },
        { key: 'emojiCreated',            label: 'Emoji Created',            type: 'channel' },
        { key: 'emojiDeleted',            label: 'Emoji Deleted',            type: 'channel' },
        { key: 'commandUsed',             label: 'Command Used',             type: 'channel' },
        { key: 'errorLog',                label: 'Error Log',                type: 'channel' },
        { key: 'securityAlert',           label: 'Security Alert',           type: 'channel' },
        { key: 'autoModAction',           label: 'AutoMod Action',           type: 'channel' },
        { key: 'triggerUsed',             label: 'Trigger Used',             type: 'channel' }
      ]
    },

    commands:       cmdEntry('Commands - General'),
    logs:           cmdEntry('Logs Command'),
    create_invite:  cmdEntry('Create Invite'),
    debug:          cmdEntry('Debug'),
    color:          cmdEntry('Color'),
    banner:         cmdEntry('Banner'),
    poll:           cmdEntry('Poll'),
    say:            cmdEntry('Say'),
    help:           cmdEntry('Help'),
    invite:         cmdEntry('Invite'),
    roleall:        cmdEntry('Role All'),
    colorrole:      cmdEntry('Color Role'),
    mutetext:       cmdEntry('Mute Text'),
    mutevoice:      cmdEntry('Mute Voice'),
    moveme:         cmdEntry('Move Me'),
    report:         cmdEntry('Report'),
    prison:         cmdEntry('Prison'),
    modlist:        cmdEntry('Mod List'),
    softban:        cmdEntry('Softban'),
    setxp:          cmdEntry('Set XP'),
    setlevel:       cmdEntry('Set Level'),
    setnickname:    cmdEntry('Set Nickname'),
    setaboutme:     cmdEntry('Set About Me'),
    setwelcome:     cmdEntry('Set Welcome'),
    addemojis:      cmdEntry('Add Emojis'),
    addstickers:    cmdEntry('Add Stickers'),
    roleadd:        cmdEntry('Role Add'),
    roleremove:     cmdEntry('Role Remove'),
    rar:            cmdEntry('RAR'),
    daily:          cmdEntry('Daily'),
    move:           cmdEntry('Move'),
    profile:        cmdEntry('Profile'),
    rep:            cmdEntry('Rep'),
    roles:          cmdEntry('Roles'),
    roll:           cmdEntry('Roll'),
    short:          cmdEntry('Short'),
    vote:           cmdEntry('Vote'),
    rank:           cmdEntry('Rank'),
    leaderboard:    cmdEntry('Leaderboard'),
    reactionrole:   cmdEntry('Reaction Role'),
    warn:           cmdEntry('Warn'),
    warnings:       cmdEntry('Warnings'),
    clearwarnings:  cmdEntry('Clear Warnings'),
    clear:          cmdEntry('Clear'),
    announce:       cmdEntry('Announce'),
    giveaway:       cmdEntry('Giveaway'),
    gend:           cmdEntry('Giveaway End'),
    ticket:         cmdEntry('Ticket'),
    close:          cmdEntry('Close'),
    trivia:         cmdEntry('Trivia'),
    rps:            cmdEntry('RPS'),
    wordle:         cmdEntry('Wordle'),
    truthordare:    cmdEntry('Truth Or Dare'),
    wouldyourather: cmdEntry('Would You Rather'),
    ban:            cmdEntry('Ban'),
    kick:           cmdEntry('Kick'),
    mute:           cmdEntry('Mute'),
    unmute:         cmdEntry('Unmute'),
    ping:           cmdEntry('Ping'),
    serverinfo:     cmdEntry('Server Info'),
    userinfo:       cmdEntry('User Info'),
    avatar:         cmdEntry('Avatar'),
    about:          cmdEntry('About'),
    credits:        cmdEntry('Credits'),
    server:         cmdEntry('Server'),
    user:           cmdEntry('User'),

    utility: {
      title: 'Utility',
      fields: [
        { key: 'ping.enabled',        label: 'Ping - Enabled',         type: 'boolean' },
        { key: 'ping.channels',       label: 'Ping - Channels',        type: 'stringArray' },
        { key: 'ping.disabledChannels', label: 'Ping - Disabled Chans',type: 'stringArray' },
        { key: 'ping.roles',          label: 'Ping - Roles',           type: 'stringArray' },
        { key: 'ping.disabledRoles',  label: 'Ping - Disabled Roles',  type: 'stringArray' },
        { key: 'ping.users',          label: 'Ping - Users',           type: 'stringArray' },
        { key: 'ping.disabledUsers',  label: 'Ping - Disabled Users',  type: 'stringArray' },
        { key: 'ping.maxLimit',       label: 'Ping - Max Limit',       type: 'number' },
        { key: 'ping.limitWindow',    label: 'Ping - Limit Window',    type: 'number' },
        { key: 'ping.customName',     label: 'Ping - Custom Name',     type: 'text' },
        { key: 'ping.aliases',        label: 'Ping - Aliases',         type: 'stringArray' },
        { key: 'ping.autoDeleteMessage', label: 'Ping - Auto Del Msg', type: 'boolean' },
        { key: 'ping.autoDeleteInvocation', label: 'Ping - Auto Del Inv', type: 'boolean' },
        { key: 'ping.autoDeleteReply', label: 'Ping - Auto Del Reply', type: 'boolean' },
        { key: 'serverinfo.enabled',  label: 'Server Info - Enabled',  type: 'boolean' },
        { key: 'userinfo.enabled',    label: 'User Info - Enabled',    type: 'boolean' },
        { key: 'avatar.enabled',      label: 'Avatar - Enabled',       type: 'boolean' },
        { key: 'banner.enabled',      label: 'Banner - Enabled',       type: 'boolean' }
      ]
    }
  };

  /* ============================================================
   * HELPERS
   * ============================================================ */
  function getNestedValue(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function setNestedValue(obj, path, value) {
    var keys = path.split('.');
    var last = keys.pop();
    var target = keys.reduce(function (acc, key) {
      if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
      return acc[key];
    }, obj);
    target[last] = value;
  }

  function createField(field, currentValue, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'form-field';

    var label = document.createElement('label');
    label.textContent = field.label || field.key;
    label.setAttribute('for', 'field-' + field.key.replace(/\./g, '-'));
    wrap.appendChild(label);

    var input;

    switch (field.type) {

      case 'boolean':
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!currentValue;
        input.addEventListener('change', function () { onChange(field.key, input.checked); });
        break;

      case 'number':
        input = document.createElement('input');
        input.type = 'number';
        input.value = (currentValue !== undefined && currentValue !== null) ? currentValue : '';
        input.addEventListener('input', function () {
          onChange(field.key, input.value === '' ? null : Number(input.value));
        });
        break;

      case 'color':
        input = document.createElement('input');
        input.type = 'color';
        input.value = currentValue || '#000000';
        input.addEventListener('input', function () { onChange(field.key, input.value); });
        break;

      case 'select':
        input = document.createElement('select');
        (field.options || []).forEach(function (opt) {
          var o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          if (currentValue === opt) o.selected = true;
          input.appendChild(o);
        });
        input.addEventListener('change', function () { onChange(field.key, input.value); });
        break;

      case 'role':
        input = document.createElement('select');
        var eRole = document.createElement('option');
        eRole.value = '';
        eRole.textContent = '-- None --';
        input.appendChild(eRole);
        (window.__ROLES__ || []).forEach(function (r) {
          var o = document.createElement('option');
          o.value = r.id;
          o.textContent = r.name;
          if (currentValue === r.id) o.selected = true;
          input.appendChild(o);
        });
        input.addEventListener('change', function () { onChange(field.key, input.value || null); });
        break;

      case 'channel':
        input = document.createElement('select');
        var eChan = document.createElement('option');
        eChan.value = '';
        eChan.textContent = '-- None --';
        input.appendChild(eChan);
        (window.__CHANNELS__ || []).forEach(function (c) {
          var o = document.createElement('option');
          o.value = c.id;
          o.textContent = '#' + c.name;
          if (currentValue === c.id) o.selected = true;
          input.appendChild(o);
        });
        input.addEventListener('change', function () { onChange(field.key, input.value || null); });
        break;

      case 'channelArray': {
        var wrapArr = document.createElement('div');
        wrapArr.className = 'multi-select';

        var chips = document.createElement('div');
        chips.className = 'chips';

        var arrVal = Array.isArray(currentValue) ? currentValue.slice() : [];

        var renderChips = function () {
          chips.innerHTML = '';
          if (arrVal.length === 0) {
            var empty = document.createElement('span');
            empty.className = 'chips-empty';
            empty.textContent = 'No channels selected';
            chips.appendChild(empty);
            return;
          }
          arrVal.forEach(function (id, i) {
            var found = (window.__CHANNELS__ || []).find(function (x) { return x.id === id; });
            var name = found ? found.name : id;
            var chip = document.createElement('span');
            chip.className = 'chip chip-channel';
            chip.textContent = '#' + name;
            var rm = document.createElement('button');
            rm.type = 'button';
            rm.textContent = '\u00d7';
            rm.addEventListener('click', function (e) {
              e.preventDefault();
              arrVal.splice(i, 1);
              renderChips();
              onChange(field.key, arrVal.slice());
            });
            chip.appendChild(rm);
            chips.appendChild(chip);
          });
        };

        var sel = document.createElement('select');
        var opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = '+ Add channel';
        sel.appendChild(opt0);

        (window.__CHANNELS__ || []).forEach(function (ch) {
          if (arrVal.indexOf(ch.id) !== -1) return;
          var o = document.createElement('option');
          o.value = ch.id;
          o.textContent = '#' + ch.name;
          sel.appendChild(o);
        });

        sel.addEventListener('change', function () {
          if (sel.value) {
            arrVal.push(sel.value);
            renderChips();
            onChange(field.key, arrVal.slice());
            sel.value = '';
            while (sel.options.length > 1) sel.remove(1);
            (window.__CHANNELS__ || []).forEach(function (ch) {
              if (arrVal.indexOf(ch.id) !== -1) return;
              var o = document.createElement('option');
              o.value = ch.id;
              o.textContent = '#' + ch.name;
              sel.appendChild(o);
            });
          }
        });

        renderChips();
        wrapArr.appendChild(chips);
        wrapArr.appendChild(sel);
        input = wrapArr;
        break;
      }

      case 'roleArray': {
        var wrapRole = document.createElement('div');
        wrapRole.className = 'multi-select';

        var roleChips = document.createElement('div');
        roleChips.className = 'chips';

        var roleArr = Array.isArray(currentValue) ? currentValue.slice() : [];

        var renderRoleChips = function () {
          roleChips.innerHTML = '';
          if (roleArr.length === 0) {
            var empty = document.createElement('span');
            empty.className = 'chips-empty';
            empty.textContent = 'No roles selected';
            roleChips.appendChild(empty);
            return;
          }
          roleArr.forEach(function (id, i) {
            var found = (window.__ROLES__ || []).find(function (x) { return x.id === id; });
            var name = found ? found.name : id;
            var chip = document.createElement('span');
            chip.className = 'chip chip-role';
            chip.textContent = '@' + name;
            var rm = document.createElement('button');
            rm.type = 'button';
            rm.textContent = '\u00d7';
            rm.addEventListener('click', function (e) {
              e.preventDefault();
              roleArr.splice(i, 1);
              renderRoleChips();
              onChange(field.key, roleArr.slice());
            });
            chip.appendChild(rm);
            roleChips.appendChild(chip);
          });
        };

        var roleSel = document.createElement('select');
        var rOpt0 = document.createElement('option');
        rOpt0.value = '';
        rOpt0.textContent = '+ Add role';
        roleSel.appendChild(rOpt0);

        (window.__ROLES__ || []).forEach(function (r) {
          if (roleArr.indexOf(r.id) !== -1) return;
          var o = document.createElement('option');
          o.value = r.id;
          o.textContent = '@' + r.name;
          roleSel.appendChild(o);
        });

        roleSel.addEventListener('change', function () {
          if (roleSel.value) {
            roleArr.push(roleSel.value);
            renderRoleChips();
            onChange(field.key, roleArr.slice());
            roleSel.value = '';
            while (roleSel.options.length > 1) roleSel.remove(1);
            (window.__ROLES__ || []).forEach(function (r) {
              if (roleArr.indexOf(r.id) !== -1) return;
              var o = document.createElement('option');
              o.value = r.id;
              o.textContent = '@' + r.name;
              roleSel.appendChild(o);
            });
          }
        });

        renderRoleChips();
        wrapRole.appendChild(roleChips);
        wrapRole.appendChild(roleSel);
        input = wrapRole;
        break;
      }


      case 'stringArray':
        input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'comma,separated,values';
        input.value = Array.isArray(currentValue) ? currentValue.join(',') : '';
        input.addEventListener('input', function () {
          var arr = input.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
          onChange(field.key, arr);
        });
        break;

      case 'textarea':
        input = document.createElement('textarea');
        input.rows = 3;
        input.value = currentValue || '';
        input.addEventListener('input', function () { onChange(field.key, input.value); });
        break;

      default:
        input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue || '';
        input.addEventListener('input', function () { onChange(field.key, input.value); });
        break;
    }

    input.id = 'field-' + field.key.replace(/\./g, '-');
    wrap.appendChild(input);
    return wrap;
  }

  function renderSection(sectionKey, config, container, onDirty) {
    var schema = SCHEMA[sectionKey];
    if (!schema) {
      container.innerHTML = '<p class="error">No form defined for: ' + sectionKey + '</p>';
      return;
    }

    container.innerHTML = '';

    var title = document.createElement('h2');
    title.textContent = schema.title;
    container.appendChild(title);

    var sectionData = config[sectionKey] || {};

    var grid = document.createElement('div');
    grid.className = 'form-grid';

    schema.fields.forEach(function (field) {
      var value = getNestedValue(sectionData, field.key);
      var el = createField(field, value, function (key, newVal) {
        setNestedValue(sectionData, key, newVal);
        if (typeof onDirty === 'function') onDirty();
      });
      grid.appendChild(el);
    });

    container.appendChild(grid);
  }

  window.FormBuilder = {
    SCHEMA: SCHEMA,
    renderSection: renderSection,
    getNestedValue: getNestedValue,
    setNestedValue: setNestedValue
  };

})();
