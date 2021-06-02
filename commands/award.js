require("module-alias/register")
const messageHandler = require("@messages")
const s = require("@string")
const emojis = require("@emojis")

module.exports = {
  commands: "award",
  maxArgs: 1,
  expectedArgs: "<silver|gold|platinum|argentium|ternion>",
  minArgs: 1,
  callback: async (message, args, text, client) => {
    const { guild, channel, member } = message
    if (!message.reference) {
      channel.send(
        await messageHandler("award", member, {
          username: member.user.username,
        })
      )
      return
    }
    const targetMsg = await channel.messages.fetch(message.reference.messageID)
    const awardEmojis = await emojis.awardEmojis(client)
    const reaction =
      awardEmojis[`award${args[0].toLowerCase().charAt(0).toUpperCase() + args[0].toLowerCase().slice(1)}`]
    if (!reaction) {
      channel.send(
        await messageHandler("reactionWrong", member, {
          username: member.user.username,
        })
      )
      return
    }
    await targetMsg.react(reaction.id).catch(console.error)
  },
}
