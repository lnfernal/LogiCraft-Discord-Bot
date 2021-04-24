const profileSchema = require("../schemas/profile-schema.js");
const Discord = require("discord.js");

const getUserData = async (guildId, member) => {
  const userId = member.id;
  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  if (result) {
    const { name, totalXp, level, lover, xp } = result;
    let user = {
      userId,
      name,
      xp,
      totalXp,
      level,
      lover,
    };
    return user;
  } else if (true) {
    let user = {
      userId: member.id,
      name: member.displayName.replace("_", "-"),
      xp: 0,
      totalXp: 0,
      level: 0,
      lover: 0,
    };
    return user;
  }
};

var allUsersColumn1 = (users) => {
  var content = ``;

  for (i = 0; i < users.length; i++) content += `${users[i].name}\n`;
  return content;
};

var allUsersColumn2 = (users) => {
  var content = ``;

  for (i = 0; i < users.length; i++)
    content += `${new Intl.NumberFormat().format(
      users[i].totalXp
    )} (${new Intl.NumberFormat().format(users[i].level)})\n`;
  return content;
};

var allUsersColumn3 = (users) => {
  var content = ``;

  for (i = 0; i < users.length; i++)
    content += `${new Intl.NumberFormat().format(users[i].lover)}\n`;
  return content;
};

module.exports = {
  commands: "data",
  expectedArgs: "<action> <targetType> [target] [attribute]",
  minArgs: 2,
  maxArgs: 50,
  cooldown: 1,
  callback: async (message, arguments, text, client) => {
    var { guild, guildId = guild.id, channel, member } = message;
    const emojis = await require("../utils/emojis").guildEmojis(
      client,
      guildId
    );
    const logiEmojis = await require("../utils/emojis").logibotEmojis(client);
    switch (arguments[0]) {
      case "get":
        switch (arguments[1]) {
          case "entity":
            switch (arguments[2]) {
              case "@a":
                if (arguments[3]) {
                } else {
                  let usersBad = [];
                  var needed;
                  await guild.members.fetch().then(async (members) => {
                    const promises = [];
                    members.forEach((member) => {
                      promises.push(getUserData(guildId, member));
                    });
                    usersBad = await Promise.all(promises);
                  });
                  let users = usersBad.filter((user) => user !== undefined);
                  const embed = new Discord.MessageEmbed().setTitle(
                    `Información de todos los miembros de ${guild.name}`
                  );
                  users.forEach((user) => {
                    needed = Math.floor(Math.pow(user.level, 2.5) * 10);
                    var _member = guild.members.cache.get(user.userId);
                    embed
                      .addField(
                        `__${_member.displayName} (${user.name})__`,
                        `Fecha de unión: **${_member.joinedAt
                          .toLocaleString("es-ES")
                          .replace(" ", " - ")}**\nNivel: **${
                          user.level
                        }**\nTotal XP: **${
                          user.totalXp
                        }**XP - Siguiente nivel (${user.level + 1}): **${
                          user.xp
                        } / ${needed}**XP **(${
                          user.xp / needed
                        }%)**\nParejas: **${user.lover}**`
                      )
                      .setColor("#DF5FFF");
                  });
                  channel.send(embed);
                }
                break;
              case "@e":
                break;
            }
            break;
          case "server":
            if (arguments[2]) {
              switch (arguments[2]) {
                case "emojis":
                  var emojiString = "";
                  for (let emoji in emojis) {
                    emojiString += `${emojis[emoji]}`;
                  }
                  channel.send(emojiString);
                  break;
              }
            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`Información del servidor ${guild.name}`)
                .addFields(
                  {
                    name: "Servidor",
                    value: `Id: **${
                      guild.id
                    }**\nFecha creación: **${guild.createdAt
                      .toLocaleString("es-ES")
                      .replace(" ", " - ")}****\nDescripción: **${
                      guild.description ? guild.description : ""
                    }**\nPropietario: **${guild.owner.displayName}** (${
                      guild.owner.user.username
                    })\nEstado: **${
                      guild.verified ? "Verificado" : "No verificado"
                    }**\n`,
                  },
                  {
                    name: "Miembros",
                    value: `Nº Miembros: **${guild.memberCount}**\n`,
                    inline: true,
                  }
                )
                .setColor("#DF5FFF")
                .setThumbnail(guild.iconURL());
              channel.send(embed);
            }
            break;
          default:
            channel.send(
              `**${message.member.displayName}**, los tipos de objeto son **entity** y **server**`
            );
        }
        break;
      case "set":
        if (member.hasPermission("ADMINISTRATOR")) {
          switch (arguments[1]) {
            case "entity":
              switch (arguments[2]) {
                case "@a":
                  if (arguments[3]) {
                    switch (arguments[3]) {
                      case "name":
                        if (arguments[4]) {
                          for (var i = 0; i < 4; i++) arguments.shift();
                          let name = arguments.join(" ");
                          await guild.members.fetch().then(async (members) => {
                            members = members.filter(
                              (m) =>
                                m.id !== guild.ownerID &&
                                m.id !== client.user.id
                            );
                            const promises = [];
                            members.forEach((member) => {
                              promises.push(
                                member.setNickname(
                                  name.startsWith("reset") ? "" : name
                                )
                              );
                            });
                            await Promise.all(promises);
                          });
                        } else {
                          channel.send(
                            `**${message.member.displayName}**, especifica un nombre a poner`
                          );
                        }
                        break;
                    }
                  } else {
                  }
                  break;
              }
              break;
          }
        } else {
          channel.send(
            `**${message.member.displayName}**, necesitas ser Administrador`
          );
        }
        break;
      default:
        channel.send(
          `**${message.member.displayName}**, las acciones a realizar son **set** y **get**`
        );
    }
  },
};
