const channelsId = [
    "730742558556291173",
]

const addReactions = (message) => {
    const reactions = {
        upvote: message.guild.emojis.cache.find(emoji => emoji.name === "upvote"),
        downvote: message.guild.emojis.cache.find(emoji => emoji.name === "downvote"),
        kekwPurple: message.guild.emojis.cache.find(emoji => emoji.name === "kekwPurple")
    }
    message.react(reactions.upvote)
    message.react(reactions.downvote)

    // bully bedrock
    if(message.content.includes("Minecraft - Beta 1.")){
        message.react(reactions.kekwPurple)
    }
}

const reactPreviousMsg = async (client) => {
    for(const id of channelsId){
        const channel = await client.channels.fetch(id)

        channel.messages.fetch().then((messages) => {
            for(const message of messages){
                addReactions(message[1])
            }
        })
    }
} 

module.exports = (client, id) => {
    reactPreviousMsg(client)
    
    client.on("message", message => {
        if(channelsId.includes(message.channel.id)){
            addReactions(message)
        }
    })
}