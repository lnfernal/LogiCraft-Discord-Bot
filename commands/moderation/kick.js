require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")
const Discord = require("discord.js")
const protectedRoles = ["mod", "staff"]

module.exports = {
  commands: ["kick", "kill"],
  expectedArgs: "<user>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["KICK_MEMBERS"],
  callback: async (message, args, text, client) => {
    const target = message.mentions.users.first() || (await s.getUserByString(args[0], message.member))

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    if (await userUtils.checkImmunity(message, target, protectedRoles)) return

    const member = await message.guild.members.cache.get(target.id)

    if (!member) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#ff4646")
      .setFooter(`Muteado por ${message.author.username}`, `${message.author.avatarURL()}`)
      .setTitle(`${target.username} was slained by ${message.author.username}`)
    message.channel.send(embed)
    member.kick()
  },
}
