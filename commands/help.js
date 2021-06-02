require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const { MessageEmbed } = require("discord.js")
const { Menu } = require("discord.js-menu")

module.exports = {
  commands: "help",
  callback: async (message, args, text, client) => {
    let helpMenu = new Menu(
      message.channel,
      message.author.id,
      [
        {
          name: "main",
          content: new MessageEmbed({
            title: "Menú de ayuda",
            description: `Puedes consultar cualquier función, comando, sistema, etc... del bot usando \`/help\` Haz click en cada una de las reacciones para ver la información correspondiente con ese apartado`,
            fields: [
              {
                name: "Cuenta",
                value: "Todo lo relacionado con los usuarios del servidor",
                inline: true,
              },
            ],
          }),
          reactions: {
            "😳": "extra",
            "😀": async () => {
              let res = await message.channel.send("Hey-")
              setTimeout(() => {
                return res.edit("listen!")
              }, 1000)
            },
          },
        },
        {
          name: "extra",
          content: new MessageEmbed({
            title: "Extra menu",
            description: "This is another page.",
          }),
          reactions: {
            "1️⃣": "main",
            "2️⃣": "delete",
          },
        },
      ],
      300000
    )
    helpMenu.start()
    helpMenu.on("pageChange", destination => {
      destination.content.title = "Hey, " + message.author.username
    })
  },
}
