var emojis = [
    '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑'
];


module.exports = async (client) => {
    client.on("message", async (message) => {

        if (message.content === "/cleanReactions") {
            const channel = await client.channels.fetch("666295715726622752")
            
            await channel.messages.fetch().then((messages) => {
                for (const message of messages) {
                    message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
                }
            })
        }
        if (message.member.id === "458738156695584770" && message.content.toLowerCase().includes("sispi")) {
            message.channel.send(`${message.member.displayName}, deja a sisplau. aviso. desplegaré mis armas`)
        }
        else if (message.member.id === "null") {
            for (i = 0; i < 10; i++) {
                await message.react(emojis[Math.floor(Math.random() * emojis.length)])
            }
        }

    })
}