const { prefix } = require("../config.json");

const validatePermissions = (permissions) => {
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
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`);
    }
  }
};

let recentlyRan = [];

module.exports = (client, commandOptions, dirName) => {
  let {
    commands,
    expectedArgs = "",
    permissionError = "no tienes permiso para usar este comando :c",
    minArgs = 0,
    maxArgs = null,
    cooldown = -1,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions;

  // Ensure the command and aliases are in an array
  if (typeof commands === "string") {
    commands = [commands];
  }

  console.log(
    `Registrando comando: "${prefix}${commands[0]}" ${
      dirName === null ? "" : `(/${dirName})`
    }`
  );

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions];
    }
    validatePermissions(permissions);
  }

  client.on("message", (message) => {
    const { member, content, guild } = message;

    if(message.guild.id == "829448956417015828" || message.mentions.has(client.user.id)) return // protecc logibot
    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`;

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        // a command has been ran

        // ensure Siber is not exploiting
        if (message.author.bot) {
          message.channel.send(`nope :)`);
          return;
        }

        // ensure the user has the required permissions
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.channel.send(`${member.displayName}, ${permissionError}`);
            return;
          }
        }

        // ensure the user has the required roles
        var hasAtLeastOneRole = false;
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.id === requiredRole
          );
          if (role) {
            if (member.roles.cache.get(role.id)) {
              hasAtLeastOneRole = true;
            }
          }
        }
        if (!hasAtLeastOneRole && requiredRoles > 0) {
          message.channel.send(
            `**${message.member.displayName}**, necesitas un rol especial para usar este comando`
          );
          return;
        }

        // ensure the user doesn't run command too quickly
        let cooldownString = "";
        if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
          message.channel.send("Este comando está en cooldown :P");
          return;
        }

        // split on any number of spaces
        const arguments = content.split(/[ ]+/);

        // remove the command which is the first index
        arguments.shift();

        // ensure we have the correct number of arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {
          message.channel.send(
            `**${message.member.displayName}**, sintaxis incorrecta! Usa **"${prefix}${alias} ${expectedArgs}"**`
          );
          return;
        }

        if (cooldown > 0) {
          recentlyRan.push(cooldownString);
          setTimeout(() => {
            recentlyRan = recentlyRan.filter((string) => {
              return string !== cooldownString;
            });
          }, 1000 * cooldown);
        }

        // Handle the custom command code
        callback(message, arguments, arguments.join(" "), client);

        return;
      }
    }
  });
};
