const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar lagu dari YouTube, Spotify, atau SoundCloud')
    .addStringOption(opt =>
      opt.setName('query')
        .setDescription('Nama lagu, URL YouTube/Spotify/SoundCloud, atau playlist')
        .setRequired(true)
        .setAutocomplete(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const member = interaction.member;
    if (!member.voice.channel) {
      return interaction.editReply({
        embeds: [errorEmbed('Kamu harus join voice channel dulu!')],
      });
    }

    const query = interaction.options.getString('query');

    try {
      await client.distube.play(member.voice.channel, query, {
        member,
        textChannel: interaction.channel,
        interaction,
      });

      // Reply is handled by distube events (playSong/addSong)
      if (!interaction.replied) {
        await interaction.editReply({ content: '🔍 Mencari lagu...' });
      }
    } catch (err) {
      console.error('[PLAY ERROR]', err);
      let msg = 'Terjadi error saat memutar lagu.';
      if (err.message?.includes('No result')) msg = 'Lagu tidak ditemukan!';
      else if (err.message?.includes('private')) msg = 'Video/playlist ini private!';
      else if (err.message?.includes('age')) msg = 'Video ini dibatasi usia!';

      await interaction.editReply({ embeds: [errorEmbed(msg)] });
    }
  },
};
