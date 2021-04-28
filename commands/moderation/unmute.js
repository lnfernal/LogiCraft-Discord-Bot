const muteSchema = require("../../schemas/mute-schema.js");

module.exports.triggerUnmute = async (member) => {
  await unmute(member);
};

const unmute = (member) => {
  const rolesBackup = require("./mute.js").rolesBackup();
  rolesBackup.forEach(async (roles) => {
    if (roles.id == member.id) {
      await member.roles.set([]);
      await member.roles.set(roles.roles);
      rolesBackup.splice(rolesBackup[roles], 1);
    }
  });
};

module.exports = {
  commands: "unmute",
  expectedArgs: "<user|id>",
  minArgs: 1,
  maxArgs: 1,
  permissions: ["MANAGE_ROLES"],
  callback: async (message, arguments, text, client) => {
    const { guild, channel } = message;
    const target = message.mentions.users.first();
    let id;
    if (!target) id = arguments[0];
    else id = target.id;
    const result = await muteSchema.updateOne(
      {
        guildId: guild.id,
        userId: id,
        current: true,
      },
      {
        current: false,
      }
    );
    if (result.nModified == 1) {
      unmute((await guild.members.fetch()).get(target.id));
      channel.send(`${id} ha sido desmuteado`);
    } else {
      channel.send(`${id} no está muteado`);
    }
  },
};
