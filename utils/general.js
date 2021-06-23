const defaultAvatarURL = "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png"
const moment = require("moment")
const serverSchema = require("../schemas/server-schema.js")

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

module.exports.getServerIcon = async (guild, params = {}) => {
  let { dynamic = false, size = 64 } = params
  return guild.iconURL() ? guild.iconURL(dynamic, size) : defaultAvatarURL
}

module.exports.getImageColor = async link => {
  const { getColorFromURL } = require("color-thief-node"),
    url = link ? link.replace(".webp", ".png") : defaultAvatarURL

  const [r, g, b] = await getColorFromURL(url)
  return rgbToHex(r, g, b)
}

module.exports.formatDate = (date, params = {}) => {
  const { format = "llll" } = params

  moment.locale("es")
  return moment(date).format(format)
}

module.exports.timeSince = date => {
  moment.locale("es")
  return moment(date).fromNow()
}

async function checkSchema(guild) {
  let result = await serverSchema.findOne({
    guildId: guild.id,
  })
  if (!result) {
    await new serverSchema({
      guildId: guild.id,
    }).save()
    result = await serverSchema.findOne({
      guildId: guild.id,
    })
  }
  return result
}

module.exports.getSchema = async guild => {
  return await checkSchema(guild)
}

module.exports.incSchema = async (guild, key, amount) => {
  await checkSchema(guild)
  await serverSchema.updateOne(
    {
      guildId: guild.id,
    },
    {
      $inc: { [`${key}`]: amount },
    }
  )
}

module.exports.setSchema = async (guild, key, value) => {
  await checkSchema(guild)
  await serverSchema.updateOne(
    {
      guildId: guild.id,
    },
    {
      $set: { [`${key}`]: value },
    }
  )
}
