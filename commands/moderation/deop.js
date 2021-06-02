require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")

module.exports = {
  commands: "deop",
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  requiredRoles: ["mod", "staff"],
  callback: async (message, args, text, client) => {
    const target = message.mentions.users.first() || (await s.getUserByString(args[0], message.member))
    const modRoleId = "666297045207875585"

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    if (await userUtils.checkImmunity(message, target)) return

    const role = await message.guild.roles.cache.get(modRoleId)

    if (!role) {
      message.channel.send(
        await messageHandler("missingRole", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    const member = await message.guild.members.cache.get(target.id)

    if (!member) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    if (member.roles.cache.has(modRoleId)) await member.roles.remove(role).catch(console.error)
    else
      message.channel.send(
        await messageHandler("missingRole", message.member, {
          username: message.author.username,
        })
      )
  },
}
