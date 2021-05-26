module.exports = {
 commands: "cancel",
 callback: async (message, arguments, text, client) => {
   require("./troll.js").cancel()
 }
}
