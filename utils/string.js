const ss = require("string-similarity")

String.prototype.interpolate = function (params) {
  const names = Object.keys(params)
  const vals = Object.values(params)
  return new Function(...names, `return \`${this}\`;`)(...vals)
}

module.exports.getUserByString = async (username, member) => {
  let usernames = []
  const { guild } = member

  await guild.members.cache.each(m => {
    usernames.push(m.user.username)
  })
  const similarUser = ss.findBestMatch(username, usernames).bestMatch.target
  const desiredUser = await guild.members.cache.find(
    m => m.user.username == similarUser
  )
  if (ss.compareTwoStrings(similarUser, username) < 0.1) return null
  else return desiredUser.user
}

module.exports.interpolate = (string, params) => {
  return string.interpolate(params)
}
