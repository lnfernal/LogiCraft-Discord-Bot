module.exports = {
  commands: ["getqueue", "gq"],
  callback: async (message, args, text, client) => {
    const MAXNAME = 27,
      MAXAUTHOR = 20

    let queue = client.player.getQueue(message),
      songsPerPage = 20,
      songsCurrentPage = 0,
      currentPage = {},
      names = ``,
      authors = ``,
      queuePages = []

    for (let i = 1; i < queue.songs.length; i++) {
      names += `${i}. **${queue.songs[i].name.substring(0, MAXNAME).strim()}**${
        queue.songs[i].name.length > 27 ? "**...**" : ""
      }\n`
      authors += `${queue.songs[i].author ? queue.songs[i].author.substring(0, MAXAUTHOR) : "-"}\n`
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
  },
}
