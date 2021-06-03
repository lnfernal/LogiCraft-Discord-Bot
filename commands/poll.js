const Discord = require("discord.js")

module.exports = {
  commands: "poll",
  expectedArgs: "<title#emoji=option1;emoji=option2...>",
  minArgs: 1,
  maxArgs: 199,
  callback: async (message, args, text, client) => {
    const { channel, author } = message

    const eachLine = text.split("#")
    const eachOption = eachLine[1].split(";")
    const emojis = await require("@emojis").logibotEmojis(client)
    const embed = new Discord.MessageEmbed()
      .setTitle(`__${eachLine[0]}__`)
      .setAuthor(`Encuesta por ${author.username}`)
      .setColor("#ff5d8f")
    var reactions = [],
      options = ""

    for (const line of eachOption) {
      if (line.includes("=")) {
        const split = line.split("=")
        const emoji = split[0].trim()
        options += `${emoji} **=** ${split[1]}`
        reactions.push(emoji)
      }
    }
    embed.setDescription(options)
    message.delete()
    channel.send(embed).then(msg => {
      reactions.forEach(emoji => {
        msg.react(emoji)
      })
    })
  },
}
