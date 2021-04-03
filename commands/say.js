module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  permissionError: "no tienes permisos",
  minArgs: 1,
  maxArgs: 199,
  permissions: [],
  requiredRoles: [],
  callback: (message, arguments, text, client) => {
    message.channel.send(text);
  },
};
