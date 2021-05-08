const randomActivity = require("../misc/random-activity.js")
require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")

module.exports = {
  commands: "activity",
  expectedArgs: "<watching|listening|playing|streaming> <content>",
  minArgs: 2,
  maxArgs: 20,
  cooldown: 60,
  callback: async (message, arguments, text, client) => {
    var type, name
    const { member } = message

    switch (arguments[0]) {
      case "viendo":
        type = 3
        break
      case "escuchando":
        type = 2
        break
      case "jugando":
        type = 1
        break
      case "retransmitiendo":
        type = 4
        break
      default:
        message.channel.send(
          s.interpolate(await messageHandler("activityDefault", member), {
            username: member.user.username,
          })
        )
        return
    }
    randomActivity.activityTrigger()
    arguments.shift()
    name = arguments.join(" ")
    client.user.setPresence({
      activity: {
        name,
        type,
      },
      status: "online",
    })
  },
}
