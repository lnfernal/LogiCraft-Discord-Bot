var emojis = [
    '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑'
];


module.exports = async (client) => {
    client.on("message", async (message) => {
        if (message.member.id === "458738156695584770" && message.content.toLowerCase().includes("sispi")) {
            message.channel.send(`${message.member.displayName}, deja a Sisplau. Aviso. Desplegaré mis armas`)
        }
        else if (message.member.id === "null") {
            for (i = 0; i < 10; i++) {
                await message.react(emojis[Math.floor(Math.random() * emojis.length)])
            }
        }

    })
}