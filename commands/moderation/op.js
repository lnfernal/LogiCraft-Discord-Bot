require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "op",
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  requiredRoles: ["666297045207875585", "666297857929642014"],
  callback: async (message, arguments, text, client) => {
    const user =
      message.mentions.users.first() ||
      (await s.getUserByString(arguments[0], message.member))
    if (user) {
      const role = message.guild.roles.cache.get("666297045207875585")
      const member = message.guild.members.cache.get(user.id)
      member.roles.add(role).catch(console.error)
    } else {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ]
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      )
    }
  },
}
