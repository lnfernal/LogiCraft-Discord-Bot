require("module-alias/register")
const Discord = require("discord.js")
const avatarManager = require("../misc/avatar-manager.js")
const messageHandler = require("@messages")
const userUtils = require("@user")
const s = require("@string")

const hjMsg = ["BONK", "Happy Cheems noises :)", "Go to Horny Jail!", "No Horny", "Horny bad", "Licencia de Horny"]

module.exports = {
  commands: ["hornyjail", "bonk"],
  expectedArgs: "<user>",
  permissionError: "no tienes los permisos necesarios :c",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, args, text, client) => {
    const { member, channel } = message
    const target = message.mentions.users.first() || (await s.getUserByString(args[0], member))
    const horny = await message.guild.roles.cache.find(r => r.name.toLowerCase().includes("horny"))
    const hornier = await message.guild.roles.cache.find(r => r.name.toLowerCase().includes("hornier")),
      images = [
        "https://media1.tenor.com/images/4fd0fd16a296d42b9fb08f9df2063ab8/tenor.gif?itemid=19294476",
        "https://i.redd.it/9ejnyj8tnzi61.png",
        "https://i.redd.it/4s9s1gdt1v351.jpg",
      ]
    let embed

    if (!target) {
      message.channel.send(
        await messageHandler("missingUser", member, {
          username: member.user.username,
        })
      )
      return
    }
    if (!horny || !hornier) {
      message.channel.send(
        await messageHandler("missingRole", member, {
          username: member.user.username,
        })
      )
      return
    }

    if (await userUtils.checkImmunity(message, target)) return

    const targetMember = await message.guild.members.cache.get(target.id),
      emojis = await require("@emojis").logibotEmojis(client)

    if (await targetMember.roles.cache.has(horny.id)) {
      await targetMember.roles.remove(horny)
      await targetMember.roles.add(hornier)
      embed = new Discord.MessageEmbed()
        .setColor("#220000")
        .setTitle(
          `${await messageHandler("hornier", member, {
            username: target.username,
            hjEmoji: emojis.GOTOHORNYJAIL,
          })}`
        )
        .setImage(images[Math.floor(Math.random() * images.length)])
        .setDescription(
          `${member.user.username} a ${target.username}: "_${hjMsg[Math.floor(Math.random() * hjMsg.length)]}_"`
        )
    } else if (await targetMember.roles.cache.has(hornier.id)) {
      embed = new Discord.MessageEmbed().setTitle(
        `${emojis.GOTOHORNYJAIL}${emojis.GOTOHORNYJAIL}${emojis.GOTOHORNYJAIL}`
      )
    } else {
      await targetMember.roles.add(horny)
      embed = new Discord.MessageEmbed()
        .setColor("#ff4646")
        .setTitle(
          `${await messageHandler("horny", member, {
            username: target.username,
            hjEmoji: emojis.GOTOHORNYJAIL,
          })}`
        )
        .setThumbnail("https://i.imgur.com/82Uyczc.jpg")
        .setDescription(
          `${member.user.username} a ${target.username}: "_${hjMsg[Math.floor(Math.random() * hjMsg.length)]}_"`
        )
    }
    await channel.send(embed)
    avatarManager.angry(client)
  },
}
