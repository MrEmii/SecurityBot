import fetch from 'node-fetch';

export default class FortniteController {

    constructor(apiKey, guildID) {
        this.apiKey = apiKey;
        this.guildID = guildID;
    }
    /**
     * 
     * @param {String} userID 
     * @callback {"found":true,"discordID":"400634396581036035","isLinked":true,"epicID":"89400e04ab8540bbb746a8c1e3f4dc0c","epicDisplayName":"foobar"
     */
    fetchByDiscord(userID) {
        return new Promise((resolve, reject) => {
            fetch(`https://yunite.xyz/api/v2/servers/${this.guildID}/regsys/single/byDiscordID/${userID}`, {
                method: 'GET',
                headers: {
                    "Y-Api-Key": this.apiKey
                }
            }).then((res) => { return res.json() })
                .then(response => {
                    resolve(response);
                }).catch(() => {
                    reject("Undefined error");
                })
        })
    }

}