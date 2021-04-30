const Discord = require("discord.js");
let actionTimeout,
  mode = 0,
  emojis,
  reactedMessages = [],
  rolesBackup = [],
  guildRoles = [],
  guildMembers = [],
  membersBackup = [],
  sentMessages = [],
  channelsBackup = [],
  hChannel;

const everyone = "666295714724446209";
const roleFilter = [
  "824989891317334058",
  "788187970930343976",
  "830422173071179786",
  "812371550300536833",
  "835554369666547743",
  "834422510166081537",
];

const changeNames = async (members) => {
  members.forEach((member) => {
    member.setNickname(
      membersBackup[Math.floor(Math.random() * membersBackup.length)].username
    );
  });
  actionTimeout = setTimeout(() => {
    changeNames(members);
  }, 10 * 1000);
};

const changeRoles = async (guild) => {
  guildMembers.forEach(async (member, i) => {
    await member.roles
      .set([])
      .then(setTimeout(async () => {
       await member.roles.set([
            `${guildRoles[Math.floor(Math.random() * guildRoles.length)].id}`,
          ])
    }), i * 1000)
  });
  actionTimeout = setTimeout(() => {
    changeRoles(guild);
  }, guild.memberCount * 3 * 1000);
}

const countdown = (i, channel) => {
  setTimeout(async () => {
    await channel.send(`${i}s`);
    i--;
    if (i > 0) countdown(i, channel);
  }, 1 * 1000);
};

module.exports = {
  commands: "troll",
  minArgs: 1,
  expectedArgs: "<mode|end>",
  permissions: ["ADMINISTRATOR"],
  callback: async (message, arguments, text, client) => {
    const { guild, member, guildId = guild.id, channel } = message;
    if (arguments[0] !== "end" && mode != 0) {
      channel.send("Ya hay un troleo activo");
      return;
    }

    switch (arguments[0]) {
      case "silverfish":
        mode = 1;
        break;
      case "phantom":
        mode = 2;
        rolesBackup = [];
        guildMembers = [];
        await guild.members.cache.each(async (member) => {
          let roles = [],
            validMember = true;
          await member.roles.cache.each((role) => {
            if (role.name != "@everyone")
              if (
                !roleFilter.includes(role.id) &&
                member.id != guild.ownerID &&
                member.id != client.user.id
              )
                roles.push(role);
              else validMember = false;
          });
          if (validMember) {
            rolesBackup.push({
              id: member.id,
              roles,
            });
            guildMembers.push(member);
          }
        });
        await guild.roles.cache.each((role) => {
          if (!roleFilter.includes(role.id) && role.name != "@everyone")
            guildRoles.push(role);
        });
        await changeRoles(guild);
        break;
      case "creeper":
        mode = 3;
        break;
      case "wither":
        mode = 4;
        let members = [];
        await guild.members.fetch().then((m) => {
          m.filter((m) => m.id != guild.ownerID /*&& !m.user.bot*/).forEach(
            (member) => {
              membersBackup.push({
                id: member.id,
                name: member.displayName,
                username: member.user.username,
              });
              members.push(member);
            }
          );
          changeNames(members);
        });
        break;
      case "herobrine":
        mode = 5;
        countdown(60, channel);
        setTimeout(async () => {
          await guild.channels.cache.each((channel) => {
            channelsBackup.push({
              id: channel.id,
              permissionOverwrites: channel.permissionOverwrites,
            });
            channel.overwritePermissions(
              [
                {
                  id: everyone,
                  deny: ["VIEW_CHANNEL"],
                },
              ],
              "Herobrine joined the chat"
            );
          });
          hChannel = await guild.channels.create("general", {
            type: "text",
            permissionOverwrites: [
              {
                id: everyone,
                deny: [
                  "MANAGE_CHANNELS",
                  "CREATE_INSTANT_INVITE",
                  "MANAGE_MESSAGES",
                  "MENTION_EVERYONE",
                ],
              },
            ],
          });
        }, 1000 * 70);
        break;
      case "end":
        switch (mode) {
          case 1:
            channel.send("Limpiando reacciones...");
            reactedMessages.forEach((message) => {
              message.reactions.removeAll();
            });
            reactedMessages = [];
            mode = 0;
            break;
          case 2:
            channel.send("Restaurando roles...");
            clearTimeout(actionTimeout);
            mode = 0;
            guildRoles = []
            setTimeout(() => {
              guildMembers.forEach((member) => {
                rolesBackup.forEach(async (roles) => {
                  if (roles.id == member.id) {
                    await member.roles.set([]);
                    await member.roles.set(roles.roles);
                  }
                });
              });
            }, guild.memberCount * 1.5);
            break;
          case 3:
            channel.send("Eliminando mensajes...");
            mode = 0;
            sentMessages.forEach((message) => {
              message.delete().catch(console.error);
            });
            sentMessages = [];
            break;
          case 4:
            mode = 0;
            clearTimeout(actionTimeout);
            membersBackup.forEach(async (member) => {
              const m = await guild.members.cache.get(member.id);
              if (m) m.setNickname(member.name);
            });
            membersBackup = [];
            break;
          case 5:
            mode = 0;
            await channelsBackup.forEach(async (channel) => {
              const c = await guild.channels.cache.get(channel.id);
              if (c) c.overwritePermissions(channel.permissionOverwrites);
            });
            await hChannel.delete("Herobrine left the chat");
            break;
          default:
            channel.send("No hay acciones activas");
            return;
        }
        break;
      default:
        channel.send(
          "Selecciona una acción con su palabra clave o _end_ para detenerlo"
        );
        return;
    }
    await require("../avatar-manager/avatar-manager.js").troll(client);
    if (mode != 0) {
      const embed = new Discord.MessageEmbed()
        .setTitle(
          `Iniciado protocolo ${
            arguments[0].charAt(0).toUpperCase() + arguments[0].slice(1)
          } (${mode})`
        )
        .setColor("#ff0000");
      switch (mode) {
        case 1:
          embed.setDescription("HOLY EMOJI");
          break;
        case 2:
          embed.setDescription("ROLE REROLL");
          break;
        case 3:
          embed.setDescription("DAMN SPAM");
          break;
        case 4:
          embed.setDescription("IDENTITY MESSILY");
          break;
        case 5:
          embed.setDescription(
            "CHANNEL DISMANTLE\n\n[!] Todos los canales serán eliminados en 60 segundos\n¿Estás seguro? Usa _/cancel_ para detener la acción"
          );
          break;
      }
      channel.send(embed);
    }
  },
  onMessage: async (client, message) => {
    const { member, guild, guildId = guild.id } = message;
    emojis = await require("../utils/emojis.js").guildEmojis(client, guildId);
    if (member.id === guild.ownerID) return;
    switch (mode) {
      case 1:
        var keys = Object.keys(emojis);
        reactedMessages.push(message);
        for (var i = 0; i < Math.floor(Math.random() * 5 + 1); i++)
          await message.react(
            emojis[keys[Math.floor(Math.random() * keys.length)]].id
          );
        break;
      case 3:
        await guild.channels.cache.each((channel) => {
          if (channel.type == "text") {
            channel.send(message.content.replace(/^<@!?(\d+)>$|\//,"")).then((msg) => sentMessages.push(msg));
          }
        });
        break;
    }
  },
};
