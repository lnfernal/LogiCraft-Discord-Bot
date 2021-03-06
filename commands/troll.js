require("module-alias/register")
const regex = require("@regex")
const Discord = require("discord.js")
let actionTimeout,
  mode = 0,
  emojis,
  reactedMessages = [],
  rolesBackup = [],
  guildRoles = [],
  guildMembers = [],
  witherMembersNameBackup = [],
  witherRolesNameBackup = [],
  witherChannelsNameBackup = [],
  channelsRolesMembers = 0,
  sentMessages = [],
  herobrineTimeout,
  channelsBackup = [],
  cancelled = false,
  hChannel,
  hChannel2

const roleFilter = [
  "824989891317334058",
  "788187970930343976",
  "830422173071179786",
  "812371550300536833",
  "666297857929642014",
  "835554369666547743",
  "834422510166081537",
]

const randomName = () => {
  const withers = [witherChannelsNameBackup, witherMembersNameBackup, witherRolesNameBackup]
  const wither = withers[Math.floor(Math.random() * withers.length)]
  return wither[Math.floor(Math.random() * wither.length)].name
}

const changeNames = async guild => {
  let witherDelay = 1
  /*witherChannelsNameBackup.forEach(async c => {
    setTimeout(async () => {
      const channel = await guild.channels.cache.get(c.id)
      await channel.setName(randomName())
    }, witherDelay * 1000)
    witherDelay++
  })*/
  witherMembersNameBackup.forEach(async m => {
    setTimeout(async () => {
      const member = await guild.members.cache.get(m.id)
      await member.setNickname(randomName())
    }, witherDelay * 1000)
    witherDelay++
  })
  witherRolesNameBackup.forEach(async r => {
    setTimeout(async () => {
      const role = await guild.roles.cache.get(r.id)
      //await role.setName(randomName())
      await role.setColor("#24201a")
    }, witherDelay * 1000)
    witherDelay++
  })
  actionTimeout = setTimeout(() => {
    changeNames(guild)
  }, channelsRolesMembers * 1.2 * 1000)
}

const changeRoles = async guild => {
  guildMembers.forEach(async (member, i) => {
    setTimeout(async () => {
      await member.roles
        .set([])
        .then(async () => {
          await member.roles.add(guildRoles[Math.floor(Math.random() * guildRoles.length)]).catch(console.error)
        })
        .catch(console.error)
    }, i * 1000)
  })
  actionTimeout = setTimeout(() => {
    changeRoles(guild)
  }, guild.memberCount * 2 * 1000)
}

const countdown = (i, channel) => {
  setTimeout(async () => {
    if (i % 5 == 0 && !cancelled) await channel.send(`**${i}s**`)
    i--
    if (i > 0) countdown(i, channel)
  }, 1 * 1000)
}

