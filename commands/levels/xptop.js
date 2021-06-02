require("module-alias/register")
const userUtils = require("@user")
const s = require("@string")
const Discord = require("discord.js")

module.exports = {
  commands: "xptop",
  maxArgs: 0,
  callback: async (message, args, text, client) => {
    const guild = message.guild,
      usersPerPage = 20
    emojis = await require("@emojis").logibotEmojis(client)
    let users = [],
      usersCurrentPage = 0,
      currentPage = {},
      names = ``,
      xp = ``,
      level = ``,
      xpTopPages = []

    await guild.members.fetch().then(async members => {
      const promises = []

      members.forEach(member => {
        promises.push(userUtils.getUserProfile(guild, member.user))
      })
      users = await Promise.all(promises)
    })
    users.sort(function (a, b) {
      return b.totalXp - a.totalXp
    })
    for (let i = 0; i < users.length; i++) {
      names += `${i === 0 ? emojis.one : i === 1 ? emojis.two : i === 2 ? emojis.three : i + 1 + "."} ${users[
        i
      ].name.replace("_", "\\_")}\n`
      xp += `${s.formatNumber(users[i].totalXp)}\n`
      level += `${s.formatNumber(users[i].level)}\n`
      usersCurrentPage++
      if (usersCurrentPage == usersPerPage || i == users.length - 1) {
        usersCurrentPage = 0
        currentPage = { names, xp, level }
        xpTopPages.push(currentPage)
        names = ``
        xp = ``
        level = ``
      }
    }
    require("@pages").createPages(message, xpTopPages, "xptop")
  },
}
