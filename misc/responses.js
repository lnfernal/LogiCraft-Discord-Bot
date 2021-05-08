const fResponseChance = 0.5

const fSentences = ["F :c", "Super F", "F", "Pulsa F -> `F`"]

module.exports = {
  onMessage: (client, message) => {
    if (
      message.content.toLowerCase() === "f" &&
      Math.random() * 1 < fResponseChance
    ) {
      message.channel.send(
        fSentences[Math.floor(Math.random() * fSentences.length)]
      )
    } else if (message.content.toLowerCase().includes("monke")) {
      message.channel.send("reject humanity, return to monke 🐒")
    } else if (message.content.toLowerCase() === "/xd") {
      message.channel.send("seas o no Dark, es /xp no /xd")
    }
  },
}
