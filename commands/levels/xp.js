require("module-alias/register")
const Discord = require("discord.js")
const userUtils = require("@user")
const messageHandler = require("@messages")
const s = require("@string")
const math = require("@math")

const progressBarPrecision = 25

const xpEmbed = async (message, target, profile, needed) => {
  const { xp, totalXp, level } = profile
  const progressMade = () => {
    var i = 0
    var progressBar = `[`
    for (i; i < progressBarPrecision; i++) {
      if (i / progressBarPrecision < xp / math.clamp(needed, 1, needed)) progressBar += "□"
      else break
    }
    for (i; i < progressBarPrecision; i++) progressBar += "–"
    progressBar += "]"
    return progressBar
  }
  const embed = new Discord.MessageEmbed()
    .setColor(await userUtils.getAvatarColor(target))
    .setTitle(
      await messageHandler("xpTitle", message.member, {
        username: target.username.replace("_", "\\_"),
      })
    )
    .setDescription(
      await messageHandler("xp", message.member, {
        level,
        xp: s.formatNumber(xp),
        needed: s.formatNumber(needed),
        totalXp: s.formatNumber(totalXp),
      })
    )
    .setThumbnail(userUtils.getUserAvatar(target))
    .setFooter(progressMade()+` ${Math.round(((xp / needed) * 1000) / 10)}%`)
  message.channel.send(embed)
}

module.exports = {
  commands: "xp",
  maxArgs: 1,
  expectedArgs: "<user>",
  callback: async (message, args, text, client) => {
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0] ? args[0] : ".", message.member)) ||
      message.author

    const profile = await userUtils.getUserProfile(message.guild, target)
    xpEmbed(message, target, profile, Math.floor(Math.pow(profile.level, 2.5) * 10) + 1)
  },
}
