const Discord = require("discord.js");
const protectedRolesFunc = require("../../misc/protected-roles.js");
const protectedRoles = ["666297045207875585", "666297857929642014"];

module.exports = {
  commands: "ban",
  expectedArgs: "<user> [reason]",
  minArgs: 1,
  maxArgs: 19,
  permissions: ["BAN_MEMBERS"],
  callback: async (message, arguments, text, client) => {
    const user = message.mentions.users.first();
    const member = message.guild.members.cache.get(user.id);
    var reason = "_No especificado_";
    if (user) {
      if (
        !protectedRolesFunc(message, member, protectedRoles) ||
        user.id === "824989001999712337"
      )
        return;
      if (arguments[1]) {
        arguments.shift();
        reason = arguments.join(" ");
      }
      try {
        await member.ban().then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`${member.displayName} ha sido baneado`)
            .setDescription(`Motivo: ${reason}\nId: ${member.id}`);
          message.channel.send(embed);
        });
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
