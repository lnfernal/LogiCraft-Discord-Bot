const channelsId = [
    "730742558556291173",
]

const addReactions = async (message, reactions) => {
    message.react(reactions.upvote.id)
    message.react(reactions.downvote.id)

    // bully bedrock
    if(!message.content.includes("Java")){
        message.react(reactions.kekwPurple.id)
    }
}

const reactToPrevMsg = async (client, reactions) => {
    for(const id of channelsId){
        const channel = await client.channels.fetch(id)

        channel.messages.fetch().then((messages) => {
            for(const message of messages){
                addReactions(message[1], reactions)
            }
        })
    }
} 

module.exports = (client, reactions) => {  
    //reactToPrevMsg(client, reactions)

    client.on("message", async (message) => {
        if(channelsId.includes(message.channel.id)){
            addReactions(message, reactions)
        }
    })
}