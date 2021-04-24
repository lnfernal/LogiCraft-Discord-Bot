const levels = require("../../handlers/levels.js");

module.exports = {
  commands: "xpadd",
  maxArgs: 3,
  minArgs: 2,
  expectedArgs: "<user> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(target.id);
    const guildId = message.guild.id;
    const userId = target.id;
    const xpToAdd = arguments[1];

    if (!target) {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
      return;
    }
    if (isNaN(xpToAdd) && !arguments[2]) {
      message.channel.send(
        `**${message.member.displayName}**, introduce un número válido de XP`
      );
      return;
    }
    if (xpToAdd > 400000) {
      message.channel.send(
        `**${message.member.displayName}**, el máximo es de 400.000XP`
      );
      return;
    }
    levels.addXpCall(
      member,
      xpToAdd,
      message,
      (msg = arguments[2] ? arguments[2] : undefined)
    );
    const ann = arguments[2]
      ? `**${message.member.displayName}**, has dado a <@${userId}> la XP equivalente a **${msg} mensajes**`
      : `**${message.member.displayName}**, has dado a <@${userId}> **${xpToAdd}XP**`;
    message.channel.send(ann);
  },
};
