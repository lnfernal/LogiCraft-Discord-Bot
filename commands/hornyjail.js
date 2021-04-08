const Discord = require("discord.js");
const avatarManager = require("../avatar-manager/avatar-manager.js");
const roleId = "784023842976563231";

const hjMsg = [
  "BONK",
  "Happy Cheems noises :)",
  "Go to Horny Jail!",
  "No Horny",
  "Horny bad",
  "Licencia de Horny",
];

module.exports = {
  commands: ["hornyjail", "bonk"],
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  callback: (message, arguments, text, client) => {
    const user = message.mentions.users.first();
    const emojis = client.guilds.cache.get("666295714724446209").emojis.cache
    const hj = emojis.find((emoji) => emoji.name === "GOTOHORNYJAIL")
    const role = message.guild.roles.cache.get(roleId);
    if (user) {
      const member = message.guild.members.cache.get(user.id);
      if (member.roles.cache.get(role.id)) {
        member.roles.remove(role);
      } else {
        member.roles.add(role);
        const embed = new Discord.MessageEmbed()
          .setColor("#ff0000")
          .setTitle(
            `${member.displayName} ha sido encerrado en la Horny Jail  ${hj}`
          )
          .setDescription(hjMsg[Math.floor(Math.random() * hjMsg.length)]);
        message.channel.send(embed);
        avatarManager.angry(client);
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
