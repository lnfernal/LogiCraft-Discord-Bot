module.exports = {
  commands: "deop",
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  requiredRoles: ["666297045207875585", "666297857929642014"],
  callback: (message, arguments, text, client) => {
    const user = message.mentions.users.first();
    const modRoleId = "666297857929642014";

    if (user) {
      const role = message.guild.roles.cache.get(modRoleId);
      const member = message.guild.members.cache.get(user.id);
      if (member.roles.cache.has(modRoleId))
        member.roles.remove(role).catch(console.error);
      else
        message.channel.send(
          `**${message.member.displayName}**, el usuario ${member.displayName} no tiene ese rol`
        );
    } else {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
  },
};
