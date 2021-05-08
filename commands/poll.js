const Discord = require("discord.js")

module.exports = {
  commands: "poll",
  expectedArgs: "<title#emoji=option1;emoji=option2...>",
  minArgs: 1,
  maxArgs: 199,
  callback: (message, arguments, text, client) => {
    const { channel, content } = message

    const eachLine = text.split("#")
    const embed = new Discord.MessageEmbed().setFooter(`${message.author.username}`,`${message.author.avatarURL()}`).setTitle(`${eachLine[0]}`).setAuthor("Encuesta")
    const eachOption = eachLine[1].split(";")
    var optionsEmoji = "", optionsText = "", emojis = []
    for (const line of eachOption) {
      if (line.includes("=")) {
        const split = line.split("=")
        const emoji = split[0].trim()
        optionsEmoji += `\n${emoji}`
        optionsText += `\n${split[1]}`
        emojis.push(emoji)
      }
    }
    optionsEmoji += "\n\u200b"
    optionsText += "\n\u200b"
    embed.addFields(
        { name: "\u200b", value: optionsEmoji, inline: true },
        { name: "\u200b", value: optionsText, inline: true },
      )
    message.delete()
    channel.send(embed).then(msg => {
        emojis.forEach(emoji => {
            msg.react(emoji)
        })
    })
  },
}
