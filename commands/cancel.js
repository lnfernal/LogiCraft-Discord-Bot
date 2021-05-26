module.exports = {
 commands: "cancel",
 permissions: "ADMINISTRATOR",
 permissionError = "Solo un Administrador puede cancelar el reset de un server",
 callback: async (message, arguments, text, client) => {
   require("./troll.js").cancel()
  message.channel.send("Cancelado")
 }
}
