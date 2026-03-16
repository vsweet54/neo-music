const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause/resume lagu yang sedang diputar'),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    if (queue.paused) {
      queue.resume();
      await interaction.reply({ embeds: [successEmbed('Resumed', '▶️ Lagu dilanjutkan!')] });
    } else {
      queue.pause();
      await interaction.reply({ embeds: [successEmbed('Paused', '⏸️ Lagu dijeda!')] });
    }
  },
};
