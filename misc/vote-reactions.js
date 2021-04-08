const channelsId = ["730742558556291173"];

const addReactions = async (message, reactions) => {
  await message.react(reactions.upvote.id);
  await message.react(reactions.downvote.id);

  // bully bedrock
  if (!message.content.includes("Java")) {
    await message.react(reactions.kekwPurple.id);
  }
};

const reactToPrevMsg = async (client, reactions) => {
  for (const id of channelsId) {
    const channel = await client.channels.fetch(id);

    await channel.messages.fetch().then((messages) => {
      for (const message of messages) {
        addReactions(message[1], reactions);
      }
    });
  }
};

module.exports = {
  //reactToPrevMsg(client, reactions)

  onMessage: (client, message, reactions) => {
    if (channelsId.includes(message.channel.id)) {
      addReactions(message, reactions);
    }
  },
};
