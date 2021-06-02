require("module-alias/register")
const userUtils = require("@user")
const math = require("@math")
const fResponseChance = 0.5

const fSentences = ["F :c", "Super F", "F", "Pulsa F -> `F`", ":regional_indicator_f:"]

module.exports = {
  onMessage: async (client, message) => {
    const { guild, author, channel, content } = message

    if (content.toLowerCase() === "f" && Math.random() * 1 < fResponseChance)
      channel.send(fSentences[Math.floor(Math.random() * fSentences.length)])
    else if (content.toLowerCase().includes("monke")) channel.send("reject humanity, return to monke 🐒")
    else if (content.toLowerCase() === "/xd") channel.send("seas o no Dark, es /xp no /xd")
    if (content.toLowerCase() === "ping") {
      await userUtils.incUserSchema(guild, author, "pongs", 1)
      const result = await userUtils.getUserProfile(guild, author)
      let str = "p",
        { pongs } = result

      pongs = math.clamp(pongs, 0, 1997)
      for (let i = 0; i < pongs; i++) str += "o"
      str += "ng"
      await channel.send(str)

      if (pongs === 1997) await channel.send(`${author.username} ha hecho un **MEGA PONG**`)
    }
  },
}
