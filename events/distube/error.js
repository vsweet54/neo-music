const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'error',
  async execute(queue, error) {
    console.error('[DISTUBE ERROR]', error);
    const embed = new EmbedBuilder()
      .setColor(COLORS.error)
      .setDescription(`❌ **Error:** ${error.message || 'Unknown error'}`);
    queue?.textChannel?.send({ embeds: [embed] }).catch(() => {});
  },
};
