var emojis = [
	'😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑'
];


//siber
module.exports = (client) => {
    client.on("message", async (message) => {
        if(message.member.id === "458738156695584770" && message.content.toLowerCase().includes(["sisplau","sisp","sispi"])){
            message.reply("sisplau😜")
        }
        else if(message.member.id === "458738156695584770"){
            message.react(emojis[Math.floor(Math.random() * emojis.length)])
        }

    })
}