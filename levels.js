const mongo = require("./mongo.js");
const profileSchema = require("./schemas/profile-schema.js");

const maxLevel = 999;

const getNeededXP = (level) => level * level * 100;

const addXP = async (guildId, userId, xpToAdd, message) => {
  const spamChannel = message.guild.channels.cache.get("669882952582168607");
  await profileSchema
    .findOneAndUpdate(
      {
        guildId,
        userId,
      },
      {
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
      const needed = getNeededXP(level);

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
      } else {
        //console.log(`Current Level: ${Math.floor(xp / needed * 100)}%`)
      }
    });
};

module.exports = {
  onMessage: (client, message) => {
    const { guild, member } = message;
    addXP(guild.id, member.id, Math.floor(Math.random() * 10 + 20), message);
  },
};
