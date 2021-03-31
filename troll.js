var emojis = [
	'😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑'
];


//siber
module.exports = (client) => {
    client.on("message", async (message) => {
        if(message.member.id === "458738156695584770" && message.content.toLowerCase().includes(["sisplau" || "sisp" || "sispi"])){
            message.channel.send(`${message.member.displayName}, deja a sisplau. aviso. desplegaré mis armas`)
        }
        else if(message.member.id === "355636164897669122"){
            for(i = 0; i < 10; i++){
                message.react(emojis[Math.floor(Math.random() * emojis.length)])
            }
        }

    })
}