module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  cooldown: 5,
  callback: (message, arguments, text, client) => {
    message.channel.send(text.replace(/^<@!?(\d+)>$/,"")).catch(console.error);
  },
};
