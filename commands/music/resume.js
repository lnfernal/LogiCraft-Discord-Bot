module.exports = {
  commands: "resume",
  callback: async (message, args, text, client) => {
    try {
      let pause = await client.player.resume(message)
      if (pause) message.channel.send(`Se ha reanudado`)
    } catch (e) {
      message.channel.send(`No hay nada pausado`)
    }
  },
}
