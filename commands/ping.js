module.exports = {
  commands: ["ping", "latency"],
  expectedArgs: "<content>",
  callback: (message, args, text, client) => {
    message.channel.send(`⏳**${client.ws.ping}ms**`)
  },
}
