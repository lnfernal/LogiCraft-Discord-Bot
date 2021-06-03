require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")

module.exports = {
  commands: "statsadd",
  expectedArgs: "<user> <key> <amount>",
  maxArgs: 3,
  minArgs: 3,
  permissions: "ADMINISTRATOR",
  callback: async (message, args, text, client) => {
    const target = message.mentions.users.first() || (await s.getUserByString(args[0] ? args[0] : ".", message.member))
    const { guild, author } = message,
      key = args[1],
      amount = args[2],
      validStats = ["messages", "images", "words"]

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    if (!validStats.includes(key)) return

    await userUtils.incUserSchema(guild, target, key, amount)
    await message.channel.send(
      await messageHandler("statsGiven", message.member, {
        username: author.username,
        targetUsername: target.username,
        amount,
        key,
      })
    )
  },
}
