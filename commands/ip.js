const Discord = require("discord.js");

module.exports = {
  commands: ["ip", "server"],
  callback: (message, arguments, text, client) => {
    const { guild } = message;
    const version = 1.17;
    const modpack = "";
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `Versión: **${version}**\n${
            modpack ? `Requerido: [**modpack**](${modpack})\n` : ""
          }IP: \`000.000.00.00\``
        )
        .setAuthor(guild.name + " MC Server IP", guild.iconURL())
    );
  },
};
