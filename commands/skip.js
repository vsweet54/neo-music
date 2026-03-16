const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip lagu yang sedang diputar')
    .addIntegerOption(opt =>
      opt.setName('amount')
        .setDescription('Skip beberapa lagu sekaligus (default: 1)')
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const amount = interaction.options.getInteger('amount') || 1;
    const skipped = queue.songs[0];

    try {
      if (amount > 1) {
        // Skip multiple songs
        const toSkip = Math.min(amount - 1, queue.songs.length - 1);
        queue.songs.splice(1, toSkip);
      }
      await queue.skip();

      await interaction.reply({
        embeds: [successEmbed(
          `Skipped${amount > 1 ? ` ${amount} lagu` : ''}`,
          `⏭️ **${skipped.name}** diskip!`
        )],
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed('Tidak bisa skip lagu!')], ephemeral: true });
    }
  },
};
