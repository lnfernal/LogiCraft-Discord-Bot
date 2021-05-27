module.exports = {
  commands: "stop",
  callback: async (message, args, text, client) => {
    let stopped
    try {
      stopped = await client.player.stop(message)
    } catch (e) {
      message.channel.send(`**${message.member.displayName}**, no hay audio en curso y la cola está vacía`)
    }
    if (stopped) message.channel.send(`Audio detenido y cola de reproducción vaciada`)
  },
}
