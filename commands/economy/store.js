const Discord = require("discord.js")
let logiEmojis, items, rightArrow, leftArrow
const storeUpTime = 60 //sec

const getPage = (pages, page) => {
  var itemList = "",
    prices = ""
  const itemsInPage = pages[page - 1].items
  const embed = new Discord.MessageEmbed()
    .setTitle(pages[page - 1].title)
    .setFooter(`Página ${page} / ${pages.length}`)

  for (let item in itemsInPage) {
    itemList += `**${itemsInPage[item].name}** ${
      itemsInPage[item].sprite ? itemsInPage[item].sprite : ""
    }\n${
      itemsInPage[item].description ? `${itemsInPage[item].description}` : ""
    }\n`
  }
  for (let item in itemsInPage) {
    prices += `**${itemsInPage[item].price}** ${logiEmojis.logiCoin}\n\n`
  }
  embed.addFields(
    { name: "Item", value: itemList, inline: true },
    { name: "Coste", value: prices, inline: true }
  )
  return embed
}

module.exports = {
  commands: "shop",
  callback: async (message, arguments, text, client) => {
    logiEmojis = await require("../../utils/emojis.js").logibotEmojis(client)
    items = await require("../../utils/items.js")(client)
    leftArrow = logiEmojis.leftArrow
    rightArrow = logiEmojis.rightArrow
    let page = 1
    let pages = [
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

    await require("../../utils/emojis.js")
      .logibotEmojis(client)
      .then(async emojis => {
        message.channel.send(getPage(pages, page, emojis)).then(msg => {
          msg.react(logiEmojis.leftArrow.id).then(r => {
            msg.react(logiEmojis.rightArrow.id)
            const backwardsFilter = (reaction, user) =>
              reaction.emoji.id === leftArrow.id &&
              user.id === message.author.id
            const forwardsFilter = (reaction, user) =>
              reaction.emoji.id === rightArrow.id &&
              user.id === message.author.id

            const backwards = msg.createReactionCollector(backwardsFilter, {
              time: storeUpTime * 1000,
            })
            const forwards = msg.createReactionCollector(forwardsFilter, {
              time: storeUpTime * 1000,
            })

            backwards.on("collect", (r, user) => {
              r.users.remove(user.id)
              if (page === 1) return
              page--
              msg.edit(getPage(pages, page))
            })
            forwards.on("collect", (r, user) => {
              r.users.remove(user.id)
              if (page === pages.length) return
              page++
              msg.edit(getPage(pages, page))
            })
            backwards.on("end", () => {
              msg.delete()
            })
          })
        })
      })
  },
}
