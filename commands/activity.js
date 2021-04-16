module.exports = {
  commands: "activity",
  expectedArgs: "<viendo|escuchando|jugando|retransmitiendo> <content>",
  minArgs: 2,
  maxArgs: 20,
  cooldown: 2,
  callback: (message, arguments, text, client) => {
    var type, name;

    switch (arguments[0]) {
      case "viendo":
        type = 3;
        break;
      case "escuchando":
        type = 2;
        break;
      case "jugando":
        type = 1;
        break;
      case "retransmitiendo":
        type = 4;
        break;
      default:
        message.channel.send(
          `**${message.member.displayName}**, las acciones disponibles son: **viendo**, **escuchando**, **jugando** y **retransmitiendo**`
        );
        return;
    }
    arguments.shift();
    name = arguments;
    client.user.setPresence({
      activity: {
        name: String(name),
        type: type,
      },
      status: "online",
    });
  },
};