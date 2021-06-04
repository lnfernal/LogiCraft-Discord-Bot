require("module-alias/register")
const Discord = require("discord.js")
const messageHandler = require("@messages")
const s = require("@string")
const userUtils = require("@user")
const protectedRoles = ["mod", "staff"]

module.exports = {
  commands: "ban",
  expectedArgs: "<user|id> [reason]",
  minArgs: 1,
  maxArgs: 19,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, args, text, client) => {
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0], message.member)) ||
      (await client.users.fetch(args[0]))
    var reason = "_No especificado_"

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

    if (args[1]) {
      args.shift()
      reason = args.join(" ")
    }

    try {
      await member.ban().then(() => {
        const embed = new Discord.MessageEmbed()
          .setColor("#ff4646")
          .setTitle(`${target.username} ha sido baneado`)
          .setDescription(`Motivo: ${reason}\nId: ${target.id}`)
          .setFooter(`Baneado por ${message.author.username}`, `${message.author.avatarURL()}`)
        message.channel.send(embed)
      })
    } catch (e) {
      message.channel.send(
        await messageHandler("alreadyBanned", message.member, {
          username: message.author.username,
        })
      )
    }
  },
}
