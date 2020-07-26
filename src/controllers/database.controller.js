import banDB from '../../db/users.ban.json';
import warnsDB from '../../db/users.warns.json'
import notifiersDB from '../../db/users.notify.json';

import fs from 'fs';
import path from 'path';

export default class Database {

    static bans = banDB;
    static warns = warnsDB;
    static notifies = notifiersDB;


    static save() {
        return this.saveBans() && this.saveWarns();
    }

    static saveBans() {
        return fs.writeFileSync(path.join("db", "users.ban.json"), JSON.stringify(this.bans, undefined, 4), { encoding: 'utf-8' });
    }

    static saveWarns() {
        return fs.writeFileSync(path.join("db", "users.warns.json"), JSON.stringify(this.warns, undefined, 4), { encoding: 'utf-8' });
    }

    static saveNotifiers() {
        return fs.writeFileSync(path.join("db", "users.notify.json"), JSON.stringify(this.notifies, undefined, 4), { encoding: 'utf-8' });
    }

    static createBan(thBan) {
        if (!this.bans.join("||").includes(thBan.id)) this.bans.push(thBan);
        return this.saveBans();
    }

    static createWarn(thWarn) {
        this.warns.push(thWarn);
        return this.saveWarns();
    }

    static warnsSize(id) {
        const userWarn = this.warns.find(ch => ch.id === id);
        return userWarn.warns.length;
    }

    static updateWarn(warn, id) {
        const userWarn = this.warns.find(ch => ch.id === id);
        userWarn.warns.push(warn);
        return this.saveWarns();
    }

    static addUserToNotifier(user, id) {
        if (!this.notifies[id].find((u) => u.id === user.id)) this.notifies[id].push(user);
        this.saveNotifiers();
    }

    static removeUserFromNotifier(user, id) {
        var newNotifier = this.notifies[id].filter((users) => { return users.id !== user.id });
        this.notifies[id] = newNotifier;
        this.saveNotifiers();
    }
}