module.exports = {
  commands: ["stop", "s"],
  callback: async (message, arguments, text, client) => {
    let stopped;
    try {
      stopped = await client.player.stop(message);
    } catch (e) {
      message.channel.send(
        `**${message.member.displayName}**, no hay audio en curso y la cola está vacía`
      );
    }
    if (stopped)
      message.channel.send(`Audio detenido y cola de reproducción vaciada`);
  },
};