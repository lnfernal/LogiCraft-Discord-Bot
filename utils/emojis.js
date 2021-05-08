module.exports.guildEmojis = async (client, guildId) => {
  let emojis = {}

  var guild = client.guilds.cache.get(guildId)

  guild.emojis.cache.forEach(emoji => {
    emojis[`${emoji.name}`] = emoji
  })
  return emojis
}

module.exports.logibotEmojis = async client => {
  let emojis = {}

  const guild = client.guilds.cache.get("829448956417015828")

  guild.emojis.cache.forEach(emoji => {
    emojis[`${emoji.name}`] = emoji
  })
  return emojis
}

module.exports.discEmojis = async client => {
  let emojis = {}

  const guild = client.guilds.cache.get("829448956417015828")

  guild.emojis.cache.forEach(emoji => {
    if (emoji.name.includes("musicDisc")) emojis[`${emoji.name}`] = emoji
  })
  return emojis
}
