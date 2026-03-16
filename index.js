require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const fs = require('fs');
const path = require('path');

// ─── Client Setup ────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// ─── DisTube Setup ────────────────────────────────────────────
client.distube = new DisTube(client, {
  plugins: [
    new YtDlpPlugin({ update: false }),
    new SpotifyPlugin({
      api: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }),
    new SoundCloudPlugin(),
  ],
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 30000,
  leaveOnFinish: true,
  leaveOnFinishCooldown: 10000,
  nsfw: false,
  emitAddSongWhenCreatingQueue: false,
});

// ─── Commands Collection ──────────────────────────────────────
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

// ─── Events ───────────────────────────────────────────────────
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ─── DisTube Events ──────────────────────────────────────────
const distubeEventFiles = fs.readdirSync(path.join(__dirname, 'events/distube')).filter(f => f.endsWith('.js'));
for (const file of distubeEventFiles) {
  const event = require(`./events/distube/${file}`);
  client.distube.on(event.name, (...args) => event.execute(...args, client));
}

// ─── Login ────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
