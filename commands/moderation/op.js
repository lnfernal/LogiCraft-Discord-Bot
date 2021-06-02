require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "op",
  expectedArgs: "<user>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
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

    const role = message.guild.roles.cache.get("666297045207875585")

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

    await member.roles.add(role).catch(console.error)
  },
}
