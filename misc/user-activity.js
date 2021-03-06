let activityUsersChannel
const Discord = require("discord.js")

module.exports = {
  init: async guild => {
    activityUsersChannel = await guild.channels.cache.get("666295715726622752")
  },
  onJoin: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        activityUsersChannel.send(`\`\`\`fix\n${member.user.username} joined the game\n\`\`\``)
      })
  },
  onRemove: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        activityUsersChannel.send(`\`\`\`fix\n${member.user.username} left the game\n\`\`\``)
      })
  },
}
