const Discord = require("discord.js")
const avatarManager = require("../avatar-manager/avatar-manager.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const { logibotEmojis } = require("../utils/emojis.js")
const roleId = "784023842976563231"

const hjMsg = [
  "BONK",
  "Happy Cheems noises :)",
  "Go to Horny Jail!",
  "No Horny",
  "Horny bad",
  "Licencia de Horny",
]

module.exports = {
  commands: ["hornyjail", "bonk"],
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, arguments, text, client) => {
    const { member } = message
    const user =
      message.mentions.users.first() || (await s.getUser(arguments[0], member))
    const role = message.guild.roles.cache.get(roleId)
    if (!user)
      message.channel.send(
        s.interpolate(await messageHandler("missingUser", member), {
          username: member.user.username,
        })
      )
    const target = await message.guild.members.cache.get(user.id)
    if (member.roles.cache.get(role.id)) {
      target.roles.remove(role)
    } else {
      target.roles.add(role)
      const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(
          `${s.interpolate(await messageHandler("hj", member), {
            username: target.username,
            hjEmoji: logibotEmojis.GOTOHORNYJAIL
          })}`
        )
        .setDescription(hjMsg[Math.floor(Math.random() * hjMsg.length)])
      message.channel.send(embed)
      avatarManager.angry(client)
    }
  },
}
