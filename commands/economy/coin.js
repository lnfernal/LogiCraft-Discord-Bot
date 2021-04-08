const economy = require("../../economy.js");

module.exports = {
  commands: "coin",
  maxArgs: 1,
  expectedArgs: "<user>",
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;

    const guildId = message.guild.id;
    const userId = target.id;
    const coins = await economy.getCoins(guildId, userId);

    message.channel.send(
      `**${message.member.displayName}**, tienes **${coins} monedas**`
    );
  },
};
