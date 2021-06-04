require("module-alias/register")
const userUtils = require("@user")

async function checkPresence(guild) {
  const lowRole = await guild.roles.cache.find(r => r.name.toLowerCase().includes("low")),
    mediumRole = await guild.roles.cache.find(r => r.name.toLowerCase().includes("moderate")),
    highRole = await guild.roles.cache.find(r => r.name.toLowerCase().includes("high"))

  if (!lowRole || !mediumRole || !highRole) return

  await guild.members.fetch().then(members => {
    members.forEach(async member => {
      let userData = await userUtils.getUserProfile(guild, member.user),
        { presence, points } = userData

      if (!presence) presence = -1
      if(presence == -1){
        if (points > 0) presence++
      } else if (presence == 0 ) {
        if (points > 20) presence++
        else presence--
      } else if (presence == 1) {
        if (points > 60) presence++
        else presence--
      } else if (presence == 2) {
        if (points < 250) presence--
      }
      await member.roles.remove(lowRole)
      await member.roles.remove(mediumRole)
      await member.roles.remove(highRole)
      await userUtils.setUserSchema(guild, member.user, "presence", presence)
      await userUtils.setUserSchema(guild, member.user, "points", 0)
      if (presence == 0) await member.roles.add(lowRole)
      else if (presence == 1) await member.roles.add(mediumRole)
      else if (presence == 2) await member.roles.add(highRole)
    })
  })
}

module.exports.init = async guild => {
  setInterval(async () => {
    await checkPresence(guild)
    console.log("[!] Actualizando presencia del usuario...")
  }, 1 * 24 * 3600 * 1000)
}

module.exports.addPoints = async (message = null, reaction = null, user = null) => {
  if (reaction) {
    await userUtils.incUserSchema(reaction.message.guild, user, "points", 1)
  }
  if (message) {
    await userUtils.incUserSchema(
      message.guild,
      message.author,
      "points",
      Math.floor(Math.pow(message.content.length, 1.1))
    )
  }
}