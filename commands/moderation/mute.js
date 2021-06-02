require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const userUtils = require("@user")
const muteSchema = require("../../schemas/mute-schema.js")
const Discord = require("discord.js")
const unmute = require("./unmute.js")
let rolesBackup = []

module.exports = {
  commands: "mute",
  expectedArgs: "<user> [time] [reason]",
  minArgs: 1,
  maxArgs: 30,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, args, text, client) => {
    const { guild, channel } = message
    const staff = message.author
    const target = message.mentions.users.first() || (await s.getUserByString(args[0], message.member))
    const emojis = await require("@emojis").logibotEmojis(client)
    let reason = "_No especificado_",
      duration,
      timeUnit,
      timeout = 0,
      roles = [],
      expires

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    if (await userUtils.checkImmunity(message, target)) return

    const previousMutes = await muteSchema.find({
      userId: target.id,
      guildId: guild.id,
    })

    const currentlyMuted = previousMutes.filter(mute => {
      return mute.current === true
    })

    if (currentlyMuted.length) {
      message.channel.send(
        await messageHandler("alreadyMuted", message.member, {
          username: message.author.username,
        })
      )
      return
    }
    const mutedRole = await guild.roles.cache.find(role => {
      return role.name.toLowerCase().includes("mute")
    })

    if (!mutedRole) {
      message.channel.send(
        await messageHandler("missingRole", message.member, {
          username: message.author.username,
        })
      )
      return
    }

    expires = new Date()
    if (args[1]) {
      const uptime = args[1].match(/\d+\.?\d*[a-zA-Z](\s|$)/) ? args[1].match(/\d+\.?\d*[a-zA-Z](\s|$)/)[0] : null
      if (!uptime) {
        // means no time limit provided
        args.shift()
        reason = args.join(" ")
      } else {
        // means time provided
        duration = parseInt(args[1].match(/\d*\.?\d*/)[0])
        timeUnit = args[1].match(/[a-zA-Z]/)[0].toLowerCase()
        switch (timeUnit) {
          case "s":
            timeout = duration * 1000
            break
          case "m":
            timeout = duration * 60000
            break
          case "h":
            timeout = duration * 60 * 60000
            break
          case "d":
            timeout = duration * 24 * 60 * 60000
            break
          default:
            channel.send(
              `**${message.member.displayName}**, usa **s (segundos)**, **m (minutos)**, **h (horas)**, **d (dias)**`
            )
            return
        }
        if (timeout > 2147483647 || timeout < 5000) {
          channel.send(`**${message.member.displayName}**, el valor introducido no es válido`)
          return
        }
        if (args[2]) {
          args.shift()
          args.shift()
          reason = args.join(" ")
        }
      }
    }
    const targetMember = (await guild.members.fetch()).get(target.id)
    await targetMember.roles.cache.each(role => {
      if (role != guild.roles.everyone) roles.push(role)
    })
    rolesBackup.forEach(roleBackup => {
      if (roleBackup.id == target.id) rolesBackup.splice(rolesBackup[roleBackup], 1)
    })
    rolesBackup.push({
      roles,
      id: target.id,
    })
    if (timeout == 0) expires.setFullYear(2077)
    expires = new Date(expires.getTime() + timeout)
    if (expires < new Date().setFullYear(new Date().getFullYear() + 1)) {
      setTimeout(async () => {
        const result = await muteSchema.findOne({
          guildId: guild.id,
          userId: targetMember.id,
          current: true,
        })
        if (result) {
          await unmute.triggerUnmute(targetMember, client.user, { unmuted: emojis.unmuted, channel })
          await muteSchema.updateOne(
            {
              guildId: guild.id,
              userId: targetMember.id,
              current: true,
            },
            {
              current: false,
            }
          )
        }
      }, timeout)
    }
    await userUtils.incUserSchema(guild, target, "mutes", 1)
    await targetMember.roles.set([])
    await targetMember.roles.add(mutedRole)
    await new muteSchema({
      userId: target.id,
      guildId: guild.id,
      reason,
      staffId: staff.id,
      staffTag: staff.tag,
      expires,
      current: true,
    }).save()
    const embed = new Discord.MessageEmbed()
      .setTitle(`${targetMember.displayName} ha sido muteado ${emojis.muted}`)
      .setFooter(`Muteado por ${message.author.username}`, `${message.author.avatarURL()}`)
      .setColor("#ff4646")
      .setDescription(
        `**ID Usuario**: ${target.id}\n**Motivo**: ${reason}\n**Inicio**: ${s.formatDate(
          new Date()
        )}\n**Terminio**: ${s.formatDate(expires)}`
      )
    message.channel.send(embed)
  },
}

module.exports.rolesBackup = () => {
  return rolesBackup
}
module.exports.mutedRole = async () => {
  await guild.roles.cache.find(role => {
    return role.name.toLowerCase().includes("mute")
  })
}
