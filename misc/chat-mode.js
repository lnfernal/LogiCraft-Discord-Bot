let mode = 0

module.exports.setMode = x => {
  mode = x
}

module.exports.onMessage = (client, message) => {
  const { guild, content, member, channel } = message
  let newMsg
  switch (mode) {
    case "emoji":
      newMsg = content.replace(/<:?(\w+)?:(\w+)>/gm, "")
      break
  }
  if (newMsg) channel.send(newMsg)
}
