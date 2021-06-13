module.exports = {
  commands: ["ping", "latency"],
  expectedArgs: "<content>",
  callback: async (message, args, text, client) => {
    const emojis = await require("@emojis").logibotEmojis(client)
    const moves = [`${emojis.little}`, `${emojis.moderate}`,`${emojis.high}`],
      { channel, member } = message,
      changeDelay = 1700,
      uptime = 10,
      changeMoves = async () => {
        const msgExists = await channel.messages.fetch(danceMessage.id).catch(console.error)

        if (!ended && msgExists)
          setTimeout(() => {
            changeMoves()
          }, changeDelay)
        await danceMessage.edit(moves[Math.floor(Math.random() * moves.length)].concat(` **${client.ws.ping}ms**`))
      }

    let ended = false,
      danceMessage

    await channel.send(moves[Math.floor(Math.random() * moves.length)].concat(` **${client.ws.ping}ms**`)).then(msg => {
      danceMessage = msg
    })
    setTimeout(() => {
      changeMoves()
    }, changeDelay)
    setTimeout(() => {
      ended = true
    }, uptime * 1000)
  },
}
