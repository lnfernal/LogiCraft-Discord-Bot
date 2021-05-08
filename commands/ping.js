module.exports = {
  commands: ["ping", "latency"],
  expectedArgs: "<content>",
  callback: (message, arguments, text, client) => {
    message.channel.send(`⏳**${client.ws.ping}ms**`)
  },
}
