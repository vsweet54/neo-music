const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, infoEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');
const { FILTER_CHOICES } = require('../utils/filters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Terapkan filter audio pada musik')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Pilih filter')
        .setRequired(true)
        .addChoices(...FILTER_CHOICES.slice(0, 25)) // Discord max 25 choices
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const filterName = interaction.options.getString('name');

    try {
      if (filterName === 'clear') {
        await queue.filters.clear();
        return interaction.reply({
          embeds: [successEmbed('Filters Cleared', '✨ Semua filter dimatikan!')],
        });
      }

      const active = queue.filters.names;
      if (active.includes(filterName)) {
        await queue.filters.remove(filterName);
        await interaction.reply({
          embeds: [successEmbed('Filter Removed', `🎛️ Filter **${filterName}** dimatikan!`)],
        });
      } else {
        await queue.filters.add(filterName);
        await interaction.reply({
          embeds: [successEmbed('Filter Applied', `🎛️ Filter **${filterName}** diterapkan!\n\nAktif: \`${queue.filters.names.join(', ') || 'none'}\``)],
        });
      }
    } catch (err) {
      console.error('[FILTER ERROR]', err);
      await interaction.reply({ embeds: [errorEmbed('Filter tidak valid atau terjadi error!')], ephemeral: true });
    }
  },
};
