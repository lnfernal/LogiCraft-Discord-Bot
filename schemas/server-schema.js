const mongoose = require("mongoose")

const reqString = {
  type: String,
  require: true,
}

const serverSchema = mongoose.Schema({
  guildId: reqString,
  users: {
    type: Array,
    default: [],
  },
})

module.exports = mongoose.model("servers", serverSchema)
