module.exports = {
  commands: "skip",
  callback: async (message, args, text, client) => {
    let songs
    try {
      if (isNaN(args[0])) songs = 1
      else songs = args[0]
    } catch (e) {
      songs = 1
    }

    try {
      const promises = []
      for (let i = 0; i < songs; i++) promises.push(client.player.skip(message))
      await Promise.all(promises)
      await setTimeout(() => {
        require("./nowplaying").callback(message, args, text, client)
      }, 1000)
    } catch (e) {
      console.log(e)
      await message.channel.send("No se ha podido skippear")
    }
  },
}
