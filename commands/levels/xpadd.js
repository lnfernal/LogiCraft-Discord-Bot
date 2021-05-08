const levels = require("../../handlers/levels.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "xpadd",
  maxArgs: 3,
  minArgs: 2,
  expectedArgs: "<user> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, arguments, text, client) => {
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(arguments[0], message.member))
    const targetMember = message.guild.members.cache.get(target.id)
    var msg
    const xpToAdd = arguments[1]
    const maxXPAdd = 400000

    if (!target)
      message.channel.send(
        s.interpolate(await messageHandler("missingUser", member), {
          username: member.user.username,
        })
      )
    if (isNaN(xpToAdd) && !arguments[2]) {
      message.channel.send(
        s.interpolate(await messageHandler("xpWrong", member), {
          username: member.user.username,
        })
      )
      return
    }
    if (xpToAdd > 400000) {
      message.channel.send(
        s.interpolate(await messageHandler("xpCap", member), {
          username: member.user.username,
          maxXPAdd,
        })
      )
      return
    }
    levels.addXpCall(
      member,
      xpToAdd,
      message,
      (msg = arguments[2] ? arguments[2] : undefined)
    )
    const ann = arguments[2]
      ? s.interpolate(await messageHandler("xpGivenMsg", member), {
          username: member.user.username,
          targetUsername: target.username,
          msg,
        })
      : s.interpolate(await messageHandler("xpGiven", member), {
          username: member.user.username,
          targetUsername: target.username,
          xpToAdd,
        })
    message.channel.send(ann)
  },
}
