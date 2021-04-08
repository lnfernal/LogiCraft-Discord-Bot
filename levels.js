const mongo = require("./mongo.js");
const profileSchema = require("./schemas/profile-schema.js");

const maxLevel = 999;

const getNeededXP = (level) => 4 * (level ^ 3) / 5;

const addXP = async (guildId, member, xpToAdd, message) => {
  const spamChannel = message.guild.channels.cache.get("809393787553972224");
  const userId = member.id;
  await profileSchema
    .findOneAndUpdate(
      {
        guildId,
        userId,
      },
      {
        name: member.displayName,
        guildId,
        userId,
        $inc: {
          xp: xpToAdd,
          totalXp: xpToAdd,
        },
      },
      { upsert: true, new: true }
    )
    .then(async (result) => {
      let { xp, level, totalXp } = result;
      var needed = getNeededXP(level);

      do {
        needed = getNeededXP(level);
        if (xp >= needed && level <= maxLevel) {
          ++level;
          xp -= needed;
          await spamChannel.send(
            `**${message.member.displayName}** ha subido a nivel **${level}**`
          ).then();
        }
      } while (xp >= needed);
      await profileSchema.updateOne(
        {
          guildId,
          userId,
        },
        { level, xp }
      );
    });
};

module.exports = {
  addXpCall: (member, xpToAdd, message) => {
    addXP(message.guild.id, member, xpToAdd, message);
  },

  onMessage: (client, message) => {
    const { guild, member } = message;
    addXP(guild.id, member, Math.floor(Math.random() * 10 + 20), message);
  },
};
