require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const muteSchema = require("../../schemas/mute-schema.js")
const userUtils = require("@user")
const Discord = require("discord.js")

const unmute = async (member, author, params) => {
  const rolesBackup = await require("./mute.js").rolesBackup(),
    voice = member.voice,
    createdAt = await userUtils.getCreatedAt(member.guild, member.user),
    mutedSince = s.formatDate(createdAt),
    mutedFor = s.msToTime(new Date().getTime() - createdAt.getTime())

  rolesBackup.forEach(async roleBackup => {
    if (roleBackup.id == member.id) {
      await member.roles.set(roleBackup.roles)
    }
  })
  if (voice) {
   await voice.setMute(False, `Desmuteado por ${author.username}`) 
  }
  await params.channel.send(
    new Discord.MessageEmbed()
      .setTitle(`${member.user.username} ha sido desmuteado ${params.unmuted}`)
      .setFooter(`Desmuteado por ${author.username}`, `${author.avatarURL()}`)
      .setColor("#4aa96c")
      .setDescription(`**Muteado desde**: ${mutedSince}\n**Muteado durante**: ${mutedFor}`)
  )
}

module.exports = {
  commands: "unmute",
  expectedArgs: "<user|id>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, args, text, client) => {
    const { guild, channel } = message
    const target =
        message.mentions.users.first() ||
        (await s.getUserByString(args[0], message.member)) ||
        guild.members.cache.get(args[0]).user,
      emojis = await require("@emojis").logibotEmojis(client)
    let id

    if (!target) id = args[0]
    else id = target.id
    const result = await muteSchema.findOne({
      guildId: guild.id,
      userId: id,
      current: true,
    })
    if (result) {
      unmute((await guild.members.fetch()).get(target.id), message.author, { unmuted: emojis.unmuted, channel })
      await muteSchema.updateOne(
        {
          guildId: guild.id,
          userId: id,
          current: true,
        },
        {
          current: false,
        }
      )
    } else {
      channel.send(`${target.username} no está muteado`)
    }
  },
}

module.exports.triggerUnmute = async (member, author, params) => {
  await unmute(member, author, params)
}
