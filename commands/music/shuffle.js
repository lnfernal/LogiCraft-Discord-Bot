require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: "shuffle",
  callback: async (message, args, text, client) => {
    const { author, member } = message
    try {
      let shuffle = client.player.shuffle(message)
      if (shuffle) message.channel.send(`La cola se ha aleatorizado`)
    } catch (e) {
      message.channel.send(
        await message.channel.send(
          await messageHandler("msc_non_q", member, {
            username: author.username,
          })
        )
      )
    }
  },
}
