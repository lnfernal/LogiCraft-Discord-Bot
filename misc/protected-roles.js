module.exports = (message, member, protectedRoles) => {
  // ensure protected roles are protected :p
  for (const protectedRole of protectedRoles) {
    const role = message.guild.roles.cache.find(role => role.id === protectedRole)

    if (!role || member.roles.cache.has(role.id)) {
      message.channel.send(
        `**${message.member.displayName}**, no puedes ejecutar este comando sobre alguien con el rol de **"${role.name}"**`
      )
      return false
    }
  }
  return true
}
