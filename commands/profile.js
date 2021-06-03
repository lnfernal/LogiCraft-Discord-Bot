require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")
const moment = require('moment');
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

    await channel.send(
      new MessageEmbed()
        .setTitle(`Perfil de ${target.tag} _(${targetMember.displayName})_`)
        .setColor(await userUtils.getAvatarColor(target))
        .addFields(
          {
            name: "Fecha de unión",
            value: `${userUtils.getJoinedAt(targetMember.joinedAt)} _(${moment(targetMember.joinedAt).fromNow()})_`,
            inline: true,
          },
          {
            name: "Nivel",
            value: `${profile.level}`,
            inline: true,
          },
          {
            name: "XP",
            value: `${s.formatNumber(profile.totalXp)}`,
            inline: true,
          },
          {
            name: "Parejas",
            value: `${profile.lover}`,
            inline: true,
          },
          {
            name: "Veces usuario de la semana",
            value: `${profile.weekly}`,
            inline: true,
          },
          {
            name: "Veces muteado",
            value: `${profile.mutes}`,
            inline: true,
          },
          {
            name: "Monedas",
            value: `${profile.coins}`,
            inline: true,
          },
          {
            name: "Actividad en el servidor",
            value: `${profile.presence == 0 ? "Poca" : profile.presence == 1 ? "Moderada" : "Alta"}`,
            inline: true,
          },
          {
            name: "Mensajes enviados",
            value: `${profile.messages}`,
            inline: true,
          },
          {
            name: "Palabras escritas",
            value: `${profile.words}`,
            inline: true,
          },
          {
            name: "Imágenes enviadas",
            value: `${profile.images}`,
            inline: true,
          },
          {
            name: "Último mensaje",
            value: `\"${targetMember.lastMessage}\" _(${moment(targetMember.lastMessage.createdAt).fromNow()})_`,
            inline: true,
          },
          {
            name: "Último boost al servidor",
            value: `${targetMember.premiumSince ? moment(targetMember.premiumSince).format("LLLL") : "_Nunca_"}`,
            inline: true,
          }
        )
        .setThumbnail(target.avatarURL())
    )
  },
}
