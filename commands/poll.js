const Discord = require("discord.js")

module.exports = {
  commands: "poll",
  expectedArgs: "<title#emoji=option1;emoji=option2...>",
  minArgs: 1,
  maxArgs: 199,
  callback: (message, arguments, text, client) => {
    const { channel, content } = message

    const eachLine = text.split("#")
    const embed = new Discord.MessageEmbed().setTitle(eachLine[0])
    const eachOption = eachLine[1].split(";")
    var description = "",
      emojis = []
    for (const line of eachOption) {
      if (line.includes("=")) {
        const split = line.split("=")
        const emoji = split[0]
        description += `${emoji} - **${split[1]}**\n`
        emojis.push(emoji)
      }
    }
    embed.setDescription(description)
    message.delete()
    channel.send(embed).then(msg => {
      emojis.forEach(emoji => {
        msg.react(emoji)
      })
    })
  },
}