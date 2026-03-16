const { EmbedBuilder } = require('discord.js');
const { COLORS, formatDuration } = require('../../utils/embeds');

module.exports = {
  name: 'addList',
  async execute(queue, playlist) {
    const total = playlist.songs.reduce((acc, s) => acc + (s.duration || 0), 0);
    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setAuthor({ name: '📋 Playlist Added to Queue' })
      .setTitle(playlist.name.slice(0, 60))
      .setURL(playlist.url)
      .setThumbnail(playlist.thumbnail || playlist.songs[0]?.thumbnail)
      .addFields(
        { name: '🎵 Songs', value: `${playlist.songs.length}`, inline: true },
        { name: '⏱️ Duration', value: formatDuration(total * 1000), inline: true },
        { name: '👤 Added by', value: `${playlist.user}`, inline: true },
      )
      .setTimestamp();

    await queue.textChannel?.send({ embeds: [embed] });
  },
};
