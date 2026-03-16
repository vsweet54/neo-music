const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop musik dan bot leave voice channel'),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    await queue.stop();
    await interaction.reply({
      embeds: [successEmbed('Stopped', '⏹️ Musik dihentikan dan bot keluar dari voice channel!')],
    });
  },
};
