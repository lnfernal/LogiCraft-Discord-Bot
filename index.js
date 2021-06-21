require("module-alias/register")
const path = require("path")
const fs = require("fs")
const Discord = require("discord.js")
const client = new Discord.Client({ ws: new Discord.Intents(Discord.Intents.ALL) })
const { Player } = require("discord-music-player")
const player = new Player(client, { leaveOnEmpty: false, quality: "high" })
const mongo = require("./utils/mongo.js")
const rpc = require("@rpc")
const config = require("./config.json")
const levels = require("./handlers/levels.js")
const antiAd = require("./misc/anti-ad.js")
const responses = require("./misc/responses.js")
const randomActivity = require("./misc/random-activity.js")
const trollCommand = require("./commands/troll.js")
const mute = require("./handlers/mute.js")
const stats = require("./misc/stats.js")
const userActivity = require("./misc/user-activity.js")
const avatarManager = require("./misc/avatar-manager.js")
const snapshotVote = require("./misc/snapshot-react.js")
const clientUtils = require("@client")
const userUtils = require("@user")
const presence = require("./misc/presence.js")
const weeklyUser = require("./misc/weekly-user.js")
const chatMode = require("@chatMode")
const guildId = "829448956417015828"

var commandCount = 0

require("dotenv").config()

client.player = player
client.login(process.env.BOT_TOKEN)

client.on("ready", async () => {
  // declaring variables
  const baseFile = "command-base.js"
  const guild = await client.guilds.cache.get(guildId)
  var dirName = ""
  const commandBase = require(`./commands/${baseFile}`)
  const readCommands = async dir => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        if (dir != "commands") dirName = dir.split("/").pop()
        else dirName = null
        const option = require(path.join(__dirname, dir, file))
        commandCount++
        commandBase(client, option, dirName)
      }
    }
  }

  // init
  await mongo().then(console.log("Conectado a MongoDB!"))
  client.setMaxListeners(60)
  clientUtils.setClient(client)
  await userUtils.checkSchemaOnStart(client, guildId)
  //rpc.init()
  avatarManager.init(client)
  userActivity.init(guild)
  /*await presence.init(guild)
  await weeklyUser.init(guild)
  randomActivity.setActivity(client)
  await mute.scheduledCheck(client)*/
  await readCommands("commands").then(console.log(`¡${commandCount} comandos registrados!`))

  // listen for messages
  client.on("message", async message => {
    if (message.channel.type == "dm") return
    if (message.guild.id == "302094807046684672") return await snapshotVote.onMessage(client, message)
    if (message.author.bot || message.guild.id != guildId) return
    /* avatarManager.onMessage(client, message)
    chatMode.onMessage(client, message)
    trollCommand.onMessage(client, message)
    responses.onMessage(client, message)
    levels.onMessage(client, message)
    presence.addPoints(message)
    weeklyUser.inc(message)
    stats.inc(message)*/
    //antiAd.onMessage(client, message)
  })

  // user joins
  client.on("guildMemberAdd", async member => {
    if (member.guild.id != guildId) return
    userActivity.onJoin(member, client)
    await userUtils.checkSchemaOnJoin(member.guild, member.user)
    await mute.checkMute(client, member)
  })

  // user leaves
  client.on("guildMemberRemove", member => {
    if (member.guild.id != guildId) return
    userActivity.onRemove(member, client)
  })

  // reaction add
  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.guild.id != guildId || reaction.me) return
    presence.addPoints(null, reaction, user)
    await userUtils.incUserSchema(guild, user, "reactions", 1)
  })

  // reaction remove
  client.on("messageReactionRemove", (reaction, user) => {
    if (reaction.message.guild.id != guildId || reaction.me) return
  })
  console.log("¡LogiCraft Engine listo!")
})
