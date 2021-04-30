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
  "666297045207875585",
  "666297857929642014",
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
  guildMembers.forEach(async (member) => {
    await member.roles
      .set([])
      .then(
        async () =>
          await member.roles.set([
            `${guildRoles[Math.floor(Math.random() * guildRoles.length)].id}`,
          ])
      );
  });
  actionTimeout = setTimeout(() => {
    changeRoles(guild);
  }, 40 * 1000);
};

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
              if (!roleFilter.includes(role.id) && member.id != guild.ownerID && member.id != client.user.id) roles.push(role);
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
        changeRoles(guild);
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
            reactedMessages.forEach((message) => {
              message.reactions.removeAll();
            });
            reactedMessages = [];
            mode = 0;
            break;
          case 2:
            clearTimeout(actionTimeout);
            mode = 0;
            guildRoles = [];
            guildMembers.forEach((member) => {
              rolesBackup.forEach((roles) => {
                if (roles.id == member.id) {
                  member.roles.set([]);
                  member.roles.set(roles.roles);
                }
              });
            });
            break;
          case 3:
            sentMessages.forEach((message) => {
              message.delete();
            });
            mode = 0;
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
          embed.setDescription("Reaccionando al reaccionando");
          break;
        case 2:
          embed.setDescription("Ya no importa de donde vengas");
          break;
        case 3:
          embed.setDescription("_No Molestar_, tu mejor amigo");
          break;
        case 4:
          embed.setDescription("¿Quién es quién?");
          break;
        case 5:
          embed.setDescription(
            "Todos los canales serán eliminados en 60 segundos\n¿Estás seguro? Usa _/cancel_ para detener la acción"
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
          if (channel.type == "text" && !message.content.startsWith("/")) {
            channel.send(message.content).then((msg) => sentMessages.push(msg));
          }
        });
        break;
    }
  },
};
