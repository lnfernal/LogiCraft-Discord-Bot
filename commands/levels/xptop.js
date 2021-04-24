const mongo = require("../../utils/mongo.js");
const profileSchema = require("../../schemas/profile-schema.js");
const Discord = require("discord.js");

const getUserData = async (guildId, member) => {
  const userId = member.id;
  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  if (result) {
    const { name, totalXp, level } = result;
    let user = {
      name,
      totalXp,
      level,
    };
    return user;
  } else if (!member.user.bot) {
    let user = {
      name: member.displayName.replace("_", "-"),
      totalXp: 0,
      level: 0,
    };
    return user;
  }
};

var getNames = (users) => {
  var names = ``;

  for (i = 0; i < users.length; i++) names += `${i + 1}. ${users[i].name}\n`;
  return names;
};

var getXP = (users) => {
  var xp = ``;

  for (i = 0; i < users.length; i++)
    xp += `${new Intl.NumberFormat().format(users[i].totalXp)}\n`;
  return xp;
};

var getLevel = (users) => {
  var level = ``;

  for (i = 0; i < users.length; i++)
    level += `${new Intl.NumberFormat().format(users[i].level)}\n`;
  return level;
};

module.exports = {
  commands: "xptop",
  maxArgs: 0,
  callback: async (message, arguments, text, client) => {
    const guild = message.guild;
    const guildId = guild.id;
    let usersBad = [];
    await guild.members.fetch().then(async (members) => {
      const promises = [];
      members.forEach((member) => {
        promises.push(getUserData(guildId, member));
      });
      usersBad = await Promise.all(promises);
    });
    let users = usersBad.filter((user) => user !== undefined);
    users.sort(function (a, b) {
      return b.totalXp - a.totalXp;
    });
    const embed = new Discord.MessageEmbed()
      .setColor("#DF5FFF")
      .setTitle(`Ranking de ${guild.name}`)
      .addFields(
        { name: "Nombre", value: getNames(users), inline: true },
        { name: "XP", value: getXP(users), inline: true },
        { name: "Nivel", value: getLevel(users), inline: true }
      )
      .setTimestamp()
      .setFooter(`Ranking de ${guild.name} por XP`)
      .setThumbnail(guild.iconURL());
    message.channel.send(embed);
  },
};
