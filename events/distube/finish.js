const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'finish',
  async execute(queue) {
    if (queue.nowPlayingMessage) {
      queue.nowPlayingMessage.delete().catch(() => {});
    }
    const embed = new EmbedBuilder()
      .setColor(COLORS.info)
      .setDescription('✅ Queue selesai! Bot akan keluar dari voice channel dalam 10 detik.');
    await queue.textChannel?.send({ embeds: [embed] });
  },
};
