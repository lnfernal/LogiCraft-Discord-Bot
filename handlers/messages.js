require("module-alias/register")
const clientUtils = require("@client")

const getServerLanguage = () => {
  return "spanish"
}

const getLanguage = async (roles, member) => {
  if (member.roles.cache.has(roles.spanish.id)) return "spanish"
  else if (member.roles.cache.has(roles.english.id)) return "english"
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
        english: "english :UOKJO",
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
        spanish:
          "**${username}**, debes mencionar al usuario o escribir su nombre",
        english:
          "**${username}**, you have to mention de user or write their name",
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
          "**Nivel**: ${level}\n**XP**: ${totalXp}\n\n**Progreso para nivel ${level + 1}**:\n${xp} / ${needed}\n${progressMade} ${Math.round((xp / needed) * 1000) / 10}%",
        english:
          "**Level**: ${level}\n**XP**: ${totalXp}\n\n**Progress to level ${level + 1}**:\n${xp} / ${needed}\n${progressMade} ${Math.round((xp / needed) * 1000) / 10}%",
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
    },
    roles = {
      spanish: await guild.roles.cache.find(r =>
        r.name.toLowerCase().includes("español")
      ),
      english: await guild.roles.cache.find(r =>
        r.name.toLowerCase().includes("english")
      ),
    },
    userLanguage =
      roles.spanish && roles.english
        ? await getLanguage(roles, member)
        : getServerLanguage(),
    message = getProp(messages, [`${key}`, `${userLanguage}`])
  return message ? message : "*"
}
