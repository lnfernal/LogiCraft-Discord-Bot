const muteSchema = require("../../schemas/mute-schema.js");
const mutedRoleId = "788187970930343976";
let rolesBackup = [];
const Discord = require("discord.js");
const unmute = require("./unmute.js");

module.exports = {
  commands: "mute",
  expectedArgs: "<user> [time] [reason]",
  minArgs: 1,
  maxArgs: 30,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, arguments, text, client) => {
    const { guild, channel } = message;
    const staff = message.author;
    const target = message.mentions.users.first();
    let reason = "_No especificado_",
      duration,
      timeUnit,
      expires;
    if (target) {
      const previousMutes = await muteSchema.find({
        userId: target.id,
        guildId: guild.id,
      });

      const currentlyMuted = previousMutes.filter((mute) => {
        return mute.current === true;
      });

      if (currentlyMuted.length) {
        channel.send(
          `**${message.member.displayName}**, este usuario ya está muteado`
        );
        return;
      }
      const mutedRole = guild.roles.cache.find((role) => {
        return role.id == mutedRoleId;
      });

      if (!mutedRole) return;

      if (target.bot || target.id == guild.ownerID) return;

      if (arguments[1]) {
        const possibleTime = /^\d{1,3}[a-zA-Z]$/.test(arguments[1]);

        if (isNaN(arguments[1]) && !possibleTime) {
          // means it's reason
          arguments.shift();
          reason = arguments.join(" ");
        } else {
          // means it's time
          duration = arguments[1].replace(/\D/g, "");
          timeUnit = arguments[1].slice(-1).toLowerCase();
          expires = new Date();

          switch (timeUnit) {
            case "s":
              expires = expires.getTime() + duration * 1000;
              break;
            case "m":
              expires = expires.getTime() + duration * 60000;
              break;
            case "h":
              expires = expires.getTime() + duration * 60 * 60000;
              break;
            case "d":
              expires = expires.getTime() + duration * 24 * 60000;
              break;
            default:
              channel.send(
                `**${message.member.displayName}**, usa **m (minutos)**, **h (horas)**, **d (dias)**`
              );
              return;
          }
          if (arguments[2]) {
            arguments.shift();
            arguments.shift();
            reason = arguments.join(" ");
          }
        }
      }
      const targetMember = (await guild.members.fetch()).get(target.id);
      let roles = [];
      await targetMember.roles.cache.each((role) => {
        if (role.name != "@everyone") roles.push(role);
      });
      rolesBackup.push({
        id: targetMember.id,
        roles,
      });
      if (!expires) expires = new Date().setFullYear(2077);
      const date = new Date(expires);
      setTimeout(async () => {
        const result = await muteSchema.updateOne(
          {
            guildId: guild.id,
            userId: targetMember.id,
            current: true,
          },
          {
            current: false,
          }
        );
        if (result.nModified == 1) {
          await unmute.triggerUnmute(targetMember);
        }
      }, expires - new Date().getTime());
      await targetMember.roles.set([]);
      await targetMember.roles.add(mutedRole);
      await new muteSchema({
        userId: target.id,
        guildId: guild.id,
        reason,
        staffId: staff.id,
        staffTag: staff.tag,
        expires,
        current: true,
      }).save();
      const embed = new Discord.MessageEmbed()
        .setTitle(`${targetMember.displayName} ha sido muteado`)
        .setDescription(
          `Motivo: ${reason}\nId: ${
            targetMember.id
          }\nTerminio: ${date.toLocaleString()}}`
        );
      message.channel.send(embed);
    } else {
      const errorMsg = [
        `**${message.member.displayName}**, tienes que mencionar al usuario :P`,
        `**${message.member.displayName}**, eso no parece una mención...`,
        `**${message.member.displayName}**, prueba mencionando al usuario con su @`,
      ];
      message.channel.send(
        errorMsg[Math.floor(Math.random() * errorMsg.length)]
      );
    }
  },
};

module.exports.rolesBackup = async () => {
  return rolesBackup;
};
module.exports.mutedRole = async () => {
  await guild.roles.cache.find((role) => {
    return role.id == mutedRoleId;
  });
};
