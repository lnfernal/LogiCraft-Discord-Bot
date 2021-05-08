const mongo = require("../index.js").mongo
const profileSchema = require("../schemas/profile-schema.js")

module.exports = client => {}

module.exports.addCoins = async (guildId, userId, coins) => {
  const result = await profileSchema.findOneAndUpdate(
    { guildId, userId },
    { guildId, userId, $inc: { coins } },
    { upsert: true, new: true }
  )
  return result.coins
}

module.exports.getCoins = async (guildId, userId) => {
  const result = await profileSchema.findOne({
    guildId,
    userId,
  })
  let coins = 0
  if (result) {
    coins = result.coins
  } else {
    await new profileSchema({
      guildId,
      userId,
      coins,
    }).save()
  }
  return coins
}
