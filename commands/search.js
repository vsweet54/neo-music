const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Cari lagu dan pilih dari hasil pencarian')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Kata kunci pencarian').setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const member = interaction.member;
    if (!member.voice.channel) {
      return interaction.editReply({ embeds: [errorEmbed('Kamu harus join voice channel dulu!')] });
    }

    const query = interaction.options.getString('query');

    try {
      const results = await client.distube.search(query, { limit: 10 });
      if (!results || results.length === 0) {
        return interaction.editReply({ embeds: [errorEmbed('Tidak ada hasil ditemukan!')] });
      }

      const { formatDuration } = require('../utils/embeds');
      const options = results.map((s, i) => ({
        label: s.name.slice(0, 100),
        description: `${s.uploader?.name || 'Unknown'} • ${formatDuration(s.duration * 1000)}`,
        value: s.url,
        emoji: `${i + 1}️⃣`,
      }));

      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(`🔍 Hasil Pencarian: "${query}"`)
        .setDescription(results.map((s, i) =>
          `**${i + 1}.** [${s.name.slice(0, 50)}](${s.url})\n` +
          `   \`${formatDuration(s.duration * 1000)}\` • ${s.uploader?.name || 'Unknown'}`
        ).join('\n\n'))
        .setFooter({ text: 'Pilih lagu dari dropdown di bawah • Expires in 30s' });

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('search_select')
          .setPlaceholder('Pilih lagu...')
          .addOptions(options)
      );

      const msg = await interaction.editReply({ embeds: [embed], components: [row] });

      const collector = msg.createMessageComponentCollector({ time: 30000 });
      collector.on('collect', async sel => {
        if (sel.user.id !== interaction.user.id) {
          return sel.reply({ content: 'Ini bukan pencarianmu!', ephemeral: true });
        }
        await sel.deferUpdate();
        const url = sel.values[0];
        await client.distube.play(member.voice.channel, url, {
          member,
          textChannel: interaction.channel,
          interaction,
        });
        await interaction.editReply({ embeds: [embed.setFooter({ text: '✅ Lagu ditambahkan!' })], components: [] });
        collector.stop();
      });

      collector.on('end', (_, reason) => {
        if (reason === 'time') {
          interaction.editReply({ components: [] }).catch(() => {});
        }
      });
    } catch (err) {
      console.error('[SEARCH ERROR]', err);
      await interaction.editReply({ embeds: [errorEmbed('Gagal mencari lagu!')] });
    }
  },
};
