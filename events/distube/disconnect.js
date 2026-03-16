module.exports = {
  name: 'disconnect',
  async execute(queue) {
    if (queue.nowPlayingMessage) {
      queue.nowPlayingMessage.delete().catch(() => {});
    }
    await queue.textChannel?.send({ content: '👋 Bot disconnected dari voice channel.' });
  },
};
