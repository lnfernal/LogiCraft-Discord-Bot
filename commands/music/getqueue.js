module.exports = {
  commands: ["getqueue", "gq"],
  callback: async (message, arguments, text, client) => {
    let queue = client.player.getQueue(message)
    if (queue)
      message.channel.send(
        "Cola:\n" +
          queue.songs
            .map((song, i) => {
              return `${i === 0 ? "Reproduciendo:" : `#${i + 1}`} - ${
                song.name
              } (${song.author})`
            })
            .join("\n")
      )
  },
}
