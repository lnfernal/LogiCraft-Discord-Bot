require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")
const moment = require("moment")
const { MessageEmbed } = require("discord.js")

module.exports = {
  commands: "profile",
  expectedArgs: "[user]",
  maxArgs: 1,
  callback: async (message, args, text, client) => {
    const { guild, author, channel } = message
    const target =
      message.mentions.users.first() ||
      (await s.getUserByString(args[0] ? args[0] : ".", message.member)) ||
      message.author
    const profile = await userUtils.getUserProfile(guild, target)
    const targetMember = await guild.members.fetch(target.id)
    const emojis = await require("@emojis").logibotEmojis(client)
    var roles = "**Todos**: ",
      status =
        targetMember.presence.status === `online`
          ? `${emojis.online} **Online**`
          : targetMember.presence.status === `idle`
          ? `${emojis.idle} **Ausente**`
          : targetMember.presence.status === `offline`
          ? `${emojis.offline} **Desconectado**`
          : `${emojis.dnd} **No molestar**`
    const getActivity = () => {
      var activity = ` - `

      switch (targetMember.presence.activities[0].type) {
        case "PLAYING":
          activity += "Jugando a"
          break
        case "WATCHING":
          activity += "Viendo "
          break
        case "LISTENING":
          activity += "Escuchando "
          break
        case "STREAMING":
          activity += "Retransmitiendo "
          break
        default:
          activity = ""
          break
      }
      return (activity += targetMember.presence.activities[0].name)
    }

    await targetMember.roles.cache.each(role => {
      if (role != guild.roles.everyone) roles += `<@&${role.id}>`
    })

    if (roles == "**Todos**: ") roles.concat("_Ninguno_")

    const embed = new MessageEmbed()
      .setTitle(`Perfil de ${target.username.replace("_", "\\_")} _(${targetMember.displayName ? targetMember.displayName.replace("_", "\\_") : target.username.replace("_", "\\_")})_`)
      .setColor(await userUtils.getAvatarColor(target))
      .addFields(
        {
          name: "`General`",
          value: `**Miembro**: ${target}\n**Tag**: ${target.tag.replace("_", "\\_")}\n**Fecha de unión**: ${userUtils.getJoinedAt(
            targetMember.joinedAt
          )} _(${moment(targetMember.joinedAt).fromNow()})_\n**Mensajes enviados**: ${s.formatNumber(
            profile.messages
          )}\n**Palabras escritas**: ${s.formatNumber(profile.words)}\n**Ratio palabras/mensaje**: ${
            Math.round((profile.words / (profile.messages === 0 ? 1 : profile.messages)) * 100) / 100
          }\n**Imágenes enviadas**: ${profile.images}\n**Último mensaje**: `
            .concat(
              targetMember.lastMessage
                ? `\"${targetMember.lastMessage}\" _(${moment(targetMember.lastMessage.createdAt).fromNow()})_`
                : "_Ninguno_"
            )
            .concat("\n**Última vez boosteado**: ")
            .concat(targetMember.premiumSince ? `${moment(targetMember.premiumSince).format("llll")}` : "_Nunca_")
            .concat("\n**Presencia**: ")
            .concat(
              profile.presence == -1
                ? "Ninguna"
                : profile.presence == 0
                ? "Baja"
                : profile.presence == 1
                ? "Moderada"
                : "Alta"
            )
            .concat(
              `\n**Parejas**: ${profile.lover}${emojis.heart}\n**Veces usuario de la semana**: ${profile.weekly}${emojis.hero}\n**Veces muteado**: ${profile.mutes}${emojis.muted}`
            ),
          inline: false,
        },
        {
          name: "`Niveles`",
          value: `**Nivel**: ${s.formatNumber(profile.level)}\n**XP**: ${s.formatNumber(profile.totalXp)}`,
          inline: true,
        },
        {
          name: "`Economía`",
          value: `**Monedas**: ${s.formatNumber(profile.coins)}${emojis.logiCoin}`,
          inline: true,
        },
        {
          name: "`Roles`",
          value: roles.concat(`\n**Rol más alto**: <@&${targetMember.roles.highest.id}>`),
          inline: true,
        }
      )
      .setThumbnail(userUtils.getUserAvatar(target))
      .setDescription(status.concat(targetMember.presence.activities.length ? getActivity() : ""))

    if (target.id === client.user.id)
      embed.addField(
        "`Créditos`",
        `**Código fuente**: [GitHub](https://github.com/mariod8/LogiCraft-Discord-Bot)\n**Desarrollador**: ${await client.users.fetch(
          "323378898794446850"
        )}`
      )
    await channel.send(embed)
  },
}
