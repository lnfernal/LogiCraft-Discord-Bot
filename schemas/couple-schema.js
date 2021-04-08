const mongoose = require("mongoose");

const coupleSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("couple", coupleSchema);
