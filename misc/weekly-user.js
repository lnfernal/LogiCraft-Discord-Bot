require("module-alias/register")
const userUtils = require("@user")
const moment = require("moment")
const math = require("@math")
const s = require("@string")
const { MessageEmbed } = require("discord.js")

module.exports.inc = async message => {
  const { guild, author } = message

  await userUtils.incUserSchema(guild, author, "weeklyUser.messages", 1)
  await userUtils.incUserSchema(guild, author, "weeklyUser.words", message.content.split(" ").length)
  if (message.attachments.size > 0) await userUtils.incUserSchema(guild, author, "weeklyUser.files", 1)
}

module.exports.init = async guild => {
  setTimeout(async () => {
    await checkWeekly(guild)
    setInterval(async () => {
      await checkWeekly(guild)
    }, 7 * 24 * 3600 * 1000)
  }, 2000/*moment().endOf("isoWeek").valueOf() - moment().valueOf()*/)
}

async function checkWeekly(guild) {
  const profiles = await userUtils.getAllUsersProfile(guild)
  var usersFinal = []
  const spamChannel = await guild.channels.cache.find(c => c.name.toLowerCase().includes("spam")),
    emojis = await require("@emojis").logibotEmojis(require("@client").getClient())

  profiles.forEach(user => {
    usersFinal.push({
      id: user.userId,
      messages: user.weeklyUser.messages ? user.weeklyUser.messages : 0,
      words: user.weeklyUser.words ? user.weeklyUser.words : 0,
      files: user.weeklyUser.files ? user.weeklyUser.files : 0,
    })
  })
  usersFinal.sort(function (a, b) {
    return b.words - a.words
  })

  // send to channel
  moment.locale("es")
  const weeklyUser = usersFinal[0],
    weeklyMember = await guild.members.cache.get(weeklyUser.id)
  await spamChannel.send(
    new MessageEmbed()
      .setTitle(`${emojis.hero} ${weeklyMember.user.username} es el usuario de la semana! ${emojis.hero}`)
      .setColor("#ff5d8f")
      .setDescription(
        `**Mensajes enviados**: ${s.formatNumber(weeklyUser.messages)}\n**Palabras escritas**: ${s.formatNumber(
          weeklyUser.words
        )}\n**Archivos adjuntados**: ${s.formatNumber(weeklyUser.files)}`
      )
      .setThumbnail(userUtils.getUserAvatar(weeklyMember.user))
      .setAuthor(`${moment().startOf("isoWeek").format("ll")} - ${moment().endOf("isoWeek").format("ll")}`)
  )
  await userUtils.incUserSchema(guild, weeklyMember.user, "weekly", 1)

  await guild.members.fetch().then(async members => {
    const promises = []

    members.forEach(member => {
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.messages", 0))
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.files", 0))
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.words", 0))
    })
    await Promise.all(promises)
  })
}
