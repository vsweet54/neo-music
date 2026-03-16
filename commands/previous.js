const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Kembali ke lagu sebelumnya'),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    try {
      await queue.previous();
      await interaction.reply({ embeds: [successEmbed('Previous', '⏮️ Memutar lagu sebelumnya!')] });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed('Tidak ada lagu sebelumnya!')], ephemeral: true });
    }
  },
};
