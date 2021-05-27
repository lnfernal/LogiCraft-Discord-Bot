const profileSchema = require("../../schemas/profile-schema.js")
const economy = require("../../handlers/economy.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "coinadd",
  maxArgs: 2,
  minArgs: 2,
  expectedArgs: "<user> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, args, text, client) => {
    const { member } = message
    const target = message.mentions.users.first() || (await s.getUserByString(args[0], message.member))
    const logiEmojis = await require("@emojis").logibotEmojis(client)
    const guildId = message.guild.id
    const userId = target.id
    const coins = args[1]

    if (!target)
      message.channel.send(
        s.interpolate(await messageHandler("missingUser", member), {
          username: message.member.user.username,
        })
      )
    if (isNaN(coins) || coins <= 0) {
      message.channel.send(
        s.interpolate(await messageHandler("coinsWrong", member), {
          username: target.username,
        })
      )
      return
    }
    await economy.addCoins(guildId, userId, coins)
    message.channel.send(
      s.interpolate(await messageHandler("coinsAdded", member), {
        username: message.member.user.username,
        targetUsername: target.username,
        coins,
        logiCoin: logiEmojis.logiCoin,
      })
    )
  },
}
