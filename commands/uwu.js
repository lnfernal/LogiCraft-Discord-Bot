module.exports = {
  commands: "uwu",
  callback: async (message, args, text, client) => {
    if (message.member.bannable) await message.member.ban()
    else return
    await message.channel.send(`${message.author.username}, un saludo`)
  },
}
