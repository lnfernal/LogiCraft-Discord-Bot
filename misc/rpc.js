module.exports.init = () => {
  var rpc = require("discord-rpc")
  const client = new rpc.Client({ transport: "ipc" })
  client.on("ready", () => {
    client.request("SET_ACTIVITY", {
      pid: process.pid,
      activity: {
        assets: {
          large_image: "Image",
          large_text: "Your Status", // THIS WILL SHOW AS "Playing <Status>" from the outisde
        },
        buttons: [
          {
            label: "V-Bucks gratis 🤑🤑",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO",
          },
        ],
      },
    })
  })
  client.login({ clientId: "829091397906464829" }).catch(console.error)
}
