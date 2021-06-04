require("module-alias/register")
const messageHandler = require("@messages")
const Discord = require("discord.js")

module.exports = {
  commands: "pardon",
  expectedArgs: "<userId>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, args, text, client) => {
    if (isNaN(args[0])) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    try {
      await client.users.fetch(args[0]).then(async user => {
        try {
          await message.guild.members.unban(user.id).then(() => {
            const embed = new Discord.MessageEmbed()
              .setColor("#4aa96c")
              .setTitle(`${user.username} ha sido desbaneado`)
              .setFooter(`Desbaneado por ${message.author.username}`, `${message.author.avatarURL()}`)
            message.channel.send(embed)
          })
        } catch (e) {
          message.channel.send(
            await messageHandler("missingBan", message.member, {
              username: message.author.username,
            })
          )
          return
        }
      })
    } catch (e) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }
  },
}
