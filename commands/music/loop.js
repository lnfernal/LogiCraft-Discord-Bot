require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: "loop",
  expectedArgs: '<s|q|stop>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, client) => {
    const { author, member } = message

    if (args[0] === "song" || args[0] === "s") {
      try {
        await client.player.setRepeatMode(message, true)
        await message.channel.send(await messageHandler("msc_loop_s", member))
      } catch (e) {
        await message.channel.send(
          await messageHandler("msc_non_pyng", member, {
            username: author.username,
          })
        )
      }
    } else if (args[0] === "queue" || args[0] === "q") {
      try {
        await client.player.setQueueRepeatMode(message, true)
        await message.channel.send(await messageHandler("msc_loop_q", member))
      } catch (e) {
        await message.channel.send(
          await messageHandler("msc_non_q", member, {
            username: author.username,
          })
        )
      }
    } else if (args[0] === "stop") {
      try {
        await client.player.setRepeatMode(message, false)
        await client.player.setQueueRepeatMode(message, false)
        await message.channel.send(await messageHandler("msc_loop_stop", member))
      } catch (e) {
        console.log(e)
      }
    } else {
      await message.channel.send(
        await messageHandler("msc_wrng_loop", member, {
          username: author.username,
        })
      )
    }
  },
}
