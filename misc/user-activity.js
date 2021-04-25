let activityUsersChannel;

module.exports = {
  init: (guild) => {
    activityUsersChannel = guild.channels.cache.get("804646865621614593");
  },
  onJoin: (member) => {
    activityUsersChannel.send(`🟢 **${member.user.username}** se ha unido!`);
  },
  onRemove: (member) => {
    activityUsersChannel.send(`🔴 **${member.user.username}** se ha ido :c`);
  },
};
