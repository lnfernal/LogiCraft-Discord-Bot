require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: ["clearqueue", "cq", "clear"],
  callback: async (message, args, text, client) => {
    let cleared
    const { member, author } = message
    try {
      await client.player.clearQueue(message)
      await message.channel.send(await messageHandler("msc_q_empty", member))
    } catch (e) {
      await message.channel.send(
        await messageHandler("msc_non_q", member, {
          username: author.username,
        })
      )
    }
  },
}
