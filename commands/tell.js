const ss = require("string-similarity");

module.exports = {
  commands: "tell",
  expectedArgs: "<channel> <content>",
  permissionError: "No tienes permisos para controlarme",
  minArgs: 2,
  maxArgs: 499,
  cooldown: 2,
  requiredRoles: ["666297857929642014"],
  callback: async (message, arguments, text, client) => {
    const guildId = "666295714724446209",
      desiredChannelName = arguments[0],
      math = require("../utils/math.js");
    const guild = client.guilds.cache.get(guildId);
    let channelNames = [], channelIds = [], desiredChannelId;

    await client.channels.cache.each((channel) => {
      if (channel.type == "text") {
        channelNames.push(channel.name);
        channelIds.push({
          name: channel.name,
          id: channel.id);
        }
      }
    });
    const similarChannel = ss.findBestMatch(desiredChannelName, channelNames)
      .bestMatch.target;
    channelIds.forEach(c => {
      if(c.name === similarChannel){
       desiredChannelId = c.id
        return
      }
    })
    const desiredChannel = guild.channels.cache.get(desiredChannelId)
    if (
      ss.compareTwoStrings(desiredChannelName, similarChannel) < 0.1 ||
      desiredChannel.type != "text"
    )
      return;
    arguments.shift();
    msg = arguments.join(" ");
    desiredChannel.startTyping();
    setTimeout(() => {
      desiredChannel.stopTyping();
      desiredChannel.send(msg);
    }, (msg.length / 200) * 60000 * math.clamp(Math.random() * 1 + 0.2, 0.2, 0.5));
  },
};
