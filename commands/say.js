module.exports = {
  commands: "say",
  expectedArgs: "<content>",
  minArgs: 1,
  maxArgs: 199,
  cooldown: 5,
  callback: (message, arguments, text, client) => {
    const matches = text.match(/^<@!?(\d+)>$/)
            if(matches)
              matches.forEach(match => {text.replace(match,"")})
    message.channel.send(text);
  },
};
