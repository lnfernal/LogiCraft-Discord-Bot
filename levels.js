const mongo = require("./utils/mongo.js");
const profileSchema = require("./schemas/profile-schema.js");

const maxLevel = 999;

const getNeededXP = (level) => level * level * 100;

const addXP = async (guildId, member, xpToAdd, message) => {
  const spamChannel = message.guild.channels.cache.get("829680230301564928");
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
            `**${member.displayName}** ha subido a nivel **${level}**`
          );
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
    if (!message.content.startsWith("/xpadd"))
      addXP(guild.id, member, Math.floor(Math.random() * 10 + 20), message);
  },
};
