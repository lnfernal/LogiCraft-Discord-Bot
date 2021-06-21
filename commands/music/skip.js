module.exports = {
  commands: "skip",
  callback: async (message, args, text, client) => {
    try {
      await client.player.skip(message)
      setTimeout(() => {
        require("./nowplaying").callback(message, args, text, client)
      }, 1000)
    } catch (e) {
      await message.channel.send("No se ha podido skippear")
    }
  },
}
