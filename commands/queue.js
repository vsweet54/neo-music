const { SlashCommandBuilder } = require('discord.js');
const { queueEmbed, errorEmbed } = require('../utils/embeds');
const { checkQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Tampilkan daftar antrian lagu')
    .addIntegerOption(opt =>
      opt.setName('page')
        .setDescription('Halaman queue (default: 1)')
        .setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = checkQueue(interaction, client);
    if (!queue) return;

    const page = interaction.options.getInteger('page') || 1;
    const reply = queueEmbed(queue, page);
    reply.ephemeral = true;

    const msg = await interaction.reply({ ...reply, fetchReply: true });

    // Handle pagination buttons
    const collector = msg.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async btn => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: 'Ini bukan queuemu!', ephemeral: true });
      }
      const [, , currentPage] = btn.customId.split('_');
      const newPage = btn.customId.includes('next')
        ? parseInt(currentPage) + 1
        : parseInt(currentPage) - 1;

      const freshQueue = client.distube.getQueue(interaction.guildId);
      if (!freshQueue) return btn.update({ content: 'Queue sudah selesai!', embeds: [], components: [] });

      await btn.update(queueEmbed(freshQueue, newPage));
    });
  },
};
