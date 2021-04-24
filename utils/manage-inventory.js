const profileSchema = require("../schemas/profile-schema.js");

module.exports.inc = async (filter, id, amount) => {
  await profileSchema.findOneAndUpdate(
    {
      guildId: filter.guildId,
      userId: filter.userId,
    },
    {
      $inc: { "inventory.$[item].amount": amount },
    },
    {
      arrayFilters: [
        {
          "item.id": id,
        },
      ],
    }
  );
};

module.exports.addToSet = async (filter, id, item) => {
  id = id.toString();
  await profileSchema.findOneAndUpdate(
    {
      guildId: filter.guildId,
      userId: filter.userId,
    },
    {
      $addToSet: { inventory: { id: item } },
    }
  );
};
