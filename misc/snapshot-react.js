const channelId = "730742558556291173"

const addReactions = async (message, emojis) => {
  await message.react(emojis.upvote)
  await message.react(emojis.downvote)

  // bully bedrock
  if (!message.content.includes("Java")) {
    await message.react(emojis.kekwPurple)
  }
}

const reactToPrevMsg = async client => {
  for (const id of channelsId) {
    const channel = await client.channels.fetch(id)

    await channel.messages.fetch().then(messages => {
      for (const message of messages) {
        addReactions(message[1])
      }
    })
  }
}

module.exports = {
  //reactToPrevMsg(client)

  onMessage: async (client, message) => {
    const emojis = await require("../utils/emojis.js").logibotEmojis(client, message.guild.id)
    if (channelId == message.channel.id) {
      addReactions(message, emojis)
    }
  },
}
