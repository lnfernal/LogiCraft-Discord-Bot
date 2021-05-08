const mongoose = require("mongoose")

const reqString = {
  type: String,
  require: true,
}

const profileSchema = mongoose.Schema({
  name: reqString,
  guildId: reqString,
  userId: reqString,
  coins: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  totalXp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  lover: {
    type: Number,
    default: 0,
  },
  inventory: {
    type: [Object],
    required: true,
  },
})

module.exports = mongoose.model("profiles", profileSchema)
