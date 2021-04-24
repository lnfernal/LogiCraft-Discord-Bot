module.exports = {
  commands: ["ping", "latency"],
  expectedArgs: "<content>",
  callback: (message, arguments, text, client) => {
    message.channel.send(
      `⏳ **${client.ws.ping}ms** _(tiempo entre comando y output por chat)_`
    );
  },
};
