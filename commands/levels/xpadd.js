require("module-alias/register")
const levels = require("../../handlers/levels.js")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "xpadd",
  maxArgs: 3,
  minArgs: 3,
  expectedArgs: "<user> <method> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, args, text, client) => {
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0] ? args[0] : null, message.member)) ||
      (await message.guild.members.cache.get(args[0]).user)

    const { member } = message
    const xpAdd = parseInt(args[2]),
      maxXpAdd = 10000000000000

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", member, {
          username: member.user.username,
        })
      )
      return
    }
    if (isNaN(xpAdd) || xpAdd < 0) {
      message.channel.send(
        await messageHandler("xpWrong", member, {
          username: member.user.username,
        })
      )
      return
    }
    if (xpAdd > maxXpAdd) {
      message.channel.send(
        await messageHandler("xpCap", member, {
          username: member.user.username,
          maxXpAdd,
        })
      )
      return
    }
    levels.addXpCall(message, target, xpAdd, args[1])
    const xpAddedMsg =
      args[1] == "msg"
        ? await messageHandler("xpGivenMsg", member, {
            username: member.user.username,
            targetUsername: target.username,
            msg: xpAdd,
          })
        : args[1] == "raw"
        ? await messageHandler("xpGiven", member, {
            username: member.user.username,
            targetUsername: target.username,
            xpAdd,
          })
        : args[1] == "level"
        ? await messageHandler("xpGivenLvl", member, {
            username: member.user.username,
            targetUsername: target.username,
            lvls: xpAdd,
          })
        : null
    if (xpAddedMsg) message.channel.send(xpAddedMsg)
  },
}
