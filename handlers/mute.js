const muteSchema = require("../schemas/mute-schema.js");
const mutedRoleId = "788187970930343976";

module.exports.scheduledCheck = async (client) => {
  const checkMutes = async () => {
    const now = new Date();
    const conditional = {
      expires: {
        $lt: now,
      },
      current: true,
    };
    const results = await muteSchema.find(conditional);
    if (results && results.length) {
      for (const result of results) {
        const { guildId, userId } = result;
        const guild = client.guilds.cache.get(guildId);
        const member = (await guild.members.fetch()).get(userId);
        await require("../commands/moderation/unmute.js").triggerUnmute(member);
      }
      await muteSchema.updateMany(conditional, {
        current: false,
      });
    }
    setTimeout(checkMutes, 1000 * 60);
  };
  checkMutes();
};

module.exports.checkMute = async (client, member) => {
  const { guild, id } = member;

  const currentMute = await muteSchema.findOne({
    userId: id,
    guildId: guild.id,
    current: true,
  });
  if (currentMute) {
    const role = guild.role.cache.find((role) => {
      return role.id == mutedRoleId;
    });
    if (role) {
      member.roles.add(role);
    }
  }
};
