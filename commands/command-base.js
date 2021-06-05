require("module-alias/register")
const userUtils = require("@user")
const { prefix } = require("../config.json")
const messageHandler = require("@messages")

const validatePermissions = permissions => {
  const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}

let recentlyRan = []

module.exports = (client, commandOptions, dirName) => {
  let {
    commands,
    expectedArgs = "",
    permissionError = "no tienes permiso para usar este comando",
    minArgs = 0,
    maxArgs = 0,
    cooldown = -1,
    permissions = [],
    requiredRoles = [],
    dm = false,
    callback,
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === "string") {
    commands = [commands]
  }

  console.log(`Registrando comando: "${prefix}${commands[0]}" ${dirName === null ? "" : `(/${dirName})`}`)

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions]
    }
    validatePermissions(permissions)
  }

  client.on("message", async message => {
    const { member, content, guild, author } = message

    if (
      message.guild.id != "666295714724446209" ||
      message.mentions.has(client.user.id) ||
      message.content.includes("824989001999712337")
    )
      return // protecc logibot
    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
        // a command has been ran

        // check if is dm
        if (message.channel.type == "dm") {
          if (!dm) {
            await message.author.send(await messageHandler("dmCommand"))
            return
          }
          // split on any number of spaces
          const args = content.split(/[ ]+/)

          // remove the command which is the first index
          args.shift()

          // ensure we have the correct number of args
          if (args.length < minArgs || args.length > maxArgs) {
            message.channel.send(
              `**${message.member.displayName}**, sintaxis incorrecta! Usa \`${prefix}${alias} ${expectedArgs}\``
            )
            return
          }

          if (cooldown > 0) {
            recentlyRan.push(cooldownString)
            setTimeout(() => {
              recentlyRan = recentlyRan.filter(string => {
                return string !== cooldownString
              })
            }, 1000 * cooldown)
          }

          // handle the custom command code
          callback(message, args, args.join(" "), client)

          return
        }

        // ensure Siber is not exploiting
        if (message.author.bot) {
          message.channel.send(await messageHandler("nestedCommand", message.member))
          return
        }

        // ensure the user has the required permissions
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.channel.send(`${member.displayName}, ${permissionError}`)
            return
          }
        }

        // ensure the user has the required roles
        for (const requiredRole of requiredRoles) {
          const role = await guild.roles.cache.find(role => role.name.toLowerCase().includes(requiredRole))
          if (role) {
            if (!(await member.roles.cache.get(role.id))) {
              message.channel.send(
                await messageHandler("requiredRole", message.member, {
                  username: message.author.username,
                  rolename: role.name,
                })
              )
              return
            }
          } else {
            message.channel.send(
              await messageHandler("missingRole", message.member, { username: message.author.username })
            )
            return
          }
        }

        // ensure the user doesn't run command too quickly
        let cooldownString = ""
        if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
          message.channel.send("Espera un poco antes de usarlo de nuevo")
          return
        }

        // split on any number of spaces
        const args = content.split(/[ ]+/)

        // remove the command which is the first index
        args.shift()

        // ensure we have the correct number of args
        if (args.length < minArgs || args.length > maxArgs) {
          message.channel.send(
            `**${message.member.displayName}**, sintaxis incorrecta! Usa \`${prefix}${alias}${
              expectedArgs ? " " + expectedArgs : ""
            }\``
          )
          return
        }

        if (cooldown > 0) {
          recentlyRan.push(cooldownString)
          setTimeout(() => {
            recentlyRan = recentlyRan.filter(string => {
              return string !== cooldownString
            })
          }, 1000 * cooldown)
        }

        // handle the custom command code
        callback(message, args, args.join(" "), client)

        await userUtils.incUserSchema(guild, author, "commands", 1)
        return
      }
    }
  })
}
