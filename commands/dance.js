module.exports = {
  commands: "dance",
  maxArgs: 1,
  expectedArgs: "[uptime(s)]",
  callback: async (message, args, text, client) => {
    const moves = ["o/", "\\o"],
      { channel, member } = message,
      changeDelay = 2000,
      uptime = args[0] ? args[0] : 5,
      changeMoves = async () => {
        const currentMoveIndex = moves.indexOf(danceMessage.content)
        const msgExists = await channel.messages.fetch(danceMessage.id).catch(console.error)

        if (!ended && msgExists)
          setTimeout(() => {
            changeMoves()
          }, changeDelay)
        await danceMessage.edit(currentMoveIndex == moves.length - 1 ? moves[0] : moves[currentMoveIndex + 1])
      }

    let ended = false,
      danceMessage

    if (isNaN(uptime) || uptime > 60 || uptime < 1) {
      channel.send(`**${member.user.username}**, el valor introducido es inválido`)
      return
    }

    await channel.send(moves[Math.floor(Math.random() * moves.length)]).then(msg => {
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
