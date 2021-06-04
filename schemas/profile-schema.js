const mongoose = require("mongoose")

const reqString = {
  type: String,
  require: true,
}

const profileSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
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
    default: 0,
  },
  lover: {
    type: Number,
    default: 0,
  },
  mutes: {
    type: Number,
    default: 0,
  },
  pongs: {
    type: Number,
    default: 0,
  },
  weekly: {
    type: Number,
    default: 0,
  },
  messages: {
    type: Number,
    default: 0,
  },
  words: {
    type: Number,
    default: 0,
  },
  images: {
    type: Number,
    default: 0,
  },
  presence: {
    type: Number,
    default: -1,
  },
  points: {
    // presence
    type: Number,
    default: 0,
  },
  weeklyUser: {
    type: Object,
    default: {
      messages: 0,
      images: 0,
      words: 0,
    },
  },
})

module.exports = mongoose.model("profiles", profileSchema)
