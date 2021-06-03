import moment from "moment"

require("module-alias/register")
const fs = require("fs")
const profileSchema = require("../schemas/profile-schema.js")
const muteSchema = require("../schemas/mute-schema.js")
const defaultAvatarURL = "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png"
const messageHandler = require("@messages")

async function checkSchema(guild, target) {
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

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

module.exports.getUserAvatar = target => {
  return target.avatarURL() ? target.avatarURL() : defaultAvatarURL
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

module.exports.setUserSchema = async (guild, target, key: string, value) => {
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

module.exports.getAvatarColor = async target => {
  const { getColorFromURL } = require("color-thief-node"),
    url = target.avatarURL() ? target.avatarURL().replace(".webp", ".png") : defaultAvatarURL

  const [r, g, b] = await getColorFromURL(url)
  return rgbToHex(r, g, b)
}

async function immuneUser(message, target) {
  if (/*target.bot || */ target.id == message.guild.ownerID) {
    message.channel.send(
      await messageHandler("immuneUser", message.member, {
        username: message.author.username,
        targetUsername: target.username,
      })
    )
    return true
  }
  return false
}

async function immuneRole(message, target, protectedRoles) {
  const targetMember = await message.guild.members.cache.get(target.id)

  for (const protectedRole of protectedRoles) {
    const role = isNaN(protectedRole)
      ? await message.guild.roles.cache.find(role => role.name.toLowerCase().includes(protectedRole.toLowerCase()))
      : await message.guild.roles.cache.get(protectedRole)

    if (!role) {
      message.channel.send(
        await messageHandler("missingRole", message.member, {
          username: message.author.username,
        })
      )
      continue
    }

    if (targetMember.roles.cache.has(role.id)) {
      message.channel.send(
        await messageHandler("immuneRole", message.member, {
          username: message.author.username,
          roleName: role.name,
        })
      )
      return true
    }
  }
  return false
}

module.exports.checkImmunity = async (message, target, protectedRoles = null) => {
  let immune = false

  immune = await immuneUser(message, target)
  if (protectedRoles) immune = await immuneRole(message, target, protectedRoles)
  return immune
}

module.exports.getCreatedAt = async (guild, target) => {
  const result = await muteSchema.findOne({
    guildId: guild.id,
    userId: target.id,
    current: true,
  })
  const date = new Date(result.createdAt)

  return date
}

module.exports.getJoinedAt = (date) => {
  moment.locale("es")
  return moment(date).format("llll")
}