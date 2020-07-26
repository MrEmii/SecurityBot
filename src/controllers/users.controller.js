import banModel from '../models/ban.model.js';
import warnModel from '../models/warn.model.js';
import banMessage from '../models/messages.model.js';
import FortniteController from './fortnite.controller.js';
import Database from './database.controller.js';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';

export default class UsersManagment {

    /**
     * 
     * @param {String} yunitaApiKey 
     * @param {String} guildID 
     * @param {Database} db 
     */
    constructor(yunitaApiKey, guildID) {
        this.fortnite = new FortniteController(yunitaApiKey, guildID);
        this.db = Database;
    }

    addBan(userData) {
        //this.yunite.fetchByDiscord(userData.id, (epic) => {            
        //})
        var model = banModel(userData, { hasEpic: false, epicID: "123123", username: "emirchus" });
        return this.db.createBan(model);
    }

    addWarn(userData, warn, channel, own) {
        return new Promise((resolve) => {
            const userWarn = this.db.warns.find(ch => ch.id === userData.id);
            if (userWarn) {
                if (userWarn.warns.length == 3) {
                    this.addBan({ id: userData.id, username: userData.username, reason: warn.reason })
                    resolve({ code: 3 })
                } else {
                    var warnSubModel = {
                        expired: false,
                        warnDate: Date.now(),
                        pardonDate: warn.pardonDate,
                        warnMessage: warn.reason,
                        hasOwn: own == undefined ? false : true,
                        ownID: own == undefined ? undefined : own.id,
                        channel: channel
                    }
                    this.db.updateWarn(warnSubModel, userData.id);
                    resolve({ code: 1 })
                }
            } else {
                var model = warnModel(userData, { hasEpic: true, epicID: "123123", username: "emirchus" }, warn, own, channel);
                this.db.createWarn(model);
                resolve({ code: 1 })
            }
        })
        //this.yunite.fetchByDiscord(userData.id, (epic) => {            
        //})

    }

    getBanImage(user, reason, date) {
        var node = banMessage(user, reason, date)
        return new Promise((resolve) => {
            nodeHtmlToImage({
                html: node
            }).then((a) => {
                resolve(a);
            })
        })
    }

}