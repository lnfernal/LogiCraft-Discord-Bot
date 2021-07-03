require("module-alias/register")
const userUtils = require("@user")
const messageHandler = require("@messages")

module.exports = {
  commands: ["play", "playsound", "p"],
  expectedArgs: "<link|video name>",
  minArgs: 1,
  maxArgs: 10,
  callback: async (message, args, text, client) => {
    const { channel } = message.member.voice
    const { member } = message
    const emojis = await require("../../utils/emojis.js").discEmojis(client)
    var keys = Object.keys(emojis)
    if (!channel)
      return message.channel.send(
        await messageHandler("msc_mssng_vc", member, {
          username: member.user.username,
        })
      )

    if (message.content.includes("www.youtube.com/playlist")) {
      try {
        await client.player.playlist(message, {
          search: args[0],
          maxSongs: -1,
        })
        await message.channel.send(
          await messageHandler("msc_q_pylst", member, {
            disc: emojis[keys[Math.floor(Math.random() * keys.length)]],
          })
        )
      } catch (e) {
        await message.channel.send(await messageHandler("msc_q_err", member))
      }
    } else {
      try {
        if(await client.player.isPlaying(message)){
          await require("./queue.js").callback(message, args, text, client)
        } else {
          let audio = await client.player.play(message, text).catch(console.error)
          if (audio)
            await message.channel.send(
              await messageHandler("msc_pyng_sng", member, {
                disc: audio.name.includes("Pigstep")
                  ? emojis.musicDiscPigstep
                  : emojis[keys[Math.floor(Math.random() * keys.length)]],
                audioname: audio.name,
                audioauthor: audio.author,
              })
            )
        }
      } catch (e) {
        console.log(e)
      }
    }
    await userUtils.incUserSchema(message.guild, message.author, "music", 1)
  },
}
