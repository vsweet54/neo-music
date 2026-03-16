const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggle autoplay lagu related saat queue habis'),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const status = queue.toggleAutoplay();
    await interaction.reply({
      embeds: [successEmbed('Autoplay', status ? '✅ Autoplay dinyalakan!' : '❌ Autoplay dimatikan!')],
    });
  },
};
