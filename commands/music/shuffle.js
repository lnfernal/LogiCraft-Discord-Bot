module.exports = {
  commands: "shuffle",
  callback: async (message, arguments, text, client) => {
    try {
      let shuffle = client.player.shuffle(message);
      if (shuffle) message.channel.send(`La cola está en aleatorio`);
    } catch (e) {
      message.channel.send(`No hay ninguna cola en curso`);
    }
  },
};
