var loveSentences = [
  "salgamos juntos, yo invito a los besos",
  "me robó un beso y yo sentí que me robó mi alma",
  "vayas donde vayas, ve con todo tu corazón",
  "me quiere, no me hiere. Me hiere, no me quiere",
  "te mereces ser amado",
  "el cerebro es el órgano más incomprensible del mundo. Trabaja 24/7, 365 desde que naces hasta que te enamoras",
  "soy tuyo. No se aceptan devoluciones",
  "sí, tengo la mente sucia. Y ahora mismo, tu estás en ella. Desnudo, por supuesto",
  "¿Me quieres?\nA - Sí\nB - A\nC - B\n",
];

var loveEmojis = [
  "💌",
  "💕",
  "🥰",
  "🌷",
  "💖",
  "😍",
  "💘",
  "😘",
];

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

      coupleAnn = `__<3 Pareja del día <3:__\n**${arr[0].displayName} + ${
        arr[1].displayName
      } =  ${loveEmojis[Math.floor(Math.random() * loveEmojis.length)]}**`;
      coupleSentence = `**${arr[lover1].displayName} a ${
        arr[lover2].displayName
      }:** _"${
        loveSentences[Math.floor(Math.random() * loveSentences.length)]
      }  ${loveEmojis[Math.floor(Math.random() * loveEmojis.length)]}"_`;
      message.channel.send(`.\n${coupleAnn}\n\n${coupleSentence}`);
    });
  },
};
