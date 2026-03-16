const { addedEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'addSong',
  async execute(queue, song) {
    const position = queue.songs.indexOf(song);
    await queue.textChannel?.send({ embeds: [addedEmbed(song, position)] });
  },
};
