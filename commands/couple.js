const Discord = require("discord.js");
const coupleSchema = require("../schemas/couple-schema.js");
const profileSchema = require("../schemas/profile-schema.js");
const mongo = require("../utils/mongo.js");
const guildId = "666295714724446209";

const loveSentences = [
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

const loveEmojis = ["💌", "💕", "🥰", "🌷", "💖", "😍", "💘", "😘"];

checkDaily = async (coupleData) => {
  const lastCouple = new Date(coupleData.updatedAt).toDateString();
  const now = new Date().toDateString();

  if (lastCouple !== now) return true;
  return true;
};

module.exports = {
  commands: "couple",
  maxArgs: 0,
  callback: async (message, arguments, text, client) => {
    const guildId = message.guild.id;
    checkDaily(await coupleSchema.findOne({ _id: "0" })).then(
      async (coupleAvbl) => {
        if (!coupleAvbl) {
          message.channel.send("Ya se ha reclamado la pareja de hoy");
          return;
        }
        const guild = message.guild;
        await guild.members.fetch().then(async (members) => {
          var arr = [];
          members = members.filter((m) => !m.user.bot)
            .array();
          if (members.length < 2)
            message.channel.send(
              "No hay suficientes jugadores para elegir pareja :c"
            );
          while (arr.length < 2) {
            var r = Math.floor(Math.random() * members.length);
            if (!arr.includes(members[r])) arr.push(members[r]);
          }
          var lover1 = Math.floor(Math.random() * 2);
          var lover2 = lover1 == 0 ? 1 : 0;

          coupleAnn = `${
            loveEmojis[Math.floor(Math.random() * loveEmojis.length)]
          }  Pareja del día:`;
          coupleSentence = `**${arr[lover1].displayName} a ${
            arr[lover2].displayName
          }:** _"${
            loveSentences[Math.floor(Math.random() * loveSentences.length)]
          }  ${loveEmojis[Math.floor(Math.random() * loveEmojis.length)]}"_`;

          // add lover punctuation
          await profileSchema
            .findOneAndUpdate(
              {
                guildId,
                userId: arr[lover1].id,
              },
              { $inc: { lover: 1 }, name: arr[lover1].user.username },
              {
                upsert: true,
                new: true,
              }
            )
            .then(async (result) => {
              if (!result) {
                await new profileSchema({
                  name: arr[lover1].user.username,
                  guildId,
                  userId: arr[lover1].id,
                  lover,
                }).save();
              }
            });
          await profileSchema
            .findOneAndUpdate(
              {
                guildId,
                userId: arr[lover2].id,
              },
              { $inc: { lover: 1 }, name: arr[lover2].user.username },
              {
                upsert: true,
                new: true,
              }
            )
            .then(async (result) => {
              if (!result) {
                await new profileSchema({
                  name: arr[lover2].user.username,
                  guildId,
                  userId: arr[lover2].id,
                  lover,
                }).save();
              }
            });

          const embed = new Discord.MessageEmbed()
            .setColor("#ff66ff")
            .setTitle(coupleAnn)
            .setDescription(
              `**${arr[0].displayName} + ${arr[1].displayName} =  ${
                loveEmojis[Math.floor(Math.random() * loveEmojis.length)]
              }**\n\n${coupleSentence}`
            );
          message.channel.send(embed);
        });
        await coupleSchema.findOneAndUpdate(
          { _id: "0" },
          { _id: "0" },
          { upsert: true }
        );
      }
    );
  },
};
