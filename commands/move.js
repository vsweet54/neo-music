const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Pindahkan lagu ke posisi lain di queue')
    .addIntegerOption(opt =>
      opt.setName('from').setDescription('Posisi lagu sekarang').setRequired(true).setMinValue(1)
    )
    .addIntegerOption(opt =>
      opt.setName('to').setDescription('Posisi tujuan').setRequired(true).setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const from = interaction.options.getInteger('from');
    const to = interaction.options.getInteger('to');
    const max = queue.songs.length - 1;

    if (from > max || to > max) {
      return interaction.reply({ embeds: [errorEmbed(`Posisi tidak valid! Queue punya ${max} lagu.`)], ephemeral: true });
    }

    const song = queue.songs.splice(from, 1)[0];
    queue.songs.splice(to, 0, song);

    await interaction.reply({
      embeds: [successEmbed('Moved', `↕️ **${song.name}** dipindah dari posisi **#${from}** ke **#${to}**`)],
    });
  },
};
