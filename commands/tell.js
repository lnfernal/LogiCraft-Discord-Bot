const ss = require("string-similarity")

module.exports = {
  commands: "tell",
  expectedArgs: "<channel> <content>",
  permissionError: "No tienes permisos para controlarme",
  minArgs: 2,
  maxArgs: 499,
  cooldown: 2,
  requiredRoles: ["666297857929642014"],
  callback: async (message, arguments, text, client) => {
    const desiredChannelName = arguments[0], math = require("../utils/math.js")
    const { guild } = message
    let channels = [],
        channelNames = [],
      desiredChannelId

    await guild.channels.cache.each(channel => {
      if (channel.type == "text") {
        channelNames.push(channel.name)
        channels.push({
          name: channel.name,
          id: channel.id,
        })
      }
    })
    const similarChannel = ss.findBestMatch(desiredChannelName, channelNames)
      .bestMatch.target
    channels.forEach(c => {
      if (c.name == similarChannel) {
        desiredChannelId = c.id
        return
      }
    })
    const desiredChannel = guild.channels.cache.get(desiredChannelId)
    if (
      ss.compareTwoStrings(desiredChannelName, similarChannel) < 0.1 || !desiredChannel
    )
      return
    arguments.shift()
    msg = arguments.join(" ")
    desiredChannel.startTyping()
    setTimeout(() => {
      desiredChannel.stopTyping()
      desiredChannel.send(
        msg.replace(/<@!?(\d+)>|^\/+/g, "")
      )
    }, (msg.length / 200) * 60000 * math.clamp(Math.random() * 1 + 0.2, 0.2, 0.5))
  },
}
