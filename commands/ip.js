const Discord = require("discord.js")
require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: ["ip", "server"],
  requiredRoles: ["ilogicraft sectary"],
  callback: async (message, args, text, client) => {
    const { guild, member, author } = message,
      version = "1.16.5",
      requirements = "https://minecraft.net",
      ip = "`000.000.000`"

    author
      .send(
        new Discord.MessageEmbed()
          .setDescription(
            `${await messageHandler("ipDescription", member, {
              version,
              requirements,
              ip,
            })}`
          )
          .setTitle(guild.name + " IP")
          .setThumbnail(guild.iconURL())
      )
      .catch(console.error)
  },
}
