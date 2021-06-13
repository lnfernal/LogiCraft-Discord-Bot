module.exports = {
  commands: ["ping", "latency"],
  expectedArgs: "<content>",
  callback: async (message, args, text, client) => {
    const emojis = require("@emojis").logibotEmojis(client)
    const moves = [`${emojis.little}`, `${emojis.moderate}`,`${emojis.high}`],
      { channel, member } = message,
      changeDelay = 1700,
      uptime = 10,
      changeMoves = async () => {
        const currentMoveIndex = moves.indexOf(danceMessage.content)
        const msgExists = await channel.messages.fetch(danceMessage.id).catch(console.error)

        if (!ended && msgExists)
          setTimeout(() => {
            changeMoves()
          }, changeDelay)
        await danceMessage.edit(currentMoveIndex == moves.length - 1 ? moves[0].concat(` **${client.ws.ping}ms**`) : moves[currentMoveIndex + 1].concat(` **${client.ws.ping}ms**`))
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
