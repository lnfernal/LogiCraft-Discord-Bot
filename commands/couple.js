const Discord = require("discord.js");

var loveSentences = [
  "Salgamos juntos, yo invito a los besos",
  "Me robó un beso y yo sentí que me robó mi alma",
  "Vayas donde vayas, ve con todo tu corazón",
  "Me quiere, no me hiere. Me hiere, no me quiere",
  "Te mereces ser amado",
  "El cerebro es el órgano más incomprensible del mundo. Trabaja 24/7, 365 desde que naces hasta que te enamoras",
  "Soy tuyo. No se aceptan devoluciones",
  "Sí, tengo la mente sucia. Y ahora mismo, tu estás en ella. Desnudo, por supuesto",
  "¿Me quieres?\nA - Sí\nB - A\nC - B\n",
];

var loveEmojis = ["💌", "💕", "🥰", "🌷", "💖", "😍", "💘", "😘"];

module.exports = {
  commands: "couple",
  permissionError: "no tienes permisos",
  maxArgs: 0,
  cooldown: 60 * 60 * 23,
  permissions: [],
  requiredRoles: [],
  callback: async (message, arguments, text, client) => {
    const guild = client.guilds.cache.get("666295714724446209");
    await guild.members.fetch().then((members) => {
      var arr = [];
      members = members.filter((m) => !m.user.bot).array();
      while (arr.length < 2) {
        var r = Math.floor(Math.random() * members.length);
        if (!arr.includes(members[r])) {
          arr.push(members[r]);
        }
      }
      var lover1 = Math.floor(Math.random() * 2);
      var lover2 = lover1 == 0 ? 1 : 0;

      coupleAnn = `__<3 Pareja del día <3:__`;
      coupleSentence = `**${arr[lover1].displayName} a ${
        arr[lover2].displayName
      }:** _"${
        loveSentences[Math.floor(Math.random() * loveSentences.length)]
      }  ${loveEmojis[Math.floor(Math.random() * loveEmojis.length)]}"_`;

      const embed = new Discord.MessageEmbed().setColor("#800080").setTitle(coupleAnn).setDescription(`**${arr[0].displayName} + ${
        arr[1].displayName
      } =  ${loveEmojis[Math.floor(Math.random() * loveEmojis.length)]}**\n\n${coupleSentence}`)
      message.channel.send(embed)
    });
  },
};
