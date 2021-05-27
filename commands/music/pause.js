module.exports = {
  commands: "pause",
  callback: async (message, args, text, client) => {
    try {
      let pause = await client.player.pause(message)
      if (pause) message.channel.send(`Se ha pausado`)
    } catch (e) {
      message.channel.send(`No se está reproduciendo nada`)
    }
  },
}
