module.exports = {
  commands: "skip",
  expectedArgs: "[songs]",
  maxArgs: 1,
  callback: async (message, args, text, client) => {
    let songs
    if (args)
      if (isNaN(args[0])) return
      else songs = args[0]
    else songs = 1

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
