const Discord = require("discord.js");
let actionTimeout,
  mode = 0,
  emojis,
  reactedMessages = [],
  rolesBackup = [],
  filteredRoles = [],
  membersBackup = [],
  sentMessages = [],
  channelsBackup = [],
  hChannel;

const everyone = "666295714724446209";
const roleFilter = [
  "812371550300536833",
  "666297045207875585",
  "788187970930343976",
  "812371550300536833",
  "666297857929642014",
  "830422173071179786",
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
  rolesBackup.forEach((role) => {
    if (!roleFilter.includes(role.id)) filteredRoles.push(role);
  });
  await guild.members.fetch().then((members) => {
    members
      .filter((m) => !m.roles.cache.some((r) => roleFilter.includes(r.id)))
      .forEach(async (member) => {
        await member.roles
          .set([])
          .then(
            async () =>
              await member.roles.set([
                `${
                  filteredRoles[
                    Math.floor(Math.random() * filteredRoles.length)
                  ].id
                }`,
              ])
          );
      });
  });
  actionTimeout = setTimeout(() => {
    changeRoles(guild);
  }, 30 * 1000);
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
        await guild.roles.fetch().then((roles) => {
          roles.cache.forEach((role) => {
            rolesBackup.push({
              id: role.id,
              members: guild.roles.cache.get(role.id).members,
            });
          });
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
            await guild.members.fetch().then((members) => {
              members
                .filter(
                  (m) => !m.roles.cache.some((r) => roleFilter.includes(r.id))
                )
                .forEach((member) => {
                  member.roles.set([]);
                  filteredRoles
                    .filter((r) => r.id != everyone)
                    .forEach((role) => {
                      const guildRole = guild.roles.cache.get(role.id);
                      const memberRole = role.members.find(
                        (m) => member.id === m.id
                      );
                      if (memberRole) member.roles.add(guildRole);
                    });
                });
            });
            filteredRoles = [];
            rolesBackup = [];
            mode = 0;
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
        .setTitle(`Iniciado protocolo ${arguments[0]} (${mode})`)
        .setColor("#ff0000");
      if (mode == 5)
        embed.setDescription(
          "Todos los canales serán eliminados en 60 segundos\n¿Estás seguro? Usa _/cancel_ para detener la acción"
        );
      channel.send(embed);
    }
  },
  onMessage: async (client, message) => {
    const { member, guild, guildId = guild.id } = message;
    emojis = await require("../utils/emojis.js").guildEmojis(client, guildId);
    if(member.id === guild.ownerID) return
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
