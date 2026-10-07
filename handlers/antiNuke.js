/* ============================================================
 * antiNuke.js - Advanced Anti-Nuke System
 * Beyond Wick-Level Protection
 * 2026 (c) KBoloorian
 * ============================================================ */

const { EmbedBuilder, AuditLogEvent } = require('discord.js');

/* ============================================================
 * STATE
 * ============================================================ */
const actionTrackers = new Map();
const riskScores = new Map();
const actionHistory = new Map();
const lockdownChannels = new Map();

/* ============================================================
 * RISK THRESHOLDS (Punishment Escalation)
 * ============================================================ */
const RISK_THRESHOLDS = {
  20: { action: 'warn', color: '#FFA500', emoji: '⚠️' },
  35: { action: 'removeRoles', color: '#FF8C00', emoji: '🔶' },
  50: { action: 'timeout', color: '#FF4500', emoji: '🔴' },
  70: { action: 'kick', color: '#DC143C', emoji: '🦵' },
  85: { action: 'ban', color: '#8B0000', emoji: '🔨' },
  100: { action: 'ban', color: '#000000', emoji: '☠️', permanent: true }
};

/* ============================================================
 * HEAT DECAY CONFIG
 * ============================================================ */
const HEAT_CONFIG = {
  decayRate: 1,
  decayInterval: 1000,
  maxHeat: 200,
  minHeatToKeep: 5
};

/* ============================================================
 * HELPERS
 * ============================================================ */
function getTracker(guildId, userId, action) {
  const key = `${guildId}-${userId}-${action}`;
  if (!actionTrackers.has(key)) actionTrackers.set(key, []);
  return actionTrackers.get(key);
}

function isWhitelisted(member, config) {
  if (!member) return false;
  if (member.id === member.guild.ownerId) return true;
  if (config.whitelist?.users?.all?.includes(member.id)) return true;
  if (config.whitelist?.roles?.all) {
    if (member.roles.cache.some(r => config.whitelist.roles.all.includes(r.id))) return true;
  }
  return false;
}

function addRiskScore(guildId, userId, amount) {
  const key = `${guildId}-${userId}`;
  const current = riskScores.get(key) || 0;
  const next = Math.min(current + amount, HEAT_CONFIG.maxHeat);
  riskScores.set(key, next);
  return next;
}

function getRiskScore(guildId, userId) {
  const key = `${guildId}-${userId}`;
  return riskScores.get(key) || 0;
}

function resetRiskScore(guildId, userId) {
  const key = `${guildId}-${userId}`;
  riskScores.delete(key);
}

function addActionHistory(guildId, userId, action) {
  const key = `${guildId}-${userId}`;
  if (!actionHistory.has(key)) actionHistory.set(key, []);
  const history = actionHistory.get(key);
  history.push({ action, timestamp: Date.now() });
  if (history.length > 100) history.shift();
  actionHistory.set(key, history);
}

function checkSuspiciousPattern(guildId, userId) {
  const key = `${guildId}-${userId}`;
  const history = actionHistory.get(key) || [];
  const now = Date.now();
  const recentActions = history.filter(h => now - h.timestamp < 60000);

  const uniqueActions = new Set(recentActions.map(h => h.action));
  if (uniqueActions.size >= 5) return { suspicious: true, reason: 'Multi-action burst' };

  if (recentActions.length >= 10) return { suspicious: true, reason: 'High frequency' };

  const uniqueMap = {};
  for (const a of recentActions) {
    if (now - a.timestamp < 30000) {
      uniqueMap[a.action] = (uniqueMap[a.action] || 0) + 1;
      if (uniqueMap[a.action] >= 3) return { suspicious: true, reason: `Repeat: ${a.action}` };
    }
  }

  return { suspicious: false };
}

/* Heat Decay Loop */
setInterval(() => {
  riskScores.forEach((heat, key) => {
    if (heat <= HEAT_CONFIG.minHeatToKeep) {
      riskScores.delete(key);
    } else {
      riskScores.set(key, heat - HEAT_CONFIG.decayRate);
    }
  });
}, HEAT_CONFIG.decayInterval);

/* ============================================================
 * LOCK / UNLOCK CHANNELS
 * ============================================================ */
