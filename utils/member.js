require("module-alias/register")
const color = require("dominant-color")
const fs = require("fs")
const request = require("request")
const c = require("@client")

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback)
  })
}

module.exports.getAvatarDominantColor = async user => {
  const url = user.avatarURL()
  path = `./temp/${user.username}.png`
  let returnColor
  download(url, path, () => {
    color(path, function (err, color) {
      fs.unlinkSync(path, err => {
        if (err) console.log(err)
      })
      returnColor = `#${color}`
    })
  })
  await c.sleep(500)
  return returnColor
}
