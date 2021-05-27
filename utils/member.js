require("module-alias/register")
const fs = require("fs")
const profileSchema = require("../schemas/profile-schema.js")

const checkSchema = async (guild, target) => {
  let result = await profileSchema.findOne({
    guildId: guild.id,
    userId: target.id,
  })
  if (!result) {
    await new profileSchema({
      name: target.username,
      guildId: guild.id,
      userId: target.id,
    }).save()
    result = await profileSchema.findOne({
      guildId: guild.id,
      userId: target.id,
    })
  }
  if (!result.name)
    await profileSchema.updateOne(
      {
        guildId: guild.id,
        userId: target.id,
      },
      {
        $set: { name: target.username },
      }
    )
  return result
}

module.exports.getUserAvatar = target => {
  return target.avatarURL()
    ? target.avatarURL()
    : "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png"
}

module.exports.getUserProfile = async (guild, target) => {
  return await checkSchema(guild, target)
}

module.exports.incUserSchema = async (guild, target, key, amount) => {
  await checkSchema(guild, target)
  await profileSchema.updateOne(
    {
      guildId: guild.id,
      userId: target.id,
    },
    {
      $inc: { [`${key}`]: amount },
    }
  )
}

module.exports.setUserSchema = async (guild, target, key, value) => {
  await checkSchema(guild, target)
  await profileSchema.updateOne(
    {
      guildId: guild.id,
      userId: target.id,
    },
    {
      $set: { [key]: value },
    }
  )
}

module.exports.checkSchemaOnJoin = async (guild, target) => {
  await checkSchema(guild, target)
}

module.exports.checkSchemaOnStart = async (client, guildId) => {
  const guild = await client.guilds.cache.get(guildId)

  await guild.members.fetch().then(async members => {
    await members.forEach(async m => {
      let target = m.user
      await checkSchema(guild, target)
    })
  })
}
