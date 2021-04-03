module.exports = {
  commands: "latency",
  expectedArgs: "<content>",
  permissionError: "no tienes permisos",
  maxArgs: 0,
  permissions: [],
  requiredRoles: [],
  callback: (message, arguments, text, client) => {
    message.channel.send(`Ping: ${client.ws.ping}ms`);
  },
};
