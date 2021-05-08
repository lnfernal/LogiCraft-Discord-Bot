let activityUsersChannel
const Discord = require("discord.js")

module.exports = {
  init: guild => {
    activityUsersChannel = guild.channels.cache.get("666295715726622752")
  },
  onJoin: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        activityUsersChannel.send(`\`\`\`fix\n${member.user.username} joined the game)
      })
  },
  onRemove: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        activityUsersChannel.send(`\`\`\`fix\n${member.user.username} left the game)
      })
  },
}
