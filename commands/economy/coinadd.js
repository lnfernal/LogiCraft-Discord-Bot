const profileSchema = require("../../schemas/profile-schema.js");
const economy = require("../../handlers/economy.js");

module.exports = {
  commands: "coinadd",
  maxArgs: 2,
  minArgs: 2,
  expectedArgs: "<user> <amount>",
  permissions: "ADMINISTRATOR",
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;
    const guildId = message.guild.id;
    const userId = target.id;
    const coins = arguments[1];

    if (!target) {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
    if (isNaN(coins)) {
      message.channel.send(
        `**${message.member.displayName}**, introduce un número válido de monedas`
      );
    }
    const newCoins = await economy.addCoins(guildId, userId, coins);
    message.channel.send(
      `**${message.member.displayName}**, has dado a <@${userId}> **${coins} monedas**`
    );
  },
};
