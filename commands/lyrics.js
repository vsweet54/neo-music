const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Cari lirik lagu')
    .addStringOption(opt =>
      opt.setName('title').setDescription('Judul lagu (kosong = lagu yang sedang diputar)')
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    let title = interaction.options.getString('title');
    if (!title) {
      const queue = client.distube.getQueue(interaction.guildId);
      if (!queue) return interaction.editReply({ embeds: [errorEmbed('Tidak ada lagu yang diputar dan kamu tidak menulis judul!')] });
      title = queue.songs[0].name;
    }

    try {
      // Using genius-lyrics-api if token provided, else simple embed
      if (process.env.GENIUS_TOKEN) {
        const { getLyrics, searchSong } = require('genius-lyrics-api');
        const options = { apiKey: process.env.GENIUS_TOKEN, title, artist: '', optimizeQuery: true };
        const lyrics = await getLyrics(options);

        if (!lyrics) {
          return interaction.editReply({ embeds: [errorEmbed(`Lirik untuk **${title}** tidak ditemukan!`)] });
        }

        const chunks = lyrics.match(/[\s\S]{1,4000}/g) || [];
        const embeds = chunks.slice(0, 3).map((chunk, i) =>
          new EmbedBuilder()
            .setColor(COLORS.music)
            .setTitle(i === 0 ? `📝 ${title}` : null)
            .setDescription(chunk)
            .setFooter(i === chunks.length - 1 ? { text: 'Powered by Genius' } : null)
        );

        await interaction.editReply({ embeds: [embeds[0]] });
        for (let i = 1; i < embeds.length; i++) {
          await interaction.followUp({ embeds: [embeds[i]] });
        }
      } else {
        // No token: redirect to Genius
        const encoded = encodeURIComponent(title);
        const embed = new EmbedBuilder()
          .setColor(COLORS.info)
          .setTitle(`📝 Lirik: ${title}`)
          .setDescription(`[Cari di Genius](https://genius.com/search?q=${encoded})\n[Cari di AZLyrics](https://search.azlyrics.com/search.php?q=${encoded})`)
          .setFooter({ text: 'Set GENIUS_TOKEN di .env untuk lirik langsung di Discord!' });

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (err) {
      console.error('[LYRICS ERROR]', err);
      await interaction.editReply({ embeds: [errorEmbed('Gagal mengambil lirik!')] });
    }
  },
};
