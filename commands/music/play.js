module.exports = {
  commands: ["play", "playsound", "p"],
  expectedArgs: "<link|video name>",
  minArgs: 1,
  maxArgs: 10,
  callback: async (message, arguments, text, client) => {
    const { channel } = message.member.voice;
    const emojis = await require("../../utils/emojis.js").discEmojis(client);
    var keys = Object.keys(emojis);
    if (!channel)
      return message.channel.send(
        `**${message.member.displayName}**, necesitas estar en un canal de voz`
      );
    let audio = await client.player.play(message, text);
    if (audio) await message.channel.send(`${audio.name.includes("Pigstep") ? emojis.musicDiscPigstep : emojis[keys[Math.floor(Math.random() * keys.length)]]} Reproduciendo **${audio.name}**`);
  },
};
