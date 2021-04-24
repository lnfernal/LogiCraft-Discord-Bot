const Discord = require("discord.js");
const protectedRolesFunc = require("../../misc/protected-roles.js");
const protectedRoles = ["666297045207875585", "666297857929642014"];

module.exports = {
  commands: ["kick", "kill"],
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["KICK_MEMBERS"],
  requiredRoles: [],
  callback: (message, arguments, text, client) => {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.cache.get(user.id);
      if (
        !protectedRolesFunc(message, member, protectedRoles) ||
        user.id === "824989001999712337"
      )
        return;
      const embed = new Discord.MessageEmbed()
        .setColor("#ffff00")
        .setTitle(
          `${member.displayName} was slained by ${message.member.displayName}`
        );
      message.channel.send(embed);
      member.kick();
    } else {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
  },
};
