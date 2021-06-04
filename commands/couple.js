const Discord = require("discord.js")
require("module-alias/register")
const messageHandler = require("@messages")
const coupleSchema = require("../schemas/couple-schema.js")
const userUtils = require("@user")

const loveSentences = [
  "Salgamos juntos, yo invito a los besos",
  "Me robó un beso y yo sentí que me robó mi alma",
  "Vayas donde vayas, ve con todo tu corazón",
  "Me quiere, no me hiere. Me hiere, no me quiere",
  "Te mereces ser amado",
  "El cerebro es el órgano más incomprensible del mundo. Trabaja 24/7, 365 desde que naces hasta que te enamoras",
  "Soy tuyo. No se aceptan devoluciones",
  "Sí, tengo la mente sucia. Y ahora mismo, tu estás en ella. Desnudo, por supuesto",
  "¿Me quieres?\nA - Sí\nB - A\nC - B\n",
  "Imaginar una vida contigo es el mayor de mis deseos",
  "Mi felicidad no tiene precio, tiene tu nombre",
  "Incluso la luz es oscura si no me iluminas con tu mirada",
  "Ven a dormir conmigo: no haremos el amor. Él nos hará",
  "Tu alma y la mía son imánes",
  "Toda historia de amor es hermosa, pero la nuestra es mi favorita",
  "Nuestra boda empezó hace muchos años. La celebración continúa cada día",
  "Hagan lo que hagan, no podrán separarnos",
  "Felicidad de dos, envidia de miles",
  "Nuestro plan es disfrutar la vida al máximo y tener miles de aventuras, todas juntos",
]

const loveEmojis = ["💌", "💕", "🥰", "🌷", "💖", "😍", "💘", "😘"]

checkDaily = async coupleData => {
  const lastCouple = new Date(coupleData.updatedAt).toDateString()
  const now = new Date().toDateString()
  if (lastCouple !== now) return true
  return false
}

module.exports = {
  commands: "couple",
  callback: async (message, args, text, client) => {
    const guildId = message.guild.id,
      { member, guild } = message,
      roleID = "835561996450791484",
      emojis = await require("@emojis").logibotEmojis(client)

    let result = await coupleSchema.findOne({ _id: guildId })
    if (!result)
      await new coupleSchema({
        _id: guildId,
      }).save()
    result = await coupleSchema.findOne({ _id: guildId })
    await coupleSchema.updateOne({ _id: guildId }, { _id: guildId })

    if (!(await checkDaily(result))) {
      message.channel.send(
        await messageHandler("coupleDailySpent", member, {
          username: member.user.username,
        })
      )
      return
    }
    await guild.members.fetch().then(async members => {
      let arr = []
      members = members.filter(m => !m.user.bot)
      members = members.array()
      if (members.length < 2) {
        message.channel.send(
          await messageHandler("coupleInsuficientMembers", member, { username: member.user.username })
        )
        return
      }

      while (arr.length < 2) {
        let m = Math.floor(Math.random() * members.length)
        if (!arr.includes(members[m])) arr.push(members[m])
      }
      var lover1 = Math.floor(Math.random() * 2)
      var lover2 = lover1 == 0 ? 1 : 0

      // lover role
      const loverRole = await guild.roles.cache.get(roleID)
      if (!loverRole) {
        message.channel.send(
          await messageHandler("missingRole", message.member, {
            username: message.author.username,
          })
        )
        return
      }
      await arr[lover1].roles.add(loverRole)
      await arr[lover2].roles.add(loverRole)

      // remove role
      var now = new Date()
      var night = new Date()
      night.setHours(16, 0, 20, 0)
      var msTillMidnight = night.getTime() - now.getTime()
      setTimeout(async () => {
        await guild.members.fetch().then(members => {
          members.forEach(async member => {
            if (member.roles.cache.get(roleID)) await member.roles.remove(await guild.roles.cache.get(roleID))
          })
        })
      }, msTillMidnight)

      // add lover punctuation
      await userUtils.incUserSchema(guild, arr[lover1].user, "lover", 1)
      await userUtils.incUserSchema(guild, arr[lover2].user, "lover", 1)

      const embed = new Discord.MessageEmbed()
        .setColor("#ba0001")
        .setTitle(`${emojis.heart} Pareja del día ${emojis.heart}`)
        .setDescription(
          `**${arr[0].user.username}** + **${arr[1].user.username}** =  ${
            loveEmojis[Math.floor(Math.random() * loveEmojis.length)]
          }`
        )
        .addField(
          `**${arr[lover1].user.username} a ${arr[lover2].user.username}**`,
          `_\"${loveSentences[Math.floor(Math.random() * loveSentences.length)]}\"_`
        )
      await message.channel.send(embed)
    })
  },
}
