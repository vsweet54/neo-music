const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, infoEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Atur atau lihat volume musik')
    .addIntegerOption(opt =>
      opt.setName('level')
        .setDescription('Volume 0-100 (kosongkan untuk lihat volume saat ini)')
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const level = interaction.options.getInteger('level');

    if (level === null) {
      const vol = queue.volume;
      const bar = '█'.repeat(Math.floor(vol / 10)) + '░'.repeat(10 - Math.floor(vol / 10));
      return interaction.reply({
        embeds: [infoEmbed('🔊 Volume', `\`[${bar}]\` **${vol}%**`)],
        ephemeral: true,
      });
    }

    queue.setVolume(level);
    const emoji = level === 0 ? '🔇' : level < 50 ? '🔉' : '🔊';
    await interaction.reply({
      embeds: [successEmbed('Volume Changed', `${emoji} Volume diset ke **${level}%**`)],
    });
  },
};
