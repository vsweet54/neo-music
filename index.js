process.on('uncaughtException', err => { console.error('UNCAUGHT:', err); process.exit(1); });
process.on('unhandledRejection', err => { console.error('UNHANDLED:', err); process.exit(1); });

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DisTube } = require('distube');
const fs = require('fs');
const path = require('path');

console.log('Starting bot...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

console.log('Client created');

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  nsfw: false,
});

console.log('DisTube created');

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) client.commands.set(command.data.name, command);
}

console.log('Commands loaded');

const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

const distubeEventFiles = fs.readdirSync(path.join(__dirname, 'events/distube')).filter(f => f.endsWith('.js'));
for (const file of distubeEventFiles) {
  const event = require(`./events/distube/${file}`);
  client.distube.on(event.name, (...args) => event.execute(...args, client));
}

console.log('Logging in...');
client.login(process.env.DISCORD_TOKEN);
