console.log('Step 1');
require('dotenv').config();
console.log('Step 2');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
console.log('Step 3');
const { DisTube } = require('distube');
console.log('Step 4 - distube ok');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});
console.log('Step 5 - client ok');
client.login(process.env.DISCORD_TOKEN);
