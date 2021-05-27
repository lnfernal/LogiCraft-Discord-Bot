const ss = require("string-similarity")
const s = require("@string")

String.prototype.interpolate = function (params) {
  const names = Object.keys(params)
  const vals = Object.values(params)
  return new Function(...names, `return \`${this}\`;`)(...vals)
}

module.exports.getUserByString = async (username, member) => {
  if (!username) return

  let usernames = []
  const { guild } = member
  username = username.toLowerCase()

  await guild.members.cache.each(m => {
    usernames.push(m.user.username.toLowerCase())
  })
  const similarUser = ss.findBestMatch(username, usernames).bestMatch.target
  const desiredUser = await guild.members.cache.find(m => m.user.username.toLowerCase() == similarUser)
  if (ss.compareTwoStrings(similarUser, username) < 0.1) return null
  else return desiredUser.user
}

module.exports.interpolate = (string, params) => {
  return string.interpolate(params)
}

module.exports.formatNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

module.exports.parseDate = input => {
  var parts = input.match(/(\d+)/g)
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1] - 1, parts[2]) // months are 0-based
}

const getNestedPropertyFunc = (object, path) => {
  if (path.length === 1) return object[path[0]]
  else if (path.length === 0) throw error
  else {
    if (object[path[0]]) return getNestedPropertyFunc(object[path[0]], path.slice(1))
    else {
      object[path[0]] = {}
      return getNestedPropertyFunc(object[path[0]], path.slice(1))
    }
  }
}

module.exports.getNestedProperty = (object, path) => {
  return getNestedPropertyFunc(object, path)
}

module.exports.fixNumber = x => {
  return Math.abs(Number(x)) >= 1.0e15
    ? Math.abs(Number(x)) / 1.0e15 + "Q"
    : Math.abs(Number(x)) / 1.0e12
    ? Math.abs(Number(x)) / 1.0e12 + "T"
    : Math.abs(Number(x)) >= 1.0e9
    ? Math.abs(Number(x)) / 1.0e9 + "B"
    : Math.abs(Number(x)) >= 1.0e6
    ? Math.abs(Number(x)) / 1.0e6 + "M"
    : Math.abs(Number(x)) >= 1.0e3
    ? Math.abs(Number(x)) / 1.0e3 + "K"
    : Math.abs(Number(x))
}
