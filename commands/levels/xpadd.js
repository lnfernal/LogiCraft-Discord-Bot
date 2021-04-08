const levels = require("../../levels.js")

module.exports = {
  commands: "xpadd",
  maxArgs: 2,
  minArgs: 2,
  expectedArgs: "<user> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;
    const guildId = message.guild.id;
    const userId = target.id;
    const xpToAdd = arguments[1];

    if (!target) {
      const errorMsg = [
        `${message.member.displayName}, tienes que mencionar al usuario :P`,
        `${message.member.displayName}, eso no parece una mención...`,
        `${message.member.displayName}, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
    if (isNaN(xpToAdd)) {
      message.channel.send(
        `${message.member.displayName}, introduce un número válido de XP`
      );
    }
    levels.addXpCall(member, xpToAdd, message)
    message.channel.send(
      `**${message.member.displayName}**, has dado a <@${userId}> **${xpToAdd}XP**`
    );
  },
};
