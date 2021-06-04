module.exports = {
  commands: ["nowplaying", "np"],
  callback: async (message, args, text, client) => {
    const emojis = await require("../../utils/emojis.js").discEmojis(client)
    var keys = Object.keys(emojis)
    try {
      let audio = await client.player.nowPlaying(message)
      if (audio)
        message.channel.send(
          `${mojis[keys[Math.floor(Math.random() * keys.length)]]} Se está reproduciendo **${audio.name}**`
        )
    } catch (e) {
      message.channel.send(`No se está reproduciendo nada`)
    }
  },
}
