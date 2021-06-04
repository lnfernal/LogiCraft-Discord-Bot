module.exports = {
  commands: "uwu",
  callback: async (message, args, text, client) => {
    const mute = require("./moderation/mute")
    mute.callback(message, [`${message.author.username}`, "30m", "Demasiado UwU"], "", client)
  },
}
