require("module-alias/register")
const muteSchema = require("../schemas/mute-schema.js")
const mutedRoleId = "788187970930343976"

module.exports.scheduledCheck = async client => {
  const checkMutes = async () => {
    const now = new Date()
    const conditional = {
      expires: {
        $lt: now,
      },
      current: true,
    }
    const results = await muteSchema.find(conditional)
    if (results && results.length) {
      for (const result of results) {
        const { guildId, userId } = result
        const guild = client.guilds.cache.get(guildId)
        const member = (await guild.members.fetch()).get(userId)
        const emojis = await require("@emojis").logibotEmojis(client)

        await require("../commands/moderation/unmute.js").triggerUnmute(member, client.user, {
          unmuted: emojis.unmuted,
          channel: await (
            await client.guilds.cache.find(g => g.name.toLowerCase().includes("logi"))
          ).channels.cache.find(c => c.name.toLowerCase().includes("spam")),
        }) //CHANGE TO GUILD ID
      }
      await muteSchema.updateMany(conditional, {
        current: false,
      })
    }
    setTimeout(checkMutes, 1000 * 60)
  }
  await checkMutes()
}

module.exports.checkMute = async (client, member) => {
  const { guild, id } = member

  const currentMute = await muteSchema.findOne({
    userId: id,
    guildId: guild.id,
    current: true,
  })
  if (currentMute) {
    const role = guild.roles.cache.find(role => {
      return role.id == mutedRoleId
    })
    if (role) {
      member.roles.add(role)
    }
  }
}
