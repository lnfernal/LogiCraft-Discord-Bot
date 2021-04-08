const Discord = require("discord.js");
const protectedRolesFunc = require("../../misc/protected-roles.js");
const protectedRoles = ["666297045207875585", "666297857929642014"];

module.exports = {
  commands: "ban",
  expectedArgs: "<user> [days] [reason]",
  minArgs: 1,
  maxArgs: 19,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, arguments, text, client) => {
    const user = message.mentions.users.first();
    const member = message.guild.members.cache.get(user.id);
    var reason = "_No especificado_";
    var days = 0;
    if (user && arguments[0].includes("<@!")) {
      if (!protectedRolesFunc(message, member, protectedRoles)) return;
      if (arguments[1]) {
        arguments.shift();
        if (!isNaN(arguments[0])) {
          if (
            arguments[0] > 0 &&
            arguments[0] <= 7 &&
            Number.isInteger(arguments[0])
          ) {
            days = arguments[0];
            arguments.shift();
            if (arguments[0]) {
              reason = arguments.join(" ");
            }
          } else {
            message.channel.send(
              `${message.member.displayName}, indica el numero de dias entre 0 y 7`
            );
          }
        } else {
          reason = arguments.join(" ");
        }
      }
      try {
        await member.ban({ days: days, reason: reason }).then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`${member.displayName} ha sido baneado`)
            .setDescription(
              `Días: ${
                days == 0 ? "_Indefinido_" : days
              }\nMotivo: ${reason}\nId: ${member.id}`
            );
        });
        message.channel.send(embed);
      } catch (e) {
        message.channel.send("Este usuario ya está baneado");
      }
    } else {
      const errorMsg = [
        `${message.member.displayName}, tienes que mencionar al usuario :P`,
        `${message.member.displayName}, eso no parece una mención...`,
        `${message.member.displayName}, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
  },
};
