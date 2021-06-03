require("module-alias/register")
const clientUtils = require("@client")
const s = require("@string")

const getServerLanguage = () => {
  return "spanish"
}

const getLanguage = async member => {
  if (await member.roles.cache.find(r => r.name.toLowerCase().includes("español"))) return "spanish"
  else if (await member.roles.cache.find(r => r.name.toLowerCase().includes("english"))) return "english"
  else return getServerLanguage()
}

module.exports = async (key, member = null, params = {}) => {
  const client = clientUtils.getClient(),
    emojis = await require("@emojis").logibotEmojis(client),
    messages = {
      test: {
        spanish: "spanish :UUUU",
        english: "english :OOOO",
      },
      activityDefault: {
        spanish:
          "**${username}**, las acciones disponibles son: **viendo**, **escuchando**, **jugando** y **retransmitiendo**",
        english: "**${username}**, available actions are: **watching**, **listening**, **playing** y **streaming**",
      },
      activityDefault: {
        spanish:
          "**${username}**, las acciones disponibles son: **viendo**, **escuchando**, **jugando** y **retransmitiendo**",
        english: "**${username}**, available actions are: **watching**, **listening**, **playing** y **streaming**",
      },
      coupleDailySpent: {
        spanish: "**${username}**, ya se ha reclamado la pareja de hoy",
        english: "**${username}**, today's couple has already been claimed",
      },
      coupleInsuficientMembers: {
        spanish: "**${username}**, no hay suficientes miembros para elegir pareja",
        english: "**${username}**, there aren't enough members to choose a couple",
      },
      dataType: {
        spanish: "**${username}**, los tipos de objeto son **entity** y **server**",
        english: "**${username}**, object types are **entity** and **server**",
      },
      missingDataNameProperty: {
        spanish: "**${username}**, indica un nombre",
        english: "**${username}**, write a name",
      },
      dataActions: {
        spanish: "**${username}**, las acciones disponibles son **get** y **set**",
        english: "**${username}**, available actions are **get** and **set**",
      },
      adminNeeded: {
        spanish: "**${username}**, necesitas ser un Administrador",
        english: "**${username}**, you need to be an Administrator",
      },
      nestedCommand: {
        spanish: "Buen intento",
        english: "Nice try",
      },
      horny: {
        spanish: "${hjEmoji} **${username}** ha sido encerrado en la Horny Jail ${hjEmoji}",
        english: "${hjEmoji} **${username}** has been jailed in the Horny Jail ${hjEmoji}",
      },
      hornier: {
        spanish: "${hjEmoji}${hjEmoji} **${username}** ha sido encerrado en la HORNIER JAIL ${hjEmoji}${hjEmoji}",
        english: "${hjEmoji}${hjEmoji} **${username}** has been jailed in the HORNIER JAIL ${hjEmoji}${hjEmoji}",
      },
      missingUser: {
        spanish: "**${username}**, no se ha encontrado al usuario",
        english: "**${username}**, couldn't find user",
      },
      missingRole: {
        spanish: "**${username}**, no se ha encontrado el rol",
        english: "**${username}**, couldn't find role",
      },
      ipDescription: {
        spanish: "**Versión**: ${version}\n**Modpack**: [iLogiCraft Modpack](${requirements})\n**IP**: ${ip}",
        english: "**Version**: ${version}\n**Modpack**: [iLogiCraft Modpack](${requirements})\n**IP**: ${ip}",
      },
      balance: {
        spanish: "**${username}**, tienes ${logiCoin}${coins}",
        english: "**${username}**, you have ${logiCoin}${coins}",
      },
      coinsAdded: {
        spanish: "**${username}**, has dado a ${targetUsername} **${coins}** ${logiCoin}",
        english: "**${username}**, you've given **${coins}** ${logiCoin} to ${targetUsername}",
      },
      coinsWrong: {
        spanish: "**${username}**, introduce un número válido de monedas",
        english: "**${username}**, enter a valid coins amount",
      },
      xp: {
        spanish: "**Nivel**: ${level}\n**XP**: ${totalXp}\n**Progreso para nivel ${level + 1}**: ${xp} / ${needed} XP",
        english: "**Level**: ${level}\n**XP**: ${totalXp}\n**Progress to level ${level + 1}**: ${xp} / ${needed} XP",
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
        spanish: "**${username}**, el máximo que puedes añadir son ${maxXpAdd}",
        english: "**${username}**, the maximum amount you can add is ${maxXpAdd}",
      },
      xpGiven: {
        spanish: "**${username}**, has dado a ${targetUsername} **${xpAdd} XP**",
        english: "**${username}**, you have given ${targetUsername} **${xpAdd} XP**",
      },
      xpGivenMsg: {
        spanish: "**${username}**, has dado a ${targetUsername} la XP equivalente a **${msg}** mensajes",
        english: "**${username}**, you've given ${targetUsername} the equivalent XP to **${msg}** messages",
      },
      xpGivenLvl: {
        spanish: "**${username}**, has dado a ${targetUsername} **${lvls}** niveles",
        english: "**${username}**, you've given ${targetUsername} **${lvls}** levels",
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
        spanish: "**${username}** ha subido del nivel ${prevLevel} al nivel **${level}**!",
        english: "**${username}** leveled up from level ${prevLevel} to level **${level}**!",
      },
      levelUp: {
        spanish: "**${username}** ha llegado al nivel **${level}**!",
        english: "**${username}** arrived to level **${level}**!",
      },
      level666: {
        spanish: "**${username}** ha llegado al nivel **${level}** 😈!",
        english: "**${username}** arrived to level **${level}** 😈!",
      },
      level69: {
        spanish: "**${username}** ha llegado al nivel **${level}** 😎!",
        english: "**${username}** arrived to level **${level}** 😎!",
      },
      level1: {
        spanish: "**${username}** ha llegado al nivel **1**!",
        english: "**${username}** arrived to level **1**!",
      },
      level777: {
        spanish: "**${username}** ha llegado al nivel **${level}** 🎰!",
        english: "**${username}** arrived to level **${level}** 🎰!",
      },
      level1000Title: {
        spanish: "**${username}** ha llegado al nivel **${level}**!",
        english: "**${username}** arrived to level **${level}**!",
      },
      dmCommand: {
        spanish: "No puedes usar este comando aquí",
        english: "You can't use this command here",
      },
      immuneUser: {
        spanish: "**${username}**, el usuario ${targetUsername} está protegido de este comando",
        english: "**${username}**, user ${targetUsername} is protected from this command",
      },
      immuneRole: {
        spanish: "**${username}**, el rol ${roleName} está protegido de este comando",
        english: "**${username}**, the ${roleName} role is protected from this command",
      },
      alreadyBanned: {
        spanish: "**${username}**, este usuario ya está baneado",
        english: "**${username}**, this user is already banned",
      },
      alreadyMuted: {
        spanish: "**${username}**, este usuario ya está muteado",
        english: "**${username}**, this user is already muted",
      },
      missingBan: {
        spanish:
          '**${username}**, este usuario no está baneado. Puedes consultar los usuarios baneados en _"Configuración del servidor > Bans"_',
        english:
          '**${username}**, this user is not banned. You can check banned users at _"Server Configuration > Bans"_',
      },
      helpStartDesc: {
        spanish:
          '**${username}**, este usuario no está baneado. Puedes consultar los usuarios baneados en _"Configuración del servidor > Bans"_',
        english:
          '**${username}**, this user is not banned. You can check banned users at _"Server Configuration > Bans"_',
      },
      requiredRole: {
        spanish: "**${username}**, necesitas el rol ${rolename} para usar este comando",
        english: "**${username}**, you need the ${rolename} role to execute this command",
      },
      statsGiven: {
        spanish: "**${username}**, has dado a ${targetUsername} **${amount}** de ${key}",
        english: "**${username}**, you've given ${targetUsername} **${amount}** of ${key}",
      },
    },
    userLanguage = member ? await getLanguage(member) : getServerLanguage()

  message = s.getNestedProperty(messages, [`${key}`, `${userLanguage}`])
  return message ? s.interpolate(message, params) : `_null_ ${emojis.fix}`
}
