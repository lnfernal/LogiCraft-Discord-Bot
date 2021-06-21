require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: ["nowplaying", "np"],
  callback: async (message, args, text, client) => {
    const emojis = await require("../../utils/emojis.js").discEmojis(client)
    const { member, author } = message
    var keys = Object.keys(emojis)
    try {
      let audio = await client.player.nowPlaying(message)
      await message.channel.send(
        await messageHandler("msc_np", member, {
          disc: audio.name.includes("Pigstep")
            ? emojis.musicDiscPigstep
            : emojis[keys[Math.floor(Math.random() * keys.length)]],
          audioname: audio.name,
        })
      )
    } catch (e) {
      await message.channel.send(
        await messageHandler("msc_non_pyng", member, {
          username: author.username,
        })
      )
    }
  },
}
