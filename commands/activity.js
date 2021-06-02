require("module-alias/register")
const messageHandler = require("@messages")
const randomActivity = require("@randomActivity")
const s = require("@string")

module.exports = {
  commands: "activity",
  expectedArgs: "<watching|listening|playing|streaming> <content>",
  minArgs: 2,
  maxArgs: 20,
  cooldown: 1,
  callback: async (message, args, text, client) => {
    var type, text
    const { member } = message

    if (args[0] == "watching" || args[0] == "viendo") {
      type = 3
    } else if (args[0] == "listening" || args[0] == "escuchando") {
      type = 2
    } else if (args[0] == "playing" || args[0] == "jugando") {
      type = 1
    } else if (args[0] == "streaming" || args[0] == "retransmitiendo") {
      type = 4
    } else {
      message.channel.send(
        await messageHandler("activityDefault", member, {
          username: member.user.username,
        })
      )
      return
    }
    args.shift()
    text = args.join(" ")
    randomActivity.setActivity(client, { text, type }, true)
    randomActivity.activityTrigger()
  },
}
