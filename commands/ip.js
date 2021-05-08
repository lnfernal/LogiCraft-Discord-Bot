const Discord = require("discord.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: ["ip", "server"],
  callback: async (message, arguments, text, client) => {
    const { guild, member } = message
    const version = "1.17"
    const requirements = "null"
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `${s.interpolate(await messageHandler("ipDescription", member), {
            version,
            requirements,
          })}`
        )
        .setAuthor(guild.name + " MC Server IP", guild.iconURL())
    )
  },
}
