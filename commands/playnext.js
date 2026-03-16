const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription('Tambah lagu ke posisi berikutnya di queue')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Nama lagu atau URL').setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const member = interaction.member;
    if (!member.voice.channel) {
      return interaction.editReply({ embeds: [errorEmbed('Kamu harus join voice channel dulu!')] });
    }

    const queue = client.distube.getQueue(interaction.guildId);
    const query = interaction.options.getString('query');

    try {
      await client.distube.play(member.voice.channel, query, {
        member,
        textChannel: interaction.channel,
        position: queue ? 1 : 0, // inject to position 1 (next)
      });

      if (!interaction.replied) {
        await interaction.editReply({ content: '✅ Lagu ditambahkan ke urutan berikutnya!' });
      }
    } catch (err) {
      console.error('[PLAYNEXT ERROR]', err);
      await interaction.editReply({ embeds: [errorEmbed('Gagal menambahkan lagu!')] });
    }
  },
};
