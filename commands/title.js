const regex = require("@regex")

module.exports = {
  commands: "title",
  expectedArgs: "<emoji> <text>",
  minArgs: 2,
  maxArgs: 16,
  callback: async (message, args, text, client) => {
    const { channel, author, guild } = message
    const characters = {
      a: {
        top: "OXO",
        middle: "XXX",
        bottom: "XOX",
      },
      b: {
        top: "XXO",
        middle: "XXX",
        bottom: "XXX",
      },
      c: {
        top: "XXX",
        middle: "XOO",
        bottom: "XXX",
      },
      d: {
        top: "XXO",
        middle: "XOX",
        bottom: "XXO",
      },
      e: {
        top: "XXX",
        middle: "XXO",
        bottom: "XXX",
      },
      f: {
        top: "XXX",
        middle: "XXO",
        bottom: "XOO",
      },
      g: {
        top: "XXO",
        middle: "XOX",
        bottom: "XXX",
      },
      h: {
        top: "XOX",
        middle: "XXX",
        bottom: "XOX",
      },
      i: {
        top: "XXX",
        middle: "OXO",
        bottom: "XXX",
      },
      j: {
        top: "OOX",
        middle: "XOX",
        bottom: "XXX",
      },
      k: {
        top: "XOX",
        middle: "XXO",
        bottom: "XOX",
      },
      l: {
        top: "XOO",
        middle: "XOO",
        bottom: "XXX",
      },
      m: {
        top: "XXX",
        middle: "XXX",
        bottom: "XOX",
      },
      n: {
        top: "XXX",
        middle: "XOX",
        bottom: "XOX",
      },
      o: {
        top: "XXX",
        middle: "XOX",
        bottom: "XXX",
      },
      p: {
        top: "XXX",
        middle: "XXX",
        bottom: "XOO",
      },
      q: {
        top: "XXX",
        middle: "XXX",
        bottom: "OOX",
      },
      r: {
        top: "XXX",
        middle: "XOO",
        bottom: "XOO",
      },
      s: {
        top: "OXX",
        middle: "OXO",
        bottom: "XXO",
      },
      t: {
        top: "XXX",
        middle: "OXO",
        bottom: "OXO",
      },
      u: {
        top: "XOX",
        middle: "XOX",
        bottom: "XXX",
      },
      v: {
        top: "XOX",
        middle: "XOX",
        bottom: "OXO",
      },
      w: {
        top: "XOX",
        middle: "XXX",
        bottom: "XXX",
      },
      x: {
        top: "XOX",
        middle: "OXO",
        bottom: "XOX",
      },
      y: {
        top: "XOX",
        middle: "OXO",
        bottom: "OXO",
      },
      z: {
        top: "XXO",
        middle: "OXO",
        bottom: "OXX",
      },
      0: {
        top: "XXX",
        middle: "XOX",
        bottom: "XXX",
      },
      1: {
        top: "XXO",
        middle: "OXO",
        bottom: "XXX",
      },
      2: {
        top: "XXO",
        middle: "OXO",
        bottom: "OXX",
      },
      3: {
        top: "XXX",
        middle: "OXX",
        bottom: "XXX",
      },
      4: {
        top: "XOX",
        middle: "XXX",
        bottom: "OOX",
      },
      5: {
        top: "OXX",
        middle: "OXO",
        bottom: "XXO",
      },
      6: {
        top: "XOO",
        middle: "XXX",
        bottom: "XXX",
      },
      7: {
        top: "XXX",
        middle: "OOX",
        bottom: "OOX",
      },
      8: {
        top: "OXX",
        middle: "XXX",
        bottom: "XXX",
      },
      9: {
        top: "XXX",
        middle: "XXX",
        bottom: "OOX",
      },
      '/': {
        top: "OOX",
        middle: "OXO",
        bottom: "XOO",
      },
    }
    const emoji = args[0],
      emojiRegex = regex.emojis,
      emptyChar = "      "

    let result = "‎\n"

    // if (!emojiRegex.test(emoji)) return await channel.send("emoji error")

    args.shift()
    const title = args.join(" ")

    for (let i = 0; i < title.length; i++) {
      if (!(`${title[i].toLowerCase()}` in characters)) return await channel.send("wrong letter")
      for (let j = 0; j < 3; j++) {
        result += characters[`${title[i].toLowerCase()}`].top[j] == "X" ? emoji : emptyChar
      }
      result += "   "
    }
    result += "\n"
    for (let i = 0; i < title.length; i++) {
      for (let j = 0; j < 3; j++) {
        result += characters[`${title[i].toLowerCase()}`].middle[j] == "X" ? emoji : emptyChar
      }
      result += "   "
    }
    result += "\n"
    for (let i = 0; i < title.length; i++) {
      for (let j = 0; j < 3; j++) {
        result += characters[`${title[i].toLowerCase()}`].bottom[j] == "X" ? emoji : emptyChar
      }
      result += "   "
    }

    if (result.length > 2000) return await channel.send("length error")

    await channel.send(result)
  },
}
