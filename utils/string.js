const ss = require("string-similarity")
const s = require("@string")

String.prototype.interpolate = function (params) {
  const names = Object.keys(params)
  const vals = Object.values(params)
  return new Function(...names, `return \`${this}\`;`)(...vals)
}

module.exports.getUserByString = async (username, member) => {
  let usernames = []
  const { guild } = member
  username = username.toLowerCase()

  await guild.members.cache.each(m => {
    usernames.push(m.user.username.toLowerCase())
  })
  const similarUser = ss.findBestMatch(username, usernames).bestMatch.target
  const desiredUser = await guild.members.cache.find(
    m => m.user.username.toLowerCase() == similarUser
  )
  if (ss.compareTwoStrings(similarUser, username) < 0.1) return null
  else return desiredUser.user
}

module.exports.interpolate = (string, params) => {
  return string.interpolate(params)
}

module.exports.formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
