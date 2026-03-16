const { SlashCommandBuilder } = require('discord.js');
const { nowPlayingEmbed, errorEmbed } = require('../utils/embeds');
const { checkQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Lihat lagu yang sedang diputar'),

  async execute(interaction, client) {
    const queue = checkQueue(interaction, client);
    if (!queue) return;

    const song = queue.songs[0];
    if (!song) {
      return interaction.reply({ embeds: [errorEmbed('Tidak ada lagu yang diputar!')], ephemeral: true });
    }

    const reply = nowPlayingEmbed(queue, song);
    const msg = await interaction.reply({ ...reply, fetchReply: true });

    // Handle now playing buttons
    const collector = msg.createMessageComponentCollector({ time: 300000 });
    collector.on('collect', async btn => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: 'Kamu tidak bisa mengontrol musik orang lain!', ephemeral: true });
      }
      await handleMusicButton(btn, client, interaction);
    });
  },
};

async function handleMusicButton(btn, client, originalInteraction) {
  const queue = client.distube.getQueue(btn.guildId);
  const { successEmbed, errorEmbed, nowPlayingEmbed, queueEmbed } = require('../utils/embeds');

  if (!queue) return btn.update({ content: 'Queue sudah selesai!', embeds: [], components: [] });

  try {
    switch (btn.customId) {
      case 'music_pause':
        if (queue.paused) { queue.resume(); await btn.reply({ content: '▶️ Resumed!', ephemeral: true }); }
        else { queue.pause(); await btn.reply({ content: '⏸️ Paused!', ephemeral: true }); }
        break;
      case 'music_skip':
        await queue.skip();
        await btn.reply({ content: '⏭️ Skipped!', ephemeral: true });
        break;
      case 'music_stop':
        await queue.stop();
        await btn.update({ content: '⏹️ Stopped!', embeds: [], components: [] });
        break;
      case 'music_shuffle':
        queue.shuffle();
        await btn.reply({ content: '🔀 Queue diacak!', ephemeral: true });
        break;
      case 'music_loop':
        const modes = [0, 1, 2];
        const next = modes[(queue.repeatMode + 1) % 3];
        queue.setRepeatMode(next);
        const modeNames = ['🔁 Off', '🔂 Song', '🔁 Queue'];
        await btn.reply({ content: `Loop: ${modeNames[next]}`, ephemeral: true });
        break;
      case 'music_volup':
        const newVolUp = Math.min(100, queue.volume + 10);
        queue.setVolume(newVolUp);
        await btn.reply({ content: `🔊 Volume: ${newVolUp}%`, ephemeral: true });
        break;
      case 'music_voldown':
        const newVolDown = Math.max(0, queue.volume - 10);
        queue.setVolume(newVolDown);
        await btn.reply({ content: `🔉 Volume: ${newVolDown}%`, ephemeral: true });
        break;
      case 'music_queue':
        await btn.reply({ ...queueEmbed(queue, 1), ephemeral: true });
        break;
      case 'music_lyrics':
        await btn.reply({ content: '📝 Gunakan `/lyrics` untuk melihat lirik!', ephemeral: true });
        break;
      default:
        await btn.reply({ content: 'Unknown button!', ephemeral: true });
    }
  } catch (err) {
    console.error('[BUTTON ERROR]', err);
    if (!btn.replied) await btn.reply({ content: 'Error!', ephemeral: true });
  }
}
