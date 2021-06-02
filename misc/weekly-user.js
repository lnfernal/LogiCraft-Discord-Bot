require("module-alias/register")
const userUtils = require("@user")
const moment = require("moment")
const { MessageEmbed } = require("discord.js")

module.exports.inc = async message => {
  const { guild, author } = message

  await userUtils.incUserSchema(guild, author, "weeklyUser.messages", 1)
  await userUtils.incUserSchema(guild, author, "weeklyUser.words", message.content.split(" ").length)
  if (message.attachments.length) await userUtils.incUserSchema(guild, author, "weeklyUser.images", 1)
}

module.exports.init = async guild => {
  setInterval(async () => {
    await checkWeekly(guild)
  }, moment().endOf("week").valueOf() - moment().valueOf() - (120 * 1000))
}

async function checkWeekly(guild) {
  let users = []
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
    user["points"] = user.weeklyUser.messages + (user.weeklyUser.images * 10) / user.weeklyUser.words
  })
  users.sort(function (a, b) {
    return b.points - a.points
  })

  // send to channel
  moment.locale("es")
  const weeklyUser = users[0],
    member = await guild.members.cache.get(weeklyUser.userId)
  await spamChannel.send(
    new MessageEmbed()
      .setTitle(`${weeklyUser.name} es el usuario de la semana! ${emojis.hero}`)
      .setColor("#ff5d8f")
      .setDescription(
        `**Mensajes enviados**: ${weeklyUser.weeklyUser.messages}\n**Imágenes adjuntadas**: ${weeklyUser.weeklyUser.images}\n**Palabras escritas**: ${weeklyUser.weeklyUser.words}`
      )
      .setThumbnail(member.user.avatarURL())
      .setAuthor(`${moment().startOf("week").format("ll")} - ${moment().endOf("week").format("ll")}`)
  )

  await guild.members.fetch().then(async members => {
    const promises = []

    members.forEach(member => {
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.messages", 0))
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.images", 0))
      promises.push(userUtils.setUserSchema(guild, member.user, "weeklyUser.words", 0))
    })
    users = await Promise.all(promises)
  })
}
