/* ============================================================
 * SECURITY BOT - INDEX.JS
 * Version 2.0.0 (Full Edition)
 * 2026 (c) KBoloorian
 * ============================================================ */

require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

/* ============================================================
 * LOAD CONFIG
 * ============================================================ */
let config;
try {
  config = require('./config.js');
  console.log('✅ Config loaded successfully');
} catch (err) {
  console.error('❌ Failed to load config.js:', err.message);
  process.exit(1);
}

/* ============================================================
 * CONFIG WATCHER (auto-reload when dashboard saves)
 * ============================================================ */
const configWatcher = require('./handlers/configWatcher');

/* ============================================================
 * CREATE CLIENT
 * ============================================================ */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User,
  ],
});

/* ============================================================
 * COLLECTIONS
 * ============================================================ */
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.config = config;

/* ============================================================
 * GLOBAL ERROR HANDLERS
 * ============================================================ */
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err);
});

/* ============================================================
 * LOAD COMMANDS
 * ============================================================ */
function loadCommands() {
  const commandsPath = path.join(__dirname, "commands");
  if (!fs.existsSync(commandsPath)) {
    console.log("WARN: No commands folder found");
    return 0;
  }
  let loaded = 0;
  function readDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readDir(fullPath);
      } else if (item.endsWith(".js")) {
        try {
          delete require.cache[require.resolve(fullPath)];
          const command = require(fullPath);
          // Slash commands: use command.data.name
          if (command.data && typeof command.execute === "function") {
            const name = typeof command.data.name === "string"
              ? command.data.name
              : (command.data.toJSON ? command.data.toJSON().name : null);
            if (name) {
              client.commands.set(name, command);
              loaded++;
            }
          }
          // Also support legacy: command.name
          else if (command.name && typeof command.execute === "function") {
            client.commands.set(command.name, command);
            if (Array.isArray(command.aliases)) {
              command.aliases.forEach(a => client.aliases.set(a, command.name));
            }
            loaded++;
          }
        } catch (err) {
          console.error("FAIL " + item + ": " + err.message);
        }
      }
    }
  }
  readDir(commandsPath);
  return loaded;
}

/* ============================================================
 * LOAD EVENTS
 * ============================================================ */
function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  if (!fs.existsSync(eventsPath)) {
    console.log('⚠️  No events folder found');
    return 0;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
  let loaded = 0;

  for (const file of eventFiles) {
    try {
      delete require.cache[require.resolve(path.join(eventsPath, file))];
      const event = require(path.join(eventsPath, file));

      if (event.name && typeof event.execute === 'function') {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        loaded++;
      }
    } catch (err) {
      console.error(`❌ Failed to load event ${file}:`, err.message);
    }
  }

  return loaded;
}

/* ============================================================
 * LOAD HANDLERS (optional)
 * ============================================================ */
function loadHandlers() {
  const handlersPath = path.join(__dirname, 'handlers');
  if (!fs.existsSync(handlersPath)) return 0;

  const handlerFiles = fs.readdirSync(handlersPath)
    .filter(f => f.endsWith('.js') && f !== 'configWatcher.js');

  let loaded = 0;
  for (const file of handlerFiles) {
    try {
      const handler = require(path.join(handlersPath, file));
      if (typeof handler === 'function') {
        handler(client);
        loaded++;
      } else if (handler && typeof handler.init === 'function') {
        handler.init(client);
        loaded++;
      }
    } catch (err) {
      console.error(`❌ Failed to load handler ${file}:`, err.message);
    }
  }
  return loaded;
}

/* ============================================================
 * READY EVENT
 * ============================================================ */
client.once('ready', () => {
  // Register slash commands
  registerSlashCommands();
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Bot Online: ${client.user.tag}`);
  console.log(`📡 Servers:    ${client.guilds.cache.size}`);
  console.log(`👥 Users:      ${client.users.cache.size}`);
  console.log(`⚡ Commands:   ${client.commands.size}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');

  // Set bot status from config
  if (config.general) {
    const status = config.general.botStatus || 'online';
    const activity = config.general.botActivity || 'over the server';
    const activityType = config.general.botActivityType || 'WATCHING';

    try {
      client.user.setStatus(status);
      client.user.setActivity(activity, { type: activityType });
    } catch (err) {
      console.warn('⚠️  Failed to set status/activity:', err.message);
    }
  }
});

/* ============================================================
 * CONFIG CHANGE HANDLER
 * When dashboard saves config.js, this triggers automatically
 * ============================================================ */
configWatcher.onChange((newConfig) => {
  console.log('🔄 Config updated from dashboard, applying...');
  client.config = newConfig;
  config = newConfig;

  try {
    if (newConfig.general) {
      if (newConfig.general.botStatus) {
        client.user.setStatus(newConfig.general.botStatus);
      }
      if (newConfig.general.botActivity) {
        client.user.setActivity(newConfig.general.botActivity, {
          type: newConfig.general.botActivityType || 'WATCHING'
        });
      }
    }
    console.log('✅ Config applied successfully');
  } catch (err) {
    console.error('❌ Failed to apply config:', err.message);
  }
});

/* ============================================================
 * BOOTSTRAP
 * ============================================================ */
async function registerSlashCommands() {
  try {
    const commands = [];
    client.commands.forEach(cmd => {
      if (cmd.data && cmd.data.toJSON) {
        commands.push(cmd.data.toJSON());
      }
    });

    if (commands.length === 0) {
      console.log("WARN: No slash commands to register");
      return;
    }

    const guildId = process.env.GUILD_ID || (client.config && client.config.guildId);
    if (!guildId) {
      console.log("WARN: GUILD_ID not set, registering globally (slow)");
      await client.application.commands.set(commands);
      console.log("Registered " + commands.length + " commands globally");
      return;
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      console.log("WARN: Guild not found, registering globally");
      await client.application.commands.set(commands);
      console.log("Registered " + commands.length + " commands globally");
      return;
    }

    await guild.commands.set(commands);
    console.log("Registered " + commands.length + " slash commands to guild: " + guild.name);
  } catch (err) {
    console.error("Failed to register slash commands:", err.message);
  }
}

function bootstrap() {
  console.log('');
  console.log('🚀 Starting Security Bot...');
  console.log('');

  const cmdCount = loadCommands();
  console.log(`✅ Loaded ${cmdCount} commands`);

  const evtCount = loadEvents();
  console.log(`✅ Loaded ${evtCount} events`);

  const hndCount = loadHandlers();
  if (hndCount > 0) console.log(`✅ Loaded ${hndCount} handlers`);

  // Start config watcher
  configWatcher.start();


  // Login
  const token = process.env.BOT_TOKEN || config.token;
  if (!token) {
    console.error('❌ BOT_TOKEN missing in .env or config.js');
    process.exit(1);
  }

  client.login(token).catch(err => {
    console.error('❌ Failed to login:', err.message);
    process.exit(1);
  });
}

bootstrap();