module.exports = {
  commands: "troll",
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "<mode|end>",
  permissions: ["ADMINISTRATOR"],
  callback: async (message, args, text, client) => {
    const { guild, member, guildId = guild.id, channel } = message
    if (args[0] !== "end" && mode != 0) {
      channel.send("Ya hay un troleo activo")
      return
    }

    switch (args[0]) {
      case "silverfish":
        mode = 1
        break
      case "phantom":
        mode = 2
        rolesBackup = []
        guildMembers = []
        await guild.members.cache.each(async member => {
          let roles = [],
            validMember = true
          await member.roles.cache.each(role => {
            if (role.name != "@everyone")
              if (!roleFilter.includes(role.id) && member.id != guild.ownerID && member.id != client.user.id)
                roles.push(role)
              else validMember = false
          })
          if (validMember) {
            rolesBackup.push({
              id: member.id,
              roles,
            })
            guildMembers.push(member)
          }
        })
        await guild.roles.cache.each(role => {
          if (!roleFilter.includes(role.id) && role.name != "@everyone") guildRoles.push(role)
        })
        await changeRoles(guild)
        break
      case "creeper":
        mode = 3
        break
      case "wither":
        mode = 4
        witherRolesNameBackup = []
        witherChannelsNameBackup = []
        witherMembersNameBackup = []
        channelsRolesMembers = 0

        await guild.members.cache.each(member => {
          if (member.manageable && member.user != client.user)
            witherMembersNameBackup.push({
              id: member.id,
              name: member.displayName,
            })
          channelsRolesMembers++
        })
        await guild.roles.cache.each(role => {
          if (!role.managed && role != guild.roles.everyone && role.editable)
            witherRolesNameBackup.push({
              id: role.id,
              name: role.name,
              color: role.hexColor,
            })
          channelsRolesMembers++
        })
        await guild.channels.cache.each(channel => {
          witherChannelsNameBackup.push({
            id: channel.id,
            name: channel.name,
          })
          channelsRolesMembers++
        })
        await changeNames(guild)
        break
      case "herobrine":
        mode = 5
        cancelled = false
        countdown(60, channel)
        channelsBackup = []
        herobrineTimeout = setTimeout(async () => {
          await guild.channels.cache.each(channel => {
            channelsBackup.push({
              id: channel.id,
              permissionOverwrites: channel.permissionOverwrites,
            })
            channel.overwritePermissions(
              [
                {
                  id: guild.roles.everyone.id,
                  deny: ["VIEW_CHANNEL"],
                },
              ],
              "Herobrine joined the game"
            )
          })
          hChannel = await guild.channels.create("general", {
            type: "text",
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ["MANAGE_CHANNELS", "CREATE_INSTANT_INVITE", "MANAGE_MESSAGES", "MENTION_EVERYONE"],
              },
            ],
          })
          hChannel2 = await guild.channels.create("Voice chat", {
            type: "voice",
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ["MANAGE_CHANNELS", "CREATE_INSTANT_INVITE", "MANAGE_MESSAGES", "MENTION_EVERYONE"],
              },
            ],
          })
        }, 1000 * 65)
        break
      case "end":
        switch (mode) {
          case 1:
            channel.send("Limpiando reacciones...")
            reactedMessages.forEach(message => {
              message.reactions.removeAll()
            })
            reactedMessages = []
            mode = 0
            break
          case 2:
            channel.send("Restaurando roles...")
            clearTimeout(actionTimeout)
            mode = 0
            guildRoles = []
            setTimeout(() => {
              guildMembers.forEach(async (member, i) => {
                rolesBackup.forEach(async roles => {
                  if (roles.id == member.id)
                    setTimeout(async () => {
                      await member.roles.set([]).then(async () => {
                        await member.roles.set(roles.roles)
                      })
                    }, i * 1000)
                })
              })
            }, guild.memberCount * 1.5)
            break
          case 3:
            channel.send("Eliminando mensajes...")
            mode = 0
            sentMessages.forEach(message => {
              message.delete().catch(console.error)
            })
            sentMessages = []
            break
          case 4:
            mode = 0
            witherDelay = 1
            channel.send("Reestableciendo nombres...")
            clearTimeout(actionTimeout)
            setTimeout(() => {
              /*witherChannelsNameBackup.forEach(async c => {
                setTimeout(async () => {
                  const channel = await guild.channels.cache.get(c.id)
                  await channel.setName(c.name)
                }, witherDelay * 1000)
                witherDelay++
              })*/
              witherMembersNameBackup.forEach(async m => {
                setTimeout(async () => {
                  const member = await guild.members.cache.get(m.id)
                  await member.setNickname(m.name)
                }, witherDelay * 1000)
                witherDelay++
              })
              witherRolesNameBackup.forEach(async r => {
                setTimeout(async () => {
                  const role = await guild.roles.cache.get(r.id)
                  //await role.setName(r.name)
                  await role.setColor(r.color)
                }, witherDelay * 1000)
                witherDelay++
              })
            }, channelsRolesMembers * 1000 * 1.5)
            break
          case 5:
            mode = 0
            await channelsBackup.forEach(async channel => {
              const c = await guild.channels.cache.get(channel.id)
              if (c) c.overwritePermissions(channel.permissionOverwrites)
            })
            await hChannel.delete("Herobrine left the game")
            await hChannel2.delete()
            break
          default:
            channel.send("No hay acciones activas")
            return
        }
        break
      default:
        channel.send("Selecciona una acci??n con su palabra clave o _end_ para detenerlo")
        return
    }
    await require("../misc/avatar-manager.js").troll(client)
    if (mode != 0) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Iniciado protocolo ${args[0].charAt(0).toUpperCase() + args[0].slice(1)} (${mode})`)
        .setColor("#ff0000")
      switch (mode) {
        case 1:
          embed.setDescription("HOLY EMOJI").setColor("#DEDFE5")
          break
        case 2:
          embed.setDescription("ROLE REROLL").setColor("#132572")
          break
        case 3:
          embed.setDescription("DAMN SPAM").setColor("#0db50d")
          break
        case 4:
          embed.setDescription("IDENTITY MESSILY").setColor("#24201a")
          break
        case 5:
          embed
            .setDescription(
              "CHANNEL DISMANTLE\n\n[!] Todos los canales ser??n eliminados en 60 segundos\n??Est??s seguro? Usa _/cancel_ para detener la acci??n"
            )
            .setColor("#ffdbac")
          break
      }
      channel.send(embed)
    }
  },
  onMessage: async (client, message) => {
    const { member, guild, guildId = guild.id } = message
    emojis = await require("../utils/emojis.js").guildEmojis(client, guildId)
    if (member.id === guild.ownerID) return
    switch (mode) {
      case 1:
        var keys = Object.keys(emojis)
        reactedMessages.push(message)
        for (var i = 0; i < Math.floor(Math.random() * 5 + 1); i++)
          await message.react(emojis[keys[Math.floor(Math.random() * keys.length)]].id)
        break
      case 3:
        await guild.channels.cache.each(channel => {
          if (channel.type == "text") {
            channel
              .send(regex.spam(message.content))
              .then(msg => sentMessages.push(msg))
              .catch(console.error)
          }
        })
        break
    }
  },
  cancel: () => {
    clearTimeout(herobrineTimeout)
    cancelled = true
    mode = 0
  },
}
