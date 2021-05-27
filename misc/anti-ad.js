async function isInvite(guild, code) {
  return await new Promise(resolve => {
    guild.fetchInvites().then(invites => {
      for (const invite of invites) {
        if (code === invite[0]) {
          resolve(true)
          return
        }
      }
      resolve(false)
    })
  })
}

module.exports = {
  onMessage: async (client, message) => {
    const { guild, member, content } = message
    const code = content.split("discord.gg/")[1]

    if (content.includes("discord.gg/")) {
      console.log("Código: ", code)
      const isOurInvite = await isInvite(guild, code)
      if (!isOurInvite) {
        console.log(`${member.displayName} ha spammeado: ${content} en ${message.channel.name}`)
        message.channel.send(
          `${member.displayName}, links de invitación a otros servers están prohibidos :P\n${member.displayName}, inviting links to other servers are forbidden :P`
        )
        message.delete()
      }
    }
  },
}
