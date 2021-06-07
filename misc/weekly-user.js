require("module-alias/register")
const userUtils = require("@user")
const moment = require("moment")
const math = require("@math")
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
  }, moment().endOf("isoWeek").valueOf() - moment().valueOf())
}

async function checkWeekly(guild) {
  let users = [],
    usersFinal = []
  const spamChannel = await guild.channels.cache.find(c => c.name.toLowerCase().includes("spam")),
    emojis = await require("@emojis").logibotEmojis(require("@client").getClient())

  await guild.members.fetch().then(async members => {
    const promises = []

    members.forEach(member => {
      promises.push(userUtils.getUserProfile(guild, member.user))
    })
    users = await Promise.all(promises)
  })
  users.forEach(user => {
    usersFinal.push({
      id: user.userId,
      points: Math.floor(
        (user.weeklyUser.messages + user.weeklyUser.files * 10) /
          math.clamp(user.weeklyUser.words, 1, user.weeklyUser.words)
      ),
      messages: user.weeklyUser.messages,
      words: user.weeklyUser.words,
      files: user.weeklyUser.files,
    })
  })
  usersFinal.sort(function (a, b) {
    return b.points - a.points
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
        `**Mensajes enviados**: ${weeklyUser.messages}\n**Archivos adjuntados**: ${weeklyUser.images}\n**Palabras escritas**: ${weeklyUser.words}`
      )
      .setThumbnail(weeklyMember.user.avatarURL())
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
    users = await Promise.all(promises)
  })
}
