require("module-alias/register")
const regex = require("@regex")

module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  callback: (message, args, text, client) => {
    message.channel.send(regex.spam(text)).catch(console.error)
  },
}
