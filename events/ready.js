const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📡 Serving ${client.guilds.cache.size} servers`);

    const activities = [
      { name: '/play • NEO MUSIC', type: ActivityType.Listening },
      { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
      { name: 'music 🎵', type: ActivityType.Playing },
    ];

    let i = 0;
    setInterval(() => {
      const act = activities[i % activities.length];
      client.user.setPresence({ activities: [act], status: 'online' });
      i++;
    }, 15000);
  },
};
