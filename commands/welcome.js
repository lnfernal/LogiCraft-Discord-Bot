module.exports = {
  commands: "welcome",
  callback: async (message, args, text, client) => {
    const moves = ["o/", "o)"],
      { channel, member } = message,
      changeDelay = 1700,
      uptime = 10,
      changeMoves = async () => {
        const currentMoveIndex = moves.indexOf(welcomeMessage.content)
        const msgExists = await channel.messages.fetch(welcomeMessage.id).catch(console.error)

        if (!ended && msgExists)
          setTimeout(() => {
            changeMoves()
          }, changeDelay)
        await welcomeMessage.edit(currentMoveIndex == moves.length - 1 ? moves[0] : moves[currentMoveIndex + 1])
      }

    let ended = false,
      welcomeMessage

    await channel.send(moves[Math.floor(Math.random() * moves.length)]).then(msg => {
      welcomeMessage = msg
    })
    setTimeout(() => {
      changeMoves()
    }, changeDelay)
    setTimeout(() => {
      ended = true
    }, uptime * 1000)
  },
}
