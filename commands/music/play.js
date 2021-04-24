module.exports = {
  commands: ["play", "playsound", "p"],
  expectedArgs: "<link>",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments, text, client) => {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(
        `**${message.member.displayName}**, necesitas estar en un canal de voz`
      );
    let audio = await client.player.play(message, text);
    if (audio) message.channel.send(`Reproduciendo **${audio.name}**`);
  },
};
