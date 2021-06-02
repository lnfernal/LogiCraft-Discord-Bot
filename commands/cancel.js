module.exports = {
  commands: "cancel",
  permissions: "ADMINISTRATOR",
  permissionError: "Solo un Administrador puede cancelar el reset de un server",
  callback: async (message, args, text, client) => {
    require("./troll.js").cancel()
    message.channel.send(`El reset de ${message.guild.name} se ha detenido`)
  },
}
