let activityUsersChannel
const Discord = require("discord.js")

module.exports = {
  init: guild => {
    activityUsersChannel = guild.channels.cache.get("804646865621614593")
  },
  onJoin: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        const embed = new Discord.MessageEmbed().setTitle(
          `${logiEmojis.upvote} ${member.displayName}`
        )
        activityUsersChannel.send(embed)
      })
  },
  onRemove: async (member, client) => {
    await require("../utils/emojis.js")
      .logibotEmojis(client)
      .then(logiEmojis => {
        const embed = new Discord.MessageEmbed().setTitle(
          `${logiEmojis.downvote} ${member.displayName}`
        )
        activityUsersChannel.send(embed)
      })
  },
}
