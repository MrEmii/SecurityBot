export default class MessageController {

    constructor() {
        this.channelRegx = /(?:spam?)/gi;
        this.reqRegx = /(?:boxfight?|midgame|zonewars|playground)/gi;
        this.messagesRegx = /.*(\d+.*\w+.*\d+).*/gi;
        this.urlRegx = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])+.*/gi;
        this.emojiRegx = /(?:(?:boxfight|midgame|playground|buscarequipo|zonewars))/gi;
    }

    controlMessage(user, message) {
        return new Promise((resolve, reject) => {
            if (message.channel.name.match(this.reqRegx)) {
                if (message.content.match(this.messagesRegx) && !message.content.match(this.urlRegx)) {
                    //console.log(message.url);
                    resolve({
                        success: {
                            game: message.channel.name,
                            user: { name: user.username, avatar: user.avatarURL({ format: 'png', size: 64 }), url: message.url }
                        }
                    })
                } else {
                    resolve({ error: `Mal uso del canal ${message.channel.name}` })
                }
            } else if (message.channel.name.match(this.channelRegx)) {
                if (message.content.match(this.urlRegx)) {
                    console.log("URL");
                } else {
                    resolve({ error: "Uso no correspondido con el canal." })
                }
            }
        })
    }
}