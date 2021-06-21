const mongoose = require("mongoose")

const reqString = {
  type: String,
  require: true,
}

const serverSchema = mongoose.Schema({
  guildId: reqString,
  name: {
    type: String,
    default: "",
  },
})

module.exports = mongoose.model("servers", profileSchema)
