const Discord = require("discord.js")

module.exports = {
  commands: "pardon",
  expectedArgs: "<user_id>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, arguments, text, client) => {
    if (!isNaN(arguments[0])) {
      try {
        await client.users.fetch(arguments[0]).then(async user => {
          try {
            await message.guild.members.unban(user.id).then(() => {
              const embed = new Discord.MessageEmbed()
                .setColor("#30fc03")
                .setTitle(`${user.username} ha sido desbaneado`)
              message.channel.send(embed)
            })
          } catch (e) {
            message.channel.send(
              `El usuario ${user.username} no está baneado. Puedes consultar los usuarios baneados en _"Configuracón del servidor > Bans"_`
            )
          }
        })
      } catch (e) {
        message.channel.send("Usuario incorrecto")
      }
    } else {
      message.channel.send(
        `**${message.member.displayName}**, se necesita el id del usuario`
      )
    }
  },
}
