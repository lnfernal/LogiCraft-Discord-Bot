require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const Discord = require("discord.js")

const maxLevel = 2000

const xpNeededFunc = level => Math.floor(Math.pow(level, 2.5) * 10) + 1
const xpPerMsgFunc = level => Math.floor(Math.pow(level, 1.05) * 20 + 3 * ((Math.pow(level, 2) * 2000) / maxLevel)) + 2

const addXP = async (message, target, xpAdd, method = "single") => {
  const { guild, member } = message,
    spamChannel = await message.guild.channels.cache.find(c => c.name.toLowerCase().includes("spam")),
    result = await userUtils.getUserProfile(guild, target)
  let { xp, level, totalXp } = result,
    xpNeeded

  // add xp
  if (method == "msg") {
    const prevLevel = level
    let numMsg = xpAdd

    do {
      let xpPerMsg = xpPerMsgFunc(level)

      xpNeeded = xpNeededFunc(level)
      xp += xpPerMsg
      totalXp += xpPerMsg
      numMsg--
      if (xp >= xpNeeded && level <= maxLevel) {
        ++level
        xp -= xpNeeded
      }
    } while (numMsg > 0)
    if (prevLevel !== level)
      await spamChannel.send(
        await messageHandler("levelUpCommand", member, {
          username: target.username,
          prevLevel,
          level,
        })
      )
  } else if (method == "raw") {
    const prevLevel = level

    xp += xpAdd
    totalXp += xpAdd
    do {
      xpNeeded = xpNeededFunc(level)
      if (xp >= xpNeeded && level <= maxLevel) {
        ++level
        xp -= xpNeeded
      }
    } while (xp >= xpNeeded)
    if (prevLevel !== level)
      await spamChannel.send(
        await messageHandler("levelUpCommand", member, {
          username: target.username,
          prevLevel,
          level,
        })
      )
  } else if (method == "level") {
    const prevLevel = level
    let numLvl = xpAdd

    do {
      xpNeeded = xpNeededFunc(level)
      xp += xpNeeded
      totalXp += xpNeeded
      numLvl--
      if (xp >= xpNeeded && level <= maxLevel) {
        ++level
        xp -= xpNeeded
      }
    } while (numLvl > 0)
    if (prevLevel !== level)
      await spamChannel.send(
        await messageHandler("levelUpCommand", member, {
          username: target.username,
          prevLevel,
          level,
        })
      )
  } else if (method == "single") {
    xpAdd = xpPerMsgFunc(level)
    xp += xpAdd
    totalXp += xpAdd
    do {
      xpNeeded = xpNeededFunc(level)
      if (xp >= xpNeeded && level <= maxLevel) {
        ++level
        xp -= xpNeeded
        if (level === 1000)
          spamChannel.send(
            new Discord.MessageEmbed()
              .setTitle(
                await messageHandler("level1000Title", member, {
                  username: target.username,
                  level,
                })
              )
              .setTimestamp()
              .setImage(target.avatarURL())
              .setColor("#ff5d8f")
          )
        else if (level % 10 === 0)
          spamChannel.send(
            await messageHandler("levelUp", member, {
              username: target.username,
              level,
            })
          )
        else if (level === 666)
          spamChannel.send(
            await messageHandler("level666", member, {
              username: target.username,
              level,
            })
          )
        else if (level === 69)
          spamChannel.send(
            await messageHandler("level69", member, {
              username: target.username,
              level,
            })
          )
        else if (level === 777)
          spamChannel.send(
            await messageHandler("level777", member, {
              username: target.username,
              level,
            })
          )
        else if (level === 1)
          spamChannel.send(
            await messageHandler("level1", member, {
              username: target.username,
              level,
            })
          )
      }
    } while (xp >= xpNeeded)
  } else {
    message.channel.send("Opción errónea")
    return
  }
  await userUtils.setUserSchema(guild, target, "xp", xp)
  await userUtils.setUserSchema(guild, target, "totalXp", totalXp)
  await userUtils.setUserSchema(guild, target, "level", level)
}

module.exports = {
  addXpCall: (message, target, xpAdd, method) => {
    addXP(message, target, xpAdd, method)
  },

  onMessage: (client, message) => {
    if (!message.content.startsWith("/xpadd") && !message.content.startsWith("/xp") && !message.author.bot)
      addXP(message, message.author, null)
  },
}
