const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const mongo = require("./utils/mongo.js");
const config = require("./config.json");
const levels = require("./levels.js");
const antiAd = require("./misc/anti-ad.js");
const responses = require("./misc/responses.js");
const troll = require("./misc/troll.js");
const avatarManager = require("./avatar-manager/avatar-manager.js");
const voteReactions = require("./misc/vote-reactions.js");
const guildId = "666295714724446209";
require("dotenv").config();

client.login(process.env.BOT_TOKEN);

client.on("ready", async () => {
  // declaring variables
  const baseFile = "command-base.js";
  const commandBase = require(`./commands/${baseFile}`);
  const reactions = {
    upvote: client.emojis.cache.find(
      (emoji) => emoji.id === 826436803355344966
    ),
    downvote: client.emojis.cache.find(
      (emoji) => emoji.id === 826436828554461195
    ),
    kekwPurple: client.emojis.cache.find(
      (emoji) => emoji.id === 826525360799219742
    ),
  };
  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        commandBase(client, option);
      }
    }
  };

  // init
  await mongo().then(console.log("Conectado a MongoDB!"));
  client.setMaxListeners(20);
  avatarManager.init(client);
  readCommands("commands");

  // listen for messages
  client.on("message", (message) => {
    if (message.author.bot) return;
    avatarManager.onMessage(client, message);
    antiAd.onMessage(client, message);
    voteReactions.onMessage(client, message, reactions);
    responses.onMessage(client, message);
    levels.onMessage(client, message);
    //troll.onMessage(client)
  });

  client.user.setPresence({
    activity: {
      name: "/bonk",
      type: 3,
    },
    status: "online",
  });
  console.log("Bot Ready!");
});
