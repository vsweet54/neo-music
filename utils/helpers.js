const { errorEmbed } = require('./embeds');

// Check if user is in a voice channel
function checkVoiceChannel(interaction) {
  const member = interaction.member;
  if (!member.voice.channel) {
    interaction.reply({
      embeds: [errorEmbed('Kamu harus join voice channel dulu!')],
      ephemeral: true,
    });
    return false;
  }
  return true;
}

// Check if queue exists
function checkQueue(interaction, client) {
  const queue = client.distube.getQueue(interaction.guildId);
  if (!queue) {
    interaction.reply({
      embeds: [errorEmbed('Tidak ada lagu yang sedang diputar!')],
      ephemeral: true,
    });
    return null;
  }
  return queue;
}

// Check both voice + queue
function checkVoiceAndQueue(interaction, client) {
  if (!checkVoiceChannel(interaction)) return null;
  return checkQueue(interaction, client);
}

module.exports = { checkVoiceChannel, checkQueue, checkVoiceAndQueue };
