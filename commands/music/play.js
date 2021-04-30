module.exports = {
  commands: ["play", "playsound", "p"],
  expectedArgs: "<link|video name>",
  minArgs: 1,
  maxArgs: 10,
  callback: async (message, arguments, text, client) => {
    const { channel } = message.member.voice;
    const emojis = await require("../../utils/emojis").discEmojis(client);
    if (!channel)
      return message.channel.send(
        `**${message.member.displayName}**, necesitas estar en un canal de voz`
      );
    let audio = await client.player.play(message, text);
    if (audio) message.channel.send(`${emojis[Math.random() * emojis.length]} Reproduciendo **${audio.name}**`);
  },
};
