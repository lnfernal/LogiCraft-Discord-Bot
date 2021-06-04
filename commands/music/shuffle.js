module.exports = {
  commands: "shuffle",
  callback: async (message, args, text, client) => {
    try {
      let shuffle = client.player.shuffle(message)
      if (shuffle) message.channel.send(`La cola se ha aleatorizado`)
    } catch (e) {
      message.channel.send(`No hay ninguna cola en curso`)
    }
  },
}
