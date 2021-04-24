const economy = require("../../handlers/economy.js");
const Discord = require("discord.js");

module.exports = {
  commands: "balance",
  maxArgs: 1,
  expectedArgs: "<user>",
  callback: async (message, arguments, text, client) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;
    const logiEmojis = await require("../../utils/emojis").logibotEmojis(
      client
    );

    const guildId = message.guild.id;
    const userId = target.id;
    const coins = await economy.getCoins(guildId, userId);

    message.channel.send(
      new Discord.MessageEmbed().setDescription(
        `**${message.member.displayName}**, tienes **${coins}** ${logiEmojis.logiCoin}`
      )
    );
  },
};
