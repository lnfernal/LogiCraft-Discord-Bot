const Discord = require("discord.js");
const profileSchema = require("../../schemas/profile-schema.js");
const manageInventory = require("../../utils/manage-inventory.js");

module.exports = {
  commands: "mine",
  callback: async (message, arguments, text, client) => {
    return;
    const {
      member,
      guild,
      channel,
      guildId = guild.id,
      userId = member.id,
    } = message;
    const items = require("../../utils/items.js")(client);
    const logiEmojis = require("../../utils/emojis.js").logibotEmojis(client);

    const profile = await profileSchema.findOne({ guildId, userId });
    if (!profile)
      await new profileSchema({
        guildId,
        userId,
        name: member.user.username,
      }).save();
    manageInventory.addToSet({ guildId, userId }, 5, items.ironCluster);
    manageInventory.inc(
      { guildId, userId },
      5,
      Math.floor(Math.random() * 10 + 1)
    );

    const embed = new Discord.MessageEmbed()
      .setTitle(`**${member.user.username}** se ha ido de minería...`)
      .setDescription(`... y ha encontrado`);
    channel.send(embed);
  },
};
