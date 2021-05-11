require("module-alias/register")
const clientUtils = require("@client")

const getServerLanguage = () => {
  return "spanish"
}

const getLanguage = async member => {
  if (await member.roles.cache.find(r => r.name.toLowerCase().includes("español")))
    return "spanish"
  else if (await member.roles.cache.find(r => r.name.toLowerCase().includes("english")))
    return "english"
  else return getServerLanguage()
}

const getProp = (object, path) => {
  if (path.length === 1) return object[path[0]]
  else if (path.length === 0) throw error
  else {
    if (object[path[0]]) return getProp(object[path[0]], path.slice(1))
    else {
      object[path[0]] = {}
      return getProp(object[path[0]], path.slice(1))
    }
  }
}

module.exports = async (key, member) => {
  const { guild } = member,
    client = clientUtils.getClient(),
    emojis = await require("@emojis").logibotEmojis(client),
    messages = {
      test: {
        spanish: "spanish :UUUU",
        english: "english :OOOO",
      },
      activityDefault: {
        spanish:
          "**${username}**, las acciones disponibles son: **viendo**, **escuchando**, **jugando** y **retransmitiendo**",
        english:
          "**${username}**, available actions are: **watching**, **listening**, **playing** y **streaming**",
      },
      activityDefault: {
        spanish:
          "**${username}**, las acciones disponibles son: **viendo**, **escuchando**, **jugando** y **retransmitiendo**",
        english:
          "**${username}**, available actions are: **watching**, **listening**, **playing** y **streaming**",
      },
      coupleDailySpent: {
        spanish: "**${username}**, ya se ha reclamado la pareja de hoy",
        english: "**${username}**, today's couple has already been claimed",
      },
      coupleInsuficientMembers: {
        spanish:
          "**${username}**, no hay suficientes miembros para elegir pareja",
        english:
          "**${username}**, there aren't enough members to choose a couple",
      },
      dataType: {
        spanish:
          "**${username}**, los tipos de objeto son **entity** y **server**",
        english: "**${username}**, object types are **entity** and **server**",
      },
      missingDataNameProperty: {
        spanish: "**${username}**, indica un nombre",
        english: "**${username}**, write a name",
      },
      dataActions: {
        spanish:
          "**${username}**, las acciones disponibles son **get** y **set**",
        english: "**${username}**, available actions are **get** and **set**",
      },
      adminNeeded: {
        spanish: "**${username}**, necesitas ser un Administrador",
        english: "**${username}**, you need to be an Administrator",
      },
      hj: {
        spanish:
          "**${username}** ha sido encerrado en la Horny Jail ${hjEmoji}",
        english: "**${username}** has been jailed in the Horny Jail ${hjEmoji}",
      },
      missingUser: {
        spanish: "**${username}**, no se ha encontrado al usuario",
        english: "**${username}**, couldn't find user",
      },
      ipDescription: {
        spanish:
          "Versión: **${version}**\n[**Modpack**](${requirements})IP: `0`",
        english:
          "Version: **${version}**\n[**Modpack**](${requirements})IP: `0`",
      },
      balance: {
        spanish: "**${username}**, tienes **${coins}** ${logiCoin}",
        english: "**${username}**, you have **${coins}** ${logiCoin}",
      },
      coinsAdded: {
        spanish:
          "**${username}**, has dado a ${targetUsername} **${coins}** ${logiCoin}",
        english:
          "**${username}**, you've given **${coins}** ${logiCoin} to ${targetUsername}",
      },
      coinsWrong: {
        spanish: "**${username}**, introduce un número válido de monedas",
        english: "**${username}**, enter a valid coins amount",
      },
      xp: {
        spanish:
          "**Nivel**: ${level}\n**XP**: ${totalXp}\n\n**Progreso para nivel ${level + 1}**:\n${xp} / ${needed}\n${progressMade} ${Math.round((xpRaw / neededRaw) * 1000) / 10}%",
        english:
          "**Level**: ${level}\n**XP**: ${totalXp}\n\n**Progress to level ${level + 1}**:\n${xp} / ${needed}\n${progressMade} ${Math.round((xpRaw / neededRaw) * 1000) / 10}%",
      },
      xpTitle: {
        spanish: "XP de **${username}**",
        english: "XP of **${username}**",
      },
      xpWrong: {
        spanish: "**${username}**, introduce un número válido de XP",
        english: "**${username}**, enter a valid XP amount",
      },
      xpCap: {
        spanish: "**${username}**, el máximo que puedes añadir son ${maxXPAdd}",
        english:
          "**${username}**, the maximum amount you can add is ${maxXPAdd}",
      },
      xpGiven: {
        spanish:
          "**${username}**, has dado a ${targetUsername} **${xpToAdd}XP**",
        english:
          "**${username}**, you have given ${targetUsername} **${xpToAdd}XP**",
      },
      xpGivenMsg: {
        spanish:
          "**${username}**, has dado a ${targetUsername} la XP equivalente a **${msg}**",
        english:
          "**${username}**, you've given ${targetUsername} the equivalent XP to **${msg}**",
      },
      award: {
        spanish: "**${username}**, tienes que responder a un mensaje",
        english: "**${username}**, you need to reply to a message",
      },
      reactionWrong: {
        spanish: "**${username}**, no se ha encontrado esa reacción",
        english: "**${username}**, that reaction doesn't exist",
      },
      levelUpCommand: {
        spanish:
          "**${username}** ha subido del nivel ${prevLevel} al nivel **${level}**!",
        english:
          "**${username}** leveled up from level ${prevLevel} to level **${level}**!",
      },
      levelUp: {
        spanish: "**${username}** ha llegado al nivel **${level}**!",
        english: "**${username}** arrived to level **${level}**!",
      },
      level666: {
        spanish: "**${username}** ha llegado a nivel **${level}** 😈!",
        english: "**${username}** arrived to level **${level}** 😈!",
      },
      level69: {
        spanish: "**${username}** ha llegado a nivel **${level}** 😎!",
        english: "**${username}** arrived to level **${level}** 😎!",
      },
      level1: {
        spanish: "**${username}** ha llegado a nivel **1**!",
        english: "**${username}** arrived to level **1**!",
      },
    },
    userLanguage = await getLanguage(member)
  message = getProp(messages, [`${key}`, `${userLanguage}`])
  return message ? message : "*"
}
