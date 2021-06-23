require("module-alias/register")
const general = require("@general")
const userUtils = require("@user")
const s = require("@string")
const { MessageEmbed } = require("discord.js")

module.exports = {
  commands: "server",
  callback: async (message, args, text, client) => {
    const { guild, channel } = message
    const profiles = await userUtils.getAllUsersProfile(guild)
    const emojis = await require("@emojis").logibotEmojis(client)
    const guildEmojis = await require("@emojis").guildEmojis(client, guild.id)
    let guildEmojisString = ``
    let totalMessages = 0,
      totalWords = 0,
      totalEmojis = 0,
      totalCommands = 0,
      online = 0,
      idle = 0,
      offline = 0,
      dnd = 0,
      bots = 0,
      membersRaw

    profiles.forEach(profile => {
      totalMessages += profile.messages
      totalWords += profile.words
    })

    for (emoji in guildEmojis) {
      guildEmojisString += `${guildEmojis[emoji]}`
    }

    await guild.members.fetch().then(async members => {
      bots = members.filter(m => m.user.bot).size
      members = members.filter(m => !m.user.bot)
      membersRaw = members
      members.forEach(member => {
        switch (member.presence.status) {
          case "online":
            online++
            break
          case "idle":
            idle++
            break
          case "dnd":
            dnd++
            break
          case "offline":
            offline++
            break
          default:
          // wait, that's illegal
        }
      })
    })
    const embed = new MessageEmbed()
      .setTitle(`Servidor ${guild.name}`)
      .setThumbnail(await general.getServerIcon(guild, { dynamic: true, size: 128 }))
      .setColor("#ff5d8f")
      .addFields(
        {
          name: "`General`",
          value: `**Nombre**: ${guild.name}\n**Fecha de creación**: ${general.formatDate(
            guild.createdAt
          )} _(${general.timeSince(guild.createdAt)})_\n**Propietario**: ${guild.owner}\n**Descripción**: ${
            guild.description ? guild.description : "_Ninguna_"
          }\n**Bots**: ${bots}`,
        },
        {
          name: "`Chat`",
          value: `**Mensajes enviados**: ${s.formatNumber(totalMessages)}\n**Palabras escritas**: ${s.formatNumber(
            totalWords
          )}\n**Emojis usados**: ${s.formatNumber(totalEmojis)}\n**Comandos ejecutados**: ${s.formatNumber(
            totalCommands
          )}`,
          inline: true,
        },
        {
          name: "`Miembros`",
          value: `**Cantidad**: ${membersRaw.size}\n**Más activo**: \n${emojis.online} **Online**: ${online}\n${emojis.dnd} **No Molestar**: ${dnd}\n${emojis.idle} **Ausente**: ${idle}\n${emojis.offline} **Desconectado**: ${offline}`,
          inline: true,
        },
        {
          name: "`Emojis`",
          value: `${s.substr(guildEmojisString, 1024, { character: ">" })}`,
          inline: false,
        }
      )
    await channel.send(embed)
  },
}
