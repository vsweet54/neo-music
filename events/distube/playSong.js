const { nowPlayingEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'playSong',
  async execute(queue, song, client) {
    const reply = nowPlayingEmbed(queue, song);

    // Delete old now-playing message if exists
    if (queue.nowPlayingMessage) {
      queue.nowPlayingMessage.delete().catch(() => {});
    }

    const msg = await queue.textChannel?.send(reply);
    queue.nowPlayingMessage = msg;

    if (!msg) return;

    // Handle interactive buttons
    const collector = msg.createMessageComponentCollector({ time: (song.duration + 60) * 1000 });
    collector.on('collect', async btn => {
      const member = btn.guild.members.cache.get(btn.user.id);
      if (!member?.voice.channel) {
        return btn.reply({ content: '❌ Kamu harus di voice channel!', ephemeral: true });
      }

      const { successEmbed, nowPlayingEmbed: npEmbed, queueEmbed } = require('../../utils/embeds');
      const q = client.distube.getQueue(btn.guildId);
      if (!q) return btn.update({ content: '⏹️ Queue sudah selesai!', embeds: [], components: [] });

      try {
        switch (btn.customId) {
          case 'music_pause':
            if (q.paused) { q.resume(); await btn.reply({ content: '▶️ Resumed!', ephemeral: true }); }
            else { q.pause(); await btn.reply({ content: '⏸️ Paused!', ephemeral: true }); }
            break;
          case 'music_skip':
            await q.skip();
            await btn.reply({ content: '⏭️ Skipped!', ephemeral: true });
            break;
          case 'music_stop':
            await q.stop();
            await btn.update({ content: '⏹️ Musik dihentikan!', embeds: [], components: [] });
            collector.stop();
            break;
          case 'music_shuffle':
            q.shuffle();
            await btn.reply({ content: `🔀 ${q.songs.length - 1} lagu diacak!`, ephemeral: true });
            break;
          case 'music_loop': {
            const next = (q.repeatMode + 1) % 3;
            q.setRepeatMode(next);
            const modes = ['🔁 Off', '🔂 Song', '🔁 Queue'];
            await btn.reply({ content: `Loop: **${modes[next]}**`, ephemeral: true });
            break;
          }
          case 'music_volup': {
            const v = Math.min(100, q.volume + 10);
            q.setVolume(v);
            await btn.reply({ content: `🔊 Volume: **${v}%**`, ephemeral: true });
            break;
          }
          case 'music_voldown': {
            const v = Math.max(0, q.volume - 10);
            q.setVolume(v);
            await btn.reply({ content: `🔉 Volume: **${v}%**`, ephemeral: true });
            break;
          }
          case 'music_queue':
            await btn.reply({ ...queueEmbed(q, 1), ephemeral: true });
            break;
          case 'music_lyrics':
            await btn.reply({ content: '📝 Gunakan `/lyrics` untuk lihat lirik!', ephemeral: true });
            break;
          case 'music_previous':
            await q.previous();
            await btn.reply({ content: '⏮️ Memutar lagu sebelumnya!', ephemeral: true });
            break;
          default:
            await btn.reply({ content: '❓ Unknown button', ephemeral: true });
        }
      } catch (err) {
        console.error('[BUTTON ERR]', err);
        if (!btn.replied && !btn.deferred) await btn.reply({ content: '❌ Error!', ephemeral: true });
      }
    });
  },
};
