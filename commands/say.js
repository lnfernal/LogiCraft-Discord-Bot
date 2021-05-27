module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  callback: (message, args, text, client) => {
    message.channel.send(text.replace(/<@!?(\d+)>|^\/+(\s*\/*)*/gm, "")).catch(console.error)
  },
}
