require("module-alias/register")
const economy = require("../../handlers/economy.js")
const Discord = require("discord.js")
const messageHandler = require("@messages")
const s = require("@string")
const userUtils = require("@user")

module.exports = {
  commands: "balance",
  maxArgs: 1,
  expectedArgs: "[user]",
  callback: async (message, args, text, client) => {
    const { member } = message
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0] ? args[0] : ".", message.member)) ||
      message.author
    const emojis = await require("../../utils/emojis").logibotEmojis(client)
    const guildId = message.guild.id
    const userId = target.id
    const coins = await economy.getCoins(guildId, userId)

    await message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(`Logicoins de ${target.username}`)
        .setDescription(`**Logicoins**: ${coins}${emojis.logiCoin}`)
        .setThumbnail(userUtils.getUserAvatar(target))
        .setColor(await userUtils.getAvatarColor(target))
    )
  },
}
