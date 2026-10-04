require('dotenv').config();
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const config = require('./config.js');
const { startDashboard } = require('./dashboard/server');
const { startDailyReport } = require('./handlers/dailyReport');
const triggerHandler = require('./handlers/triggerHandler');
const { startRiskDecay } = require('./handlers/riskManager');

// ================= MONGODB CONNECTION =================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/securitybot')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ================= CLIENT =================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildEmojisAndStickers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User]
});

// ================= COMMANDS =================
client.commands = new Collection();
const commandsArray = [];
const commandFolders = fs.readdirSync('./commands').filter(f => fs.statSync(`./commands/${f}`).isDirectory());

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${folder}/${file}`);
            if (command.data && command.execute) {
                // چێککردنی دووبارەبوونەوە
                if (client.commands.has(command.data.name)) {
                    console.warn(`⚠️ کۆماندی دووبارە دۆزرایەوە: ${command.data.name} لە ${folder}/${file} - پشتگوێ خرا`);
                    continue;
                }
                client.commands.set(command.data.name, command);
                commandsArray.push(command.data.toJSON());
            }
        } catch (error) {
            console.error(`❌ هەڵە لە خوێندنەوەی فایلی ${folder}/${file}:`, error.message);
        }
    }
}

// ================= EVENTS =================
const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.name && event.execute) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, config));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, config));
        }
    }
}

// ================= TRIGGERS =================
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    try {
        await triggerHandler.checkTrigger(message, client, config);
    } catch (error) {
        console.error('Trigger Error:', error);
    }
});

// ================= READY =================
client.once('clientReady', async () => {
    console.log(`✅ ${client.user.tag} is online!`);

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commandsArray });
        console.log('✅ Commands registered!');
    } catch (err) {
        console.error('❌ Failed to register commands:', err);
    }

    startDailyReport(client);
    startDashboard(client, config);
    startRiskDecay(client);
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
