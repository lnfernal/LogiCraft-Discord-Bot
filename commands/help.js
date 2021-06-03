require("module-alias/register")
const messageHandler = require("@messages")
const userUtils = require("@user")
const { MessageEmbed } = require("discord.js")
const { Menu } = require("discord.js-menu")

module.exports = {
  commands: "help",
  callback: async (message, args, text, client) => {
    const emojis = await require("@emojis").logibotEmojis(client)
    const { button1, button2, button3, button4, button5, back, exit } = emojis

    let helpMenu = new Menu(
      message.channel,
      message.author.id,
      [
        {
          name: "main",
          content: new MessageEmbed({
            title: `Menú de ayuda ${emojis.lens}`,
            description: `Puedes consultar cualquier función, comando, sistema, etc... del bot usando \`/help\` Haz click en cada una de las reacciones para ver la información correspondiente con ese apartado.`,
            fields: [
              {
                name: `${button1} Cuenta`,
                value: "Todo lo relacionado con los usuarios del servidor",
                inline: false,
              },
              {
                name: `${button2} Comandos`,
                value: "Como funcionan todos los comandos del bot",
                inline: false,
              },
              {
                name: `${button3} Sistemas`,
                value: "Sistemas del bot",
                inline: false,
              },
              {
                name: `${emojis.slimeballRainbow} Créditos`,
                value: "Enlaces, desarrollador...",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${button1.id}`]: "cuenta",
            [`${button2.id}`]: "comandos",
            [`${button3.id}`]: "sistemas",
            [`${emojis.slimeballRainbow.id}`]: "credits",
            [`${exit.id}`]: "delete",
          },
        },
        {
          name: "comandos",
          content: new MessageEmbed({
            title: "Comandos",
            description: `Puedes ver la información de más de 40 comandos que implementa el bot. Cada comando tiene una sintaxis y debe respetarse para que se pueda ejecutar. Ésta está compuesta por el comando en sí \`/ejemplo\`, y a veces seguido de una serie de argumentos. Los argumentos, si los hay, pueden ser obligatorios \`<...>\` u opcionales \`[...]\`. No podrás ejecutar un comando si todos los argumentos obligatiros no están incluídos.\n\nEn los argumentos \`<user>\` puedes dirigirte a un miembro mencionándolo \`@ejemplo\` o escribiendo su nombre \`ejem\`, en cuyo caso el bot buscará el nombre más cercano a tu consulta. En algunos comandos podrás utilizar el ID.`,
            fields: [
              {
                name: `${button1} Comandos diversos`,
                value: `Otros comandos`,
              },
              {
                name: `${button2} Comandos de economía`,
                value: `Comandos relacionados con la economía`,
              },
              {
                name: `${button3} Comandos de niveles`,
                value: `Comandos relacionados con la experiencia`,
              },
              {
                name: `${button4} Comandos de moderación`,
                value: `Funcionamiento de los comandos que ayudan a moderar el servidor`,
              },
              {
                name: `${button5} Comandos de música`,
                value: `Comandos para utilizar el bot en los canales de audio`,
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "main",
            [`${button1.id}`]: "comandosdiversos",
            [`${button2.id}`]: "comandoseconomia",
            [`${button3.id}`]: "comandosniveles",
            [`${button4.id}`]: "comandosmoderacion",
            [`${button5.id}`]: "comandosmusica",
          },
        },
        {
          name: "comandosdiversos",
          content: new MessageEmbed({
            title: "Comandos diversos",
            description: "Comandos variados con muchas funcionalidades distintas.",
            fields: [
              {
                name: "`/activity <watching|listening|playing|streaming> <content>`",
                value: "Cambia el estado del bot",
              },
              {
                name: "`/award <silver|gold|platinum|argentium|ternion>`",
                value: "Dale un award en forma de reacción a un mensaje. Dar un award tiene un precio en monedas",
              },
              {
                name: "`/cancel`",
                value: "Cancela el reset del server",
              },
              {
                name: "`/couple`",
                value:
                  "Elige una pareja de miembros al azar para que pasen el resto de sus días juntos. Solo una vez al día",
              },
              {
                name: "`/coupletop`",
                value: "Consulta un listado con todos los miembros y la cantidad de parejas que han tenido",
              },
              {
                name: "`/dance [uptime(s)]`",
                value: "Envía un mensaje que simulará una persona bailando durante unos segundos o/",
              },
              {
                name: "`/data <action> <targetType> [target] [attribute]`",
                value: "//TODO",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "comandos",
          },
        },
        {
          name: "comandoseconomia",
          content: new MessageEmbed({
            title: "Comandos de economía",
            description: "Comandos relacionados con la economía del servidor.",
            fields: [
              {
                name: "`/balance [user]`",
                value: "Consulta tu cartera o la de otro miembro",
              },
              {
                name: "`/coinadd <user> <amount>`",
                value: "Añade fondos a tu cartera",
              },
              {
                name: "`/shop`",
                value: "Compra bienes",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "comandos",
          },
        },
        {
          name: "comandosniveles",
          content: new MessageEmbed({
            title: "Comandos de niveles",
            description: "Comandos relacionados con el sistema de niveles del servidor.",
            fields: [
              {
                name: "`/xp [user]`",
                value: "Consulta tu experiencia y nivel o la de otro miembro",
              },
              {
                name: "`/xpadd <user> <method> <amount>`",
                value: "Añade experiencia a un miembro por XP, niveles o mensajes",
              },
              {
                name: "`/xptop`",
                value: "Consulta una lista de todos los miembros en orden descendente por XP",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "comandos",
          },
        },
        {
          name: "comandosmoderacion",
          content: new MessageEmbed({
            title: "Comandos de moderación",
            description: "Comandos para moderar el servidor, necesitas el rol de Staff o Mod para utilizarlos.",
            fields: [
              {
                name: "`/ban <user|id> [user]`",
                value: "Banea a un miembro",
              },
              {
                name: "`/pardon <userID>`",
                value:
                  "Desbanea a un miembro. Deberás poner su ID de usuario ya que no puedes mencionar a un miembro que no esté en el servidor",
              },
              {
                name: "`/op <user>`",
                value: "Otorga el rol de Moderador a un miembro",
              },
              {
                name: "`/deop <user>`",
                value: "Quita el rol de Moderador a un miembro",
              },
              {
                name: "`/kick <user>`",
                value: "Expulsa a un miembro",
              },
              {
                name: "`/mute <user> [time] [reason]`",
                value:
                  "Mutea a un miembro para que no pueda mandar mensajes por ningún chat. Puedes hacerlo indefinidamente o por tiempo limitado con un máximo de 24 días",
              },
              {
                name: "`/unmute <user>`",
                value: "Desmutea a un miembro",
              },
              {
                name: "`/statsadd <user> <key> <amount>`",
                value: "Modifica las stats de un miembro",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "comandos",
          },
        },
        {
          name: "comandosmusica",
          content: new MessageEmbed({
            title: "Comandos de música",
            description:
              "Comandos para utilizar el bot en los canales de audio. Permite reproducir el audio de vídeos de Youtube y canciones de Spotify. Necesitas estar en un canal de voz para poder usarlos.",
            fields: [
              {
                name: "`/play <song>`",
                value:
                  "Reproduce un vídeo de Youtube o una cación de Spotify. Puedes pegar el link o escribir el nombre del vídeo",
              },
              {
                name: "`/stop`",
                value: "Detiene el reproductor y echa al bot del canal de audio",
              },
              {
                name: "`/queue <song>`",
                value:
                  "Pon en cola un vídeo de Youtube o una cación de Spotify. Puedes pegar el link o escribir el nombre del vídeo",
              },
              {
                name: "`/getqueue`",
                value: "Consulta la cola de canciones",
              },
              {
                name: "`/clearqueue`",
                value: "Vacía la cola de reproducción",
              },
              {
                name: "`/pause`",
                value: "Pausa la reproducción de audio",
              },
              {
                name: "`/resume`",
                value: "Reanuda la reproducción de audio",
              },
              {
                name: "`/shuffle`",
                value: "Aleatoriza entre canciones de la cola de reproducción",
              },
              {
                name: "`/nowplaying`",
                value: "Informa sobre el audio que se está reproducciendo en el momento",
              },
            ],
          }).setColor("#ff5d8f"),
          reactions: {
            [`${back.id}`]: "comandos",
          },
        },
        {
          name: "credits",
          content: new MessageEmbed({
            title: "Créditos",
            description: `Algunos extras.`,
            fields: [
              {
                name: "Enlaces",
                value: "[Código fuente](https://github.com/mariod8/LogiCraft-Discord-Bot)",
                inline: true,
              },
              {
                name: "Desarrollador",
                value: `${await client.users.fetch("323378898794446850")}`,
                inline: true,
              },
              {
                name: "‏‏‎ ‎",
                value: "‏‏‎ ‎",
              },
            ],
          })
            .setColor("#ff5d8f")
            .setFooter("© LogicraftSMP"),
          reactions: {
            [`${back.id}`]: "main",
          },
        },
      ],
      100000
    )
    helpMenu.start()
  },
}
