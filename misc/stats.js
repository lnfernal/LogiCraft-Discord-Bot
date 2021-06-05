require("module-alias/register")
const userUtils = require("@user")

module.exports.inc = async message => {
  const { guild, author, content } = message

  await userUtils.incUserSchema(guild, author, "messages", 1)
  await userUtils.incUserSchema(guild, author, "words", message.content.split(" ").length)
  if (message.attachments.size > 0) await userUtils.incUserSchema(guild, author, "files", 1)
  if (/<a?:.+:\d+>|:.+:/gm.test(content))
    await userUtils.incUserSchema(guild, author, "emojis", /<a?:.+:\d+>|:.+:/gm.exec(content).length)
  if (message.reference) await userUtils.incUserSchema(guild, author, "replies", 1)
}