async function lockChannels(guild, reason) {
  try {
    const channels = guild.channels.cache.filter(c => c.type === 0 || c.type === 2);
    for (const [id, channel] of channels) {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false,
        Speak: false
      }).catch(() => {});
    }
    lockdownChannels.set(guild.id, Date.now());
  } catch (e) {
    console.error('Lock Channels Error:', e.message);
  }
}

async function unlockChannels(guild) {
  try {
    const channels = guild.channels.cache.filter(c => c.type === 0 || c.type === 2);
    for (const [id, channel] of channels) {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: null,
        Speak: null
      }).catch(() => {});
    }
    lockdownChannels.delete(guild.id);
  } catch (e) {
    console.error('Unlock Channels Error:', e.message);
  }
}

/* ============================================================
 * ALERT
 * ============================================================ */
async function sendAlert(guild, config, title, description, color = '#ED4245') {
  try {
    const logChannelId = config.logChannels?.security || config.logChannels?.general;
    const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    if (config.autoLockdown?.notifyOwner) {
      const owner = await guild.fetchOwner().catch(() => null);
      if (owner) {
        await owner.send(`🚨 Security Alert in ${guild.name}\n${title}\n\n${description}`).catch(() => {});
      }
    }
  } catch (e) {
    console.error('Send Alert Error:', e.message);
  }
}

/* ============================================================
 * PUNISH
 * ============================================================ */
async function punish(guild, userId, punishment, reason, config) {
  try {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;

    if (member.id === guild.ownerId) return;
    if (member.roles.highest.position >= guild.members.me.roles.highest.position) return;

    if (punishment === 'kick' && member.kickable) {
      await member.kick(reason).catch(() => {});
    } else if (punishment === 'ban' && member.bannable) {
      await member.ban({ reason }).catch(() => {});
    } else if (punishment === 'timeout' && member.moderatable) {
      await member.timeout(10 * 60 * 1000, reason).catch(() => {});
    } else if (punishment === 'removeRoles') {
      await member.roles.set([]).catch(() => {});
    } else if (punishment === 'warn') {
      await member.send(`⚠️ Warning: ${reason}`).catch(() => {});
    }

    const riskScore = getRiskScore(guild.id, userId);
    await sendAlert(
      guild,
      config,
      '🚨 Anti-Nuke Punishment',
      `User: <@${userId}>\nAction: ${punishment}\nReason: ${reason}\nRisk Score: ${riskScore}`,
      '#ED4245'
    );

    if (punishment === 'ban' && config.autoLockdown?.enabled) {
      await lockChannels(guild, `Auto-Lockdown: ${reason}`);
    }
  } catch (e) {
    console.error('Punish Error:', e.message);
  }
}

/* ============================================================
 * CHECK ACTION (Main)
 * ============================================================ */
async function checkAction(guild, userId, action, config, amount = 1) {
  try {
    if (!config.securityLimits?.[action]) return false;
    const settings = config.securityLimits[action];
    if (!settings.enabled) return false;

    const member = await guild.members.fetch(userId).catch(() => null);
    if (isWhitelisted(member, config)) return false;

    addActionHistory(guild.id, userId, action);

    const riskAmount = settings.riskScore || amount;
    const totalRisk = addRiskScore(guild.id, userId, riskAmount);

    const pattern = checkSuspiciousPattern(guild.id, userId);
    if (pattern.suspicious) {
      const punishment = settings.punishment || 'kick';
      await punish(guild, userId, punishment, `Suspicious: ${pattern.reason}`, config);
      resetRiskScore(guild.id, userId);
      return true;
    }

    const thresholds = Object.keys(RISK_THRESHOLDS).map(Number).sort((a, b) => a - b);
    for (const threshold of thresholds) {
      if (totalRisk >= threshold) {
        const punishment = RISK_THRESHOLDS[threshold].action;
        const permanent = RISK_THRESHOLDS[threshold].permanent;
        await punish(guild, userId, punishment, `Heat threshold ${totalRisk} - ${action}`, config);

        if (permanent) {
          await guild.bans.create(userId, { reason: 'Permanent Ban - Max Heat' }).catch(() => {});
        } else {
          resetRiskScore(guild.id, userId);
        }
        return true;
      }
    }

    const tracker = getTracker(guild.id, userId, action);
    const now = Date.now();
    tracker.push(now);

    const window = settings.window || 10000;
    const validActions = tracker.filter(t => now - t < window);
    actionTrackers.set(`${guild.id}-${userId}-${action}`, validActions);

    const max = settings.max || 5;
    if (validActions.length >= max) {
      const punishment = settings.punishment || 'kick';
      await punish(guild, userId, punishment, `Rate limit: ${action} (${validActions.length}/${max})`, config);
      actionTrackers.set(`${guild.id}-${userId}-${action}`, []);
      return true;
    }

    return false;
  } catch (e) {
    console.error('Check Action Error:', e.message);
    return false;
  }
}

