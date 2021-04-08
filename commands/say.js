module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  cooldown: 2,
  callback: (message, arguments, text, client) => {
    message.channel.send(text);
  },
};
