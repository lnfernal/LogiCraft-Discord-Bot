require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: ["getqueue", "gq"],
  callback: async (message, args, text, client) => {
    const MAXNAME = 27,
      MAXAUTHOR = 20
    const { author, member } = message
    const emojis = await require("../../utils/emojis.js").discEmojis(client)
    var keys = Object.keys(emojis)

    let songsPerPage = 20,
      songsCurrentPage = 0,
      currentPage = {},
      names = ``,
      authors = ``,
      queuePages = []

    try {
      let queue = await client.player.getQueue(message)
      names += `${
        queue.songs[0].name.includes("Pigstep")
          ? emojis.musicDiscPigstep
          : emojis[keys[Math.floor(Math.random() * keys.length)]]
      } **${queue.songs[0].name.toString().substring(0, MAXNAME)}${queue.songs[0].name.length > 27 ? "...**" : "**"}\n`
      authors += `${queue.songs[0].author ? queue.songs[0].author.toString().substring(0, MAXAUTHOR) : "-"}\n`
      for (let i = 1; i < queue.songs.length; i++) {
        names += `${i}. **${queue.songs[i].name.toString().substring(0, MAXNAME)}${
          queue.songs[i].name.length > 27 ? "...**" : "**"
        }\n`
        authors += `${queue.songs[i].author ? queue.songs[i].author.toString().substring(0, MAXAUTHOR) : "-"}\n`
        songsCurrentPage++
        if (songsCurrentPage == songsPerPage || i == queue.songs.length - 1) {
          songsCurrentPage = 0
          currentPage = { names, authors }
          queuePages.push(currentPage)
          names = ``
          authors = ``
        }
      }
      require("@pages").createPages(message, queuePages, "queue")
    } catch (e) {
      await message.channel.send(
        await messageHandler("msc_non_q", member, {
          username: author.username,
        })
      )
    }
  },
}
