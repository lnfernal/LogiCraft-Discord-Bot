const mongo = require("../../utils/mongo.js");
const Discord = require("discord.js");
const profileSchema = require("../../schemas/profile-schema.js");
const progressBarPrecision = 25;

function xpEmbed(message, xp, totalXp, level, needed) {
  const progressMade = () => {
    var i = 0;
    var progressBar = `**[`;
    for (i; i < progressBarPrecision; i++) {
      if (i / progressBarPrecision < xp / needed) {
        progressBar += "■";
      } else {
        break;
      }
    }
    for (i; i < progressBarPrecision; i++) {
      progressBar += "–";
    }
    progressBar += "]**";
    return progressBar;
  };
  const embed = new Discord.MessageEmbed()
    .setColor("#30fc03")
    .setTitle(`__XP de ${message.member.displayName}__`)
    .setDescription(
      `Nivel: **${level}**\nTotal XP: **${new Intl.NumberFormat().format(
        totalXp
      )}**XP\n\nProgreso para nivel ${
        level + 1
      }:\n**${new Intl.NumberFormat().format(
        xp
      )} / ${new Intl.NumberFormat().format(needed)}XP**\n${progressMade()} **${
        Math.round((xp / needed) * 1000) / 10
      }%**`
    )
    .setThumbnail(message.author.avatarURL());
  message.channel.send(embed);
}

module.exports = {
  commands: "xp",
  expectedArgs: "",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;
    const guildId = message.guild.id;
    const userId = target.id;

    const result = await profileSchema.findOne({
      guildId,
      userId,
    });
    if (result) {
      const { xp, totalXp, level } = result;
      xpEmbed(
        message,
        xp,
        totalXp,
        level,
        Math.floor(Math.pow(level, 2.5) * 10)
      );
    }
  },
};
