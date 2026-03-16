const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const { checkVoiceAndQueue } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Atur mode loop/repeat')
    .addStringOption(opt =>
      opt.setName('mode')
        .setDescription('Mode loop')
        .setRequired(true)
        .addChoices(
          { name: '🔁 Off - Matikan loop', value: '0' },
          { name: '🔂 Song - Loop lagu ini', value: '1' },
          { name: '🔁 Queue - Loop semua queue', value: '2' },
        )
    ),

  async execute(interaction, client) {
    const queue = checkVoiceAndQueue(interaction, client);
    if (!queue) return;

    const mode = parseInt(interaction.options.getString('mode'));
    queue.setRepeatMode(mode);

    const names = ['🔁 Loop dimatikan', '🔂 Looping lagu ini', '🔁 Looping semua queue'];
    await interaction.reply({ embeds: [successEmbed('Loop Mode', names[mode])] });
  },
};
