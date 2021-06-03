require("module-alias/register")
const userUtils = require("@user")

module.exports.inc = async message => {
  const { guild, author } = message

  await userUtils.incUserSchema(guild, author, "messages", 1)
  await userUtils.incUserSchema(guild, author, "words", message.content.split(" ").length)
  if (message.attachments.length) await userUtils.incUserSchema(guild, author, "images", 1)
}
