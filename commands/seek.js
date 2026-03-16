const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Lompat ke waktu tertentu di lagu')
    .addStringOption(opt =>
      opt.setName('time')
        .setDescription('Waktu (contoh: 1:30, 90, atau +30 / -30)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const input = interaction.options.getString('time').trim();
    let seconds;

    if (input.startsWith('+') || input.startsWith('-')) {
      const delta = parseInt(input);
      seconds = Math.max(0, queue.currentTime + delta);
    } else if (input.includes(':')) {
      const parts = input.split(':').map(Number);
      if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
      else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      seconds = parseInt(input);
    }

    if (isNaN(seconds) || seconds < 0) {
      return interaction.reply({ embeds: [errorEmbed('Format waktu tidak valid!')], ephemeral: true });
    }

    const dur = queue.songs[0]?.duration;
    if (dur && seconds > dur) {
      return interaction.reply({ embeds: [errorEmbed('Waktu melebihi durasi lagu!')], ephemeral: true });
    }

    try {
      await queue.seek(seconds);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      await interaction.reply({
        embeds: [successEmbed('Seeked!', `⏩ Lompat ke **${m}:${String(s).padStart(2, '0')}**`)],
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed('Tidak bisa seek lagu ini!')], ephemeral: true });
    }
  },
};
