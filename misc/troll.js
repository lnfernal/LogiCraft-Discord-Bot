var emojiFace = [
  "😄",
  "😃",
  "😀",
  "😊",
  "😉",
  "😍",
  "😘",
  "😚",
  "😗",
  "😙",
  "😜",
  "😝",
  "😛",
  "😳",
  "😁",
  "😔",
  "😌",
  "😒",
  "😞",
  "😣",
  "😢",
  "😂",
  "😭",
  "😪",
  "😥",
  "😰",
  "😅",
  "😓",
  "😩",
  "😫",
  "😨",
  "😱",
  "😠",
  "😡",
  "😤",
  "😖",
  "😆",
  "😋",
  "😷",
  "😎",
  "😴",
  "😵",
  "😲",
  "😟",
  "😦",
  "😧",
  "😈",
  "👿",
  "😮",
  "😬",
  "😐",
  "😕",
  "😯",
  "😶",
  "😇",
  "😏",
  "😑",
]

var emojiChar = {
  a: "🇦",
  b: "🇧",
  c: "🇨",
  d: "🇩",
  e: "🇪",
  f: "🇫",
  g: "🇬",
  h: "🇭",
  i: "🇮",
  j: "🇯",
  k: "🇰",
  l: "🇱",
  m: "🇲",
  n: "🇳",
  o: "🇴",
  p: "🇵",
  q: "🇶",
  r: "🇷",
  s: "🇸",
  t: "🇹",
  u: "🇺",
  v: "🇻",
  w: "🇼",
  x: "🇽",
  y: "🇾",
  z: "🇿",
  0: "0️⃣",
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  9: "9️⃣",
  10: "🔟",
  "#": "#️⃣",
  "*": "*️⃣",
  "!": "❗",
  "?": "❓",
}

module.exports = {
  onMessage: async (client, message) => {
    const emojis = require("../utils/emojis.js").guildEmojis(
      client,
      message.guild.id
    )
    if (
      message.member.id === "458738156695584770" &&
      message.content.toLowerCase().includes("sispi")
    ) {
      message.channel.send(
        `**${message.member.displayName}**, deja a Sisplau. Aviso. Desplegaré mis armas`
      )
    } else if (message.member.id === "null") {
      for (i = 0; i < 10; i++) {
        await message.react(
          emojiFace[Math.floor(Math.random() * emojis.length)]
        )
      }
    }
  },
}
