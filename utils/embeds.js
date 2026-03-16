const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// ─── Color Palette ────────────────────────────────────────────
const COLORS = {
  primary: 0x5865F2,   // Discord Blurple
  success: 0x57F287,   // Green
  warning: 0xFEE75C,   // Yellow
  error: 0xED4245,     // Red
  info: 0x00B0F4,      // Cyan
  music: 0xFF6B9D,     // Pink (music vibe)
};

// ─── Progress Bar ─────────────────────────────────────────────
function createProgressBar(current, total, size = 15) {
  if (!total || total === Infinity) return '⎯'.repeat(size) + ' 🔴 LIVE';
  const percent = current / total;
  const filled = Math.round(size * percent);
  const empty = size - filled;
  const bar = '▬'.repeat(Math.max(0, filled - 1)) + (filled > 0 ? '🔘' : '') + '▬'.repeat(empty);
  return bar;
}

// ─── Duration Format ──────────────────────────────────────────
function formatDuration(ms) {
  if (!ms || ms === Infinity) return '🔴 LIVE';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Now Playing Embed ────────────────────────────────────────
function nowPlayingEmbed(queue, song) {
  const current = queue.currentTime * 1000;
  const total = song.duration * 1000;
  const bar = createProgressBar(current, total);
  const timeText = `\`${formatDuration(current)}\` ${bar} \`${formatDuration(total)}\``;

  const loopMode = ['🔁 Off', '🔂 Song', '🔁 Queue'][queue.repeatMode] || '🔁 Off';
  const filterNames = queue.filters.names.length > 0
    ? queue.filters.names.join(', ')
    : 'None';

  const embed = new EmbedBuilder()
    .setColor(COLORS.music)
    .setAuthor({ name: '🎵 Now Playing', iconURL: 'https://cdn.discordapp.com/emojis/1234567890.gif' })
    .setTitle(song.name.length > 60 ? song.name.slice(0, 57) + '...' : song.name)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: '⏱️ Duration', value: timeText, inline: false },
      { name: '🎤 Artist', value: song.uploader?.name || 'Unknown', inline: true },
      { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
      { name: '🔁 Loop', value: loopMode, inline: true },
      { name: '🎛️ Filter', value: filterNames, inline: true },
      { name: '📋 In Queue', value: `${queue.songs.length - 1} songs`, inline: true },
      { name: '👤 Requested by', value: `${song.user}`, inline: true },
    )
    .setFooter({ text: `NEO MUSIC • Queue: ${queue.songs.length} songs` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('music_previous').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_pause').setEmoji('⏸️').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('music_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('music_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Success),
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('music_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_voldown').setEmoji('🔉').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_volup').setEmoji('🔊').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_queue').setEmoji('📋').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_lyrics').setEmoji('📝').setStyle(ButtonStyle.Secondary),
  );

  return { embeds: [embed], components: [row, row2] };
}

// ─── Queue Embed ──────────────────────────────────────────────
function queueEmbed(queue, page = 1) {
  const songsPerPage = 10;
  const songs = queue.songs.slice(1); // exclude current
  const totalPages = Math.max(1, Math.ceil(songs.length / songsPerPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * songsPerPage;
  const end = start + songsPerPage;
  const pageSongs = songs.slice(start, end);

  const songList = pageSongs.length > 0
    ? pageSongs.map((s, i) =>
        `\`${start + i + 1}.\` [${s.name.length > 45 ? s.name.slice(0, 42) + '...' : s.name}](${s.url})\n` +
        `      \`${formatDuration(s.duration * 1000)}\` • ${s.user}`
      ).join('\n\n')
    : 'Queue kosong!';

  const totalDuration = queue.songs.reduce((acc, s) => acc + (s.duration || 0), 0);

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle('📋 Music Queue')
    .setDescription(
      `**🎵 Now Playing:**\n[${queue.songs[0]?.name || 'Nothing'}](${queue.songs[0]?.url || '#'})\n\n` +
      `**📃 Up Next:**\n${songList}`
    )
    .addFields(
      { name: '🎵 Total Songs', value: `${queue.songs.length}`, inline: true },
      { name: '⏱️ Total Duration', value: formatDuration(totalDuration * 1000), inline: true },
      { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
    )
    .setFooter({ text: `Page ${currentPage}/${totalPages} • NEO MUSIC` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`queue_prev_${currentPage}`)
      .setEmoji('◀️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage <= 1),
    new ButtonBuilder()
      .setCustomId(`queue_next_${currentPage}`)
      .setEmoji('▶️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage >= totalPages),
  );

  return { embeds: [embed], components: [row], ephemeral: true };
}

// ─── Simple Reply Embeds ──────────────────────────────────────
function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setDescription(`✅ **${title}**${description ? `\n${description}` : ''}`)
    .setTimestamp();
}

function errorEmbed(description) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setDescription(`❌ ${description}`)
    .setTimestamp();
}

function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function addedEmbed(song, position) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.music)
    .setAuthor({ name: '➕ Added to Queue' })
    .setTitle(song.name.length > 60 ? song.name.slice(0, 57) + '...' : song.name)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: '⏱️ Duration', value: formatDuration(song.duration * 1000), inline: true },
      { name: '📍 Position', value: `#${position}`, inline: true },
      { name: '👤 Requested by', value: `${song.user}`, inline: true },
    )
    .setTimestamp();
  return embed;
}

module.exports = {
  nowPlayingEmbed,
  queueEmbed,
  successEmbed,
  errorEmbed,
  infoEmbed,
  addedEmbed,
  formatDuration,
  COLORS,
};