/* ============================================================
 * AUDIT LOG CHECKS
 * ============================================================ */
async function checkWebhook(guild, webhook, config) {
  try {
    if (!config.securityLimits?.webhookCreate?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.WebhookCreate, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await webhook.delete('Anti-Nuke: Unauthorized Webhook').catch(() => {});
    await checkAction(guild, executor.id, 'webhookCreate', config, 15);
    return true;
  } catch (e) {
    console.error('Webhook Check Error:', e.message);
    return false;
  }
}

async function checkThread(guild, thread, config) {
  try {
    if (!config.securityLimits?.threadCreate?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ThreadCreate, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'threadCreate', config, 5);
    return true;
  } catch (e) {
    console.error('Thread Check Error:', e.message);
    return false;
  }
}

async function checkSticker(guild, sticker, config) {
  try {
    if (!config.securityLimits?.stickerCreate?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.StickerCreate, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'stickerCreate', config, 10);
    return true;
  } catch (e) {
    console.error('Sticker Check Error:', e.message);
    return false;
  }
}

async function checkChannelCreate(guild, channel, config) {
  try {
    if (!config.securityLimits?.channelCreate?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'channelCreate', config, 10);
    return true;
  } catch (e) {
    console.error('Channel Create Check Error:', e.message);
    return false;
  }
}

async function checkChannelDelete(guild, channel, config) {
  try {
    if (!config.securityLimits?.channelDelete?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'channelDelete', config, 15);
    return true;
  } catch (e) {
    console.error('Channel Delete Check Error:', e.message);
    return false;
  }
}

async function checkRoleCreate(guild, role, config) {
  try {
    if (!config.securityLimits?.roleCreate?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'roleCreate', config, 10);
    return true;
  } catch (e) {
    console.error('Role Create Check Error:', e.message);
    return false;
  }
}

async function checkRoleDelete(guild, role, config) {
  try {
    if (!config.securityLimits?.roleDelete?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'roleDelete', config, 15);
    return true;
  } catch (e) {
    console.error('Role Delete Check Error:', e.message);
    return false;
  }
}

async function checkBan(guild, config) {
  try {
    if (!config.securityLimits?.ban?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'ban', config, 20);
    return true;
  } catch (e) {
    console.error('Ban Check Error:', e.message);
    return false;
  }
}

async function checkKick(guild, config) {
  try {
    if (!config.securityLimits?.kick?.enabled) return false;
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 }).catch(() => null);
    if (!auditLogs) return false;
    const entry = auditLogs.entries.first();
    if (!entry) return false;
    const executor = entry.executor;
    if (!executor) return false;
    if (isWhitelisted(await guild.members.fetch(executor.id).catch(() => null), config)) return false;
    await checkAction(guild, executor.id, 'kick', config, 15);
    return true;
  } catch (e) {
    console.error('Kick Check Error:', e.message);
    return false;
  }
}

module.exports = {
  checkAction,
  isWhitelisted,
  punish,
  getRiskScore,
  resetRiskScore,
  addRiskScore,
  addActionHistory,
  checkSuspiciousPattern,
  lockChannels,
  unlockChannels,
  sendAlert,
  checkWebhook,
  checkThread,
  checkSticker,
  checkChannelCreate,
  checkChannelDelete,
  checkRoleCreate,
  checkRoleDelete,
  checkBan,
  checkKick,
  RISK_THRESHOLDS
};
