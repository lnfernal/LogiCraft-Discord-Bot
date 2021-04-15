const Discord = require("discord.js");
const profileSchema = require("../schemas/profile-schema.js");
const mongo = require("../utils/mongo.js");

const getUserData = async (guildId, member) => {
  const userId = member.id;
  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  if (result) {
    const { name, lover } = result;
    let user = {
      name,
      lover,
    };
    return user;
  } else if (!member.user.bot) {
    let user = {
      name: member.displayName.replace("_", "-"),
      lover: 0,
    };
    return user;
  }
};

var getNames = (users) => {
  var names = ``;

  for (i = 0; i < users.length; i++) names += `${i + 1}. ${users[i].name}\n`;
  return names;
};

var getCouples = (users) => {
  var couples = ``;

  for (i = 0; i < users.length; i++) couples += `${users[i].lover}\n`;
  return couples;
};

module.exports = {
  commands: "coupletop",
  maxArgs: 0,
  callback: async (message, arguments, text, client) => {
    const { guild } = message;
    const promises = [];
    guildId = guild.id

    await guild.members.fetch().then(async (members) => {
      const promises = [];
      members.forEach((member) => {
        promises.push(getUserData(guildId, member));
      });
      usersBad = await Promise.all(promises);
    });
    let users = usersBad.filter((user) => user !== undefined);
    users.sort(function (a, b) {
      return b.lover - a.lover;
    });
    const embed = new Discord.MessageEmbed()
      .setColor("#ff66ff")
      .setTitle(`🥰 Ranking de parejas 💕`)
      .addFields(
        { name: "Nombre", value: getNames(users), inline: true },
        { name: "Parejas", value: getCouples(users), inline: true }
      )
      .setTimestamp()
      .setFooter(`Ranking de parejas de ${guild.name}`)
      .setThumbnail(guild.iconURL());
    message.channel.send(embed);
  },
};
