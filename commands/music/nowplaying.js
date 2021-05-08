module.exports = {
  commands: ["nowplaying", "np"],
  callback: async (message, arguments, text, client) => {
    try {
      let audio = await client.player.nowPlaying(message)
      if (audio) message.channel.send(`Se está reproduciendo **${audio.name}**`)
    } catch (e) {
      message.channel.send(`No se está reproduciendo nada`)
    }
  },
}
