const mongo = require("./utils/mongo.js");
const profileSchema = require("./schemas/profile-schema.js");

const maxLevel = 999;

const xpNeededFunc = (level) => Math.floor(Math.pow(level, 2.5) * 10);
const xpPerMsgFunc = (level) =>
  Math.floor(
    Math.pow(level, 1.05) * 20 + 3 * ((Math.pow(level, 2) * 2000) / maxLevel)
  );

const addXP = async (guildId, member, xpToAdd, message, msg) => {
  const spamChannel = message.guild.channels.cache.get("669882952582168607");
  const userId = member.id;

  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  if (result) {
    let { xp, level, totalXp } = result;
    var xpNeeded,
      xpToAddGlobal = 0;
    if (msg !== undefined) var numMsg = msg;

    if (xpToAdd !== 0) xpToAddGlobal = xpToAdd;
    // add xp
    if (msg !== undefined) {
      const prevLevel = level;
      do {
        xpNeeded = xpNeededFunc(level);
        xpToAddGlobal = xpPerMsgFunc(level);
        xp += xpToAddGlobal;
        totalXp += xpToAddGlobal;
        xpToAddGlobal = 0;
        numMsg--;
        if (xp >= xpNeeded && level <= maxLevel) {
          ++level;
          xp -= xpNeeded;
        }
      } while (numMsg > 0);
      if (prevLevel !== level)
        await spamChannel.send(
          `**${member.displayName}** ha subido del nivel ${prevLevel} al nivel **${level}**!`
        );
    } else {
      do {
        xpNeeded = xpNeededFunc(level);
        if (xpToAddGlobal === 0) xpToAddGlobal = xpPerMsgFunc(level);
        xp += xpToAddGlobal;
        totalXp += xpToAddGlobal;
        xpToAddGlobal = 0;
        if (xp >= xpNeeded && level <= maxLevel) {
          ++level;
          xp -= xpNeeded;
          if (level % 10 == 0)
            spamChannel.send(
              `**${member.displayName}** ha llegado a nivel **${level}**!`
            );
        }
      } while (xp >= xpNeeded);
    }
    await profileSchema.findOneAndUpdate(
      {
        guildId,
        userId,
      },
      { level, xp, totalXp }
    );
  } else {
    await spamChannel.send(
      `**${member.displayName}** ha subido a nivel **1**!`
    );
    await profileSchema.findOneAndUpdate(
      {
        guildId,
        userId,
      },
      {
        name: member.displayName,
        guildId,
        userId,
        xp: 0,
        totalXp: 0,
      },
      { upsert: true, new: true }
    );
  }
};

module.exports = {
  addXpCall: (member, xpToAdd, message, msg) => {
    addXP(message.guild.id, member, xpToAdd, message, msg);
  },

  onMessage: (client, message) => {
    const { guild, member } = message;
    if (!message.content.startsWith("/xpadd") && !message.author.bot)
      addXP(guild.id, member, 0, message);
  },
};
