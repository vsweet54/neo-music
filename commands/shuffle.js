const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Acak urutan queue'),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    queue.shuffle();
    await interaction.reply({
      embeds: [successEmbed('Shuffled!', `🔀 ${queue.songs.length - 1} lagu diacak!`)],
    });
  },
};
