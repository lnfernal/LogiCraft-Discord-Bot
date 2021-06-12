const Discord = require("discord.js")
require("module-alias/register")
const messageHandler = require("@messages")

module.exports = {
  commands: ["ip", "server"],
  requiredRoles: ["ilogicraft sectary"],
  callback: async (message, args, text, client) => {
    const { guild, member, author } = message,
      version = "1.16.5",
      requirements = "https://www.dropbox.com/s/9yzdwxm2k29ny5o/iLogiCraft%20Modpack%20v1.0.zip?dl=0",
      ip = "`51.195.145.143:25571`"

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
          .setColor("#ff5d8f")
      )
      .catch(console.error)
  },
}
