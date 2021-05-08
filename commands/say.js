module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  callback: (message, arguments, text, client) => {
    message.channel
      .send(text.replace(/<@!?(\d+)>|^\/+/g, ""))
      .catch(console.error)
  },
}
