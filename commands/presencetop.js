require("module-alias/register")
const Discord = require("discord.js")
const userUtils = require("@user")

module.exports = {
  commands: "presencetop",
  callback: async (message, args, text, client) => {
    const { guild } = message,
      emojis = await require("@emojis").logibotEmojis(client),
      usersPerPage = 20
    let users,
      usersCurrentPage = 0,
      currentPage = {},
      names = ``,
      presence = ``,
      presenceTopPages = []

    await guild.members.fetch().then(async members => {
      const promises = []
      members.forEach(member => {
        promises.push(userUtils.getUserProfile(guild, member.user))
      })
      users = await Promise.all(promises)
    })
    users.sort(function (a, b) {
      return b.presence - a.presence
    })
    for (let i = 0; i < users.length; i++) {
      names += `${i === 0 ? emojis.one : i === 1 ? emojis.two : i === 2 ? emojis.three : i + 1 + "."} ${users[
        i
      ].name.replace("_", "\\_")}\n`
      presence +=
        users[i].presence == -1
          ? `Ninguna ${emojis.none}`
          : users[i].presence == 0
          ? `Baja ${emojis.little}`
          : users[i].presence == 1
          ? `Moderada ${emojis.moderate}`
          : `Alta ${emojis.high}`
      usersCurrentPage++
      if (usersCurrentPage == usersPerPage || i == users.length - 1) {
        usersCurrentPage = 0
        currentPage = { names, presence }
        presenceTopPages.push(currentPage)
        names = ``
        presence = ``
      }
    }
    require("@pages").createPages(message, presenceTopPages, "presencetop")
  },
}
