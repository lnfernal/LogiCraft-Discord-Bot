require("module-alias/register")
const Discord = require("discord.js")
let msg

const getPage = async (pages, page, preset = "") => {
    const logiEmojis = await require("@emojis").logibotEmojis(require("@client").getClient())
    let embed = new Discord.MessageEmbed()

    switch (preset) {
      case "shop":
        var itemList = "",
          prices = ""
        const itemsInPage = pages[page - 1].items
        embed.setTitle(pages[page - 1].title)

        for (let item in itemsInPage)
          itemList += `**${itemsInPage[item].name}** ${itemsInPage[item].sprite ? itemsInPage[item].sprite : ""}\n${
            itemsInPage[item].description ? `${itemsInPage[item].description}` : ""
          }\n`
        for (let item in itemsInPage) prices += `**${itemsInPage[item].price}** ${logiEmojis.logiCoin}\n\n`
        embed.addFields(
          {
            name: "Item",
            value: itemList,
            inline: true,
          },
          { name: "Coste", value: prices, inline: true }
        )
        break
      case "xptop":
        const currentPage = pages[page - 1]
        embed
          .setColor("#ff5d8f")
          .setTitle(`Ranking de ${msg.guild.name}`)
          .addFields(
            {
              name: "Nombre",
              value: currentPage.names,
              inline: true,
            },
            {
              name: "XP",
              value: currentPage.xp,
              inline: true,
            },
            {
              name: "Nivel",
              value: currentPage.level,
              inline: true,
            }
          )
          .setThumbnail(msg.guild.iconURL())
        break
      default:
        break
    }
    embed.setFooter(`Página ${page} / ${pages.length}`)
    return embed
  },
  storeUpTime = 60

module.exports.createPages = async (message, pages, preset) => {
  const logiEmojis = await require("@emojis").logibotEmojis(require("@client").getClient()),
    leftArrow = logiEmojis.leftArrow,
    rightArrow = logiEmojis.rightArrow
  let page = 1

  msg = message

  message.channel.send(getPage(pages, page, preset)).then(msg => {
    msg.react(logiEmojis.leftArrow.id).then(r => {
      msg.react(logiEmojis.rightArrow.id)
      const backwardsFilter = (reaction, user) => reaction.emoji.id === leftArrow.id && user.id === message.author.id
      const forwardsFilter = (reaction, user) => reaction.emoji.id === rightArrow.id && user.id === message.author.id

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
        msg.edit(getPage(pages, page, preset))
        backwards.resetTimer()
        forwards.resetTimer()
      })
      forwards.on("collect", (r, user) => {
        r.users.remove(user.id)
        if (page === pages.length) return
        page++
        msg.edit(getPage(pages, page, preset))
        backwards.resetTimer()
        forwards.resetTimer()
      })
      backwards.on("end", async () => {
        await msg.reactions.removeAll()
      })
    })
  })
}
