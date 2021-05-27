const Discord = require("discord.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const protectedRolesFunc = require("../../misc/protected-roles.js")
const protectedRoles = ["666297045207875585", "666297857929642014"]

module.exports = {
  commands: "ban",
  expectedArgs: "<user> [reason]",
  minArgs: 1,
  maxArgs: 19,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, args, text, client) => {
    const user =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0], message.member)) ||
      (await client.users.fetch(args[0]))
    var reason = "_No especificado_"
    if (!user)
      s.interpolation(messageHandler("missingUser"), {
        username: message.member.user.username,
      })
    if (
      (!protectedRolesFunc(message, member, protectedRoles) && member) ||
      user.id === "824989001999712337" ||
      user.id == client.user.id
    )
      return
    const member = message.guild.members.cache.get(user.id)
    if (args[1]) {
      args.shift()
      reason = args.join(" ")
    }
    try {
      await member.ban().then(() => {
        const embed = new Discord.MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`${member.displayName} ha sido baneado`)
          .setDescription(`Motivo: ${reason}\nId: ${member.id}`)
        message.channel.send(embed)
      })
    } catch (e) {
      message.channel.send("Este usuario ya está baneado")
    }
  },
}
