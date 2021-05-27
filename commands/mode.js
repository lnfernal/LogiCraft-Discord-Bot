require("module-alias/register")

module.exports = {
  commands: "mode",
  maxArgs: 1,
  expectedArgs: "<mode>",
  minArgs: 1,
  permissions: "ADMINISTRATOR",
  callback: async (message, args, text, client) => {
    const { channel, member } = message,
      chatMode = require("@chatMode"),
      mode = args[0]

    chatMode.setMode(mode)
    channel.send(`**${member.user.username}** ha puesto el chat en modo ${mode}`)
  },
}
