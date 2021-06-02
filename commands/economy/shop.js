require("module-alias/register")
const Discord = require("discord.js")

module.exports = {
  commands: "shop",
  callback: async (message, args, text, client) => {
    const items = await require("../../utils/items.js")(client),
      pages = require("@pages")
    shopPages = [
      {
        title: "???",
        items: {
          nullItem: items.nullItem,
        },
      },
      {
        title: "###",
        items: {
          nullItem: items.nullItem,
          nullItem2: items.nullItem,
        },
      },
    ]

    pages.createPages(message, shopPages, "shop")
  },
}
