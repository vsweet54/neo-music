const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Hapus lagu dari queue berdasarkan posisi')
    .addIntegerOption(opt =>
      opt.setName('position')
        .setDescription('Nomor posisi lagu di queue')
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const pos = interaction.options.getInteger('position');
    if (pos >= queue.songs.length) {
      return interaction.reply({ embeds: [errorEmbed(`Queue hanya punya ${queue.songs.length - 1} lagu!`)], ephemeral: true });
    }

    const removed = queue.songs[pos];
    queue.songs.splice(pos, 1);

    await interaction.reply({
      embeds: [successEmbed('Removed', `🗑️ **${removed.name}** dihapus dari queue!`)],
    });
  },
};
