module.exports = {
  commands: ["clearqueue", "cq"],
  callback: async (message, arguments, text, client) => {
    let cleared
    try {
      cleared = await client.player.clearQueue(message)
    } catch (e) {
      message.channel.send(
        `**${message.member.displayName}**, no hay ninguna cola en curso`
      )
    }
    if (cleared) message.channel.send(`Cola vaciada`)
  },
}
