const mongo = require("./mongo.js");
const profileSchema = require("./schemas/profile-schema.js");

const maxLevel = 999;

const getNeededXP = (level) => level * level * 100;

const addXP = async (guildId, member, xpToAdd, message) => {
  const spamChannel = message.guild.channels.cache.get("809393787553972224");
  const userId = member.id
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
      var needed = 0
      
      do {
        needed = getNeededXP(level);
        if (xp >= needed && level <= maxLevel) {
          ++level;
          xp -= needed;
          spamChannel.send(
            `**${message.member.displayName}** ha subido a nivel **${level}**`
          );
          await profileSchema.updateOne(
            {
              guildId,
              userId,
            },
            { level, xp }
          );
        }
      } while (xp >= needed);
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
