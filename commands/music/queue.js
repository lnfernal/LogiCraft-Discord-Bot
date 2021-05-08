module.exports = {
  commands: ["queue", "q"],
  expectedArgs: "<link>",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments, text, client) => {
    if (client.player.isPlaying(message)) {
      let audio = await client.player.addToQueue(message, text)
      if (audio) message.channel.send(`**${audio.name}** se ha puesto en cola`)
    } else {
      message.channel.send(`Debe haber algo en reproducción`)
    }
  },
}
