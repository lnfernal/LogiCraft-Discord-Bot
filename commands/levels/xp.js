const mongo = require("../../utils/mongo.js")
const Discord = require("discord.js")
const profileSchema = require("../../schemas/profile-schema.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const progressBarPrecision = 25

const xpEmbed = async (message, target, xp, totalXp, level, needed) => {
  const targetMember = message.guild.members.cache.get(target.id)
  const progressMade = () => {
    var i = 0
    var progressBar = `[`
    for (i; i < progressBarPrecision; i++) {
      if (i / progressBarPrecision < xp / needed) {
        progressBar += "□"
      } else {
        break
      }
    }
    for (i; i < progressBarPrecision; i++) {
      progressBar += "–"
    }
    progressBar += "]"
    return progressBar
  }
  const embed = new Discord.MessageEmbed()
    .setColor("#ff5d8f")
    .setTitle(
      s.interpolate(await messageHandler("xpTitle", targetMember), {
        username: target.username,
      })
    )
    .setDescription(
      s.interpolate(await messageHandler("xp", targetMember), {
        level,
        xp: s.formatNumber(xp),
        xpRaw: xp,
        needed: s.formatNumber(needed),
        neededRaw: needed,
        totalXp: s.formatNumber(totalXp),
        progressMade: progressMade(),
      })
    )
    .setThumbnail(target.avatarURL())
  message.channel.send(embed)
}

module.exports = {
  commands: "xp",
  expectedArgs: "",
  callback: async (message, arguments, text, client) => {
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(
        arguments[0] ? arguments[0] : ".",
        message.member
      )) ||
      message.author
    const guildId = message.guild.id
    const userId = target.id

    const result = await profileSchema.findOne({
      guildId,
      userId,
    })
    if (result) {
      const { xp, totalXp, level } = result
      xpEmbed(
        message,
        target,
        xp,
        totalXp,
        level,
        Math.floor(Math.pow(level, 2.5) * 10)
      )
    }
  },
}
