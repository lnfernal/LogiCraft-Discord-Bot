const path = require("path")
const fs = require("fs")
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json")
const antiAd = require("./anti-ad.js")
const voteReactions = require("./vote_reactions.js")
require('dotenv').config()

client.login(process.env.BOT_TOKEN);

client.on("ready", async () => {
    const baseFile = "command-base.js"
    const commandBase = require(`./commands/${baseFile}`)
    const reactions = {
        upvote: client.emojis.cache.find(emoji => emoji.name === "upvote"),
        downvote: client.emojis.cache.find(emoji => emoji.name === "downvote"),
        kekwPurple: client.emojis.cache.find(emoji => emoji.name === "kekwPurple")
    }

    antiAd(client)
    voteReactions(client, reactions)

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }
    //readCommands("commands")

    client.user.setPresence({
        activity: {
            name: "Pigstep",
            type: 2
        },
        status: "online"
    })
    console.log("Bot Ready!")
})