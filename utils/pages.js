require("module-alias/register")
const Discord = require("discord.js")
let msg

const getPage = async (pages, page, preset = "") => {
    const emojis = await require("@emojis").logibotEmojis(require("@client").getClient()),
      currentPage = pages[page - 1],
      discEmojis = await require("@emojis").discEmojis(require("@client").getClient())
    let embed = new Discord.MessageEmbed()

    switch (preset) {
      case "shop":
        var itemList = "",
          prices = ""
        const itemsInPage = currentPage.items
        embed.setTitle(currentPage.title)

        for (let item in itemsInPage)
          itemList += `**${itemsInPage[item].name}** ${itemsInPage[item].sprite ? itemsInPage[item].sprite : ""}\n${
            itemsInPage[item].description ? `${itemsInPage[item].description}` : ""
          }\n`
        for (let item in itemsInPage) prices += `**${itemsInPage[item].price}** ${emojis.logiCoin}\n\n`
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
        embed
          .setColor("#ff5d8f")
          .setTitle(`Ranking de ${msg.guild.name}`)
          .addFields(
            {
              name: "`Nombre`",
              value: currentPage.names,
              inline: true,
            },
            {
              name: "`XP`",
              value: currentPage.xp,
              inline: true,
            },
            {
              name: "`Nivel`",
              value: currentPage.level,
              inline: true,
            }
          )
          .setThumbnail(msg.guild.iconURL())
        break
      case "coupletop":
        embed
          .setColor("#ba0001")
          .setTitle(`${emojis.heart} Parejas de ${msg.guild.name} ${emojis.heart}`)
          .addFields(
            {
              name: "`Nombre`",
              value: currentPage.names,
              inline: true,
            },
            {
              name: "`Parejas`",
              value: currentPage.couples,
              inline: true,
            }
          )
          .setThumbnail(msg.guild.iconURL())
        break
      case "queue":
        embed
          .setColor("#ba0001")
          .setTitle(
            `${
              discEmojis[Object.keys(discEmojis)[Math.floor(Math.random() * Object.keys(discEmojis).length)]]
            } Cola de reproducción ${
              discEmojis[Object.keys(discEmojis)[Math.floor(Math.random() * Object.keys(discEmojis).length)]]
            }`
          )
          .addFields(
            {
              name: "`Nombre`",
              value: currentPage.names,
              inline: true,
            },
            {
              name: "`Autor`",
              value: currentPage.authors,
              inline: true,
            }
          )
          .setDescription(
            "Puedes randomizar la cola de reproducción con `/shuffle`, saltar la canción actual con `/skip` o ver que se está reproducciendo ahora con `/np`. Más comandos en _/help > Comandos > Comandos de música_"
          )
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
  await message.channel.send(await getPage(pages, page, preset)).then(msg => {
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

      backwards.on("collect", async (r, user) => {
        r.users.remove(user.id)
        if (page === 1) return
        page--
        msg.edit(await getPage(pages, page, preset))
        backwards.resetTimer()
        forwards.resetTimer()
      })
      forwards.on("collect", async (r, user) => {
        r.users.remove(user.id)
        if (page === pages.length) return
        page++
        msg.edit(await getPage(pages, page, preset))
        backwards.resetTimer()
        forwards.resetTimer()
      })
      backwards.on("end", async () => {
        await msg.reactions.removeAll()
      })
    })
  })
}
