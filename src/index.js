import { Client, MessageEmbed, Permissions } from 'discord.js';
import Configurations from './configuration/Configurations.js';
import UsersManagments from './controllers/users.controller.js';
import MessageController from './controllers/messages.controller.js';
import Database from './controllers/database.controller.js';
import NotifierController from './controllers/notify.controller.js';

const keys = new Configurations();
const bot = new Client();
const manager = new UsersManagments(keys.yunitaApiKey, keys.guildID)
const messager = new MessageController();

bot.on("ready", () => {
    console.log("Iniciando bot");
    init().then(() => {
        console.log("Bot conectado");
    })
});

bot.on("message", (message) => {
    var user = { user: message.author, member: message.member };

    if (!user.user.bot && message.deletable) {
        messager.controlMessage(user.user, message).then(msg => {
            if (msg.error) {
                message.reply(`${msg.error}. Tienes ${Database.warnsSize(user.user.id)} advertencias!`).then(() => {
                    addWarn(user, { reason: msg.error, pardonDate: undefined }, message.channel.name)
                    message.delete();
                })
            } else if (msg.success) {
                NotifierController.alertToDM(msg.success, bot)
            }
        })
    }
});

bot.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.name === "activar-notificaciones" && !user.bot) {
        if (reaction._emoji.name.match(messager.emojiRegx)) {
            Database.addUserToNotifier({ id: user.id, username: user.username }, reaction._emoji.name);
        } else {
            reaction.remove();
        }
    }
})
bot.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.name === "activar-notificaciones" && !user.bot) {
        if (reaction._emoji.name.match(messager.emojiRegx)) {
            Database.removeUserFromNotifier({ id: user.id, username: user.username }, reaction._emoji.name);
        }
    }
})

function init() {
    return new Promise((resolve, reject) => {
        bot.guilds.cache.map((g) => {
            const channel = g.channels.cache.find(ch => ch.name === 'activar-notificaciones');
            if (!channel) return;
            let boxEmoji = g.emojis.cache.get('736954470692290560');
            let midEmoji = g.emojis.cache.get('736954535527972915');
            let zwEmoji = g.emojis.cache.get('736954643514392586');
            let beEmoji = g.emojis.cache.get('736954736493854831');
            let playgroundEmoji = g.emojis.cache.get('736954688980910091');
            const embed = new MessageEmbed()
                .setTitle("Activar notificaciones!")
                .setDescription(`Si quieres recibir notificaciones reacciona con el emoji indicado!`)
                .addField("BoxFight: ", boxEmoji)
                .addField("MidGame: ", midEmoji)
                .addField("ZoneWars: ", zwEmoji)
                .addField("Playground: ", playgroundEmoji)
                .addField("Busco equipo: ", beEmoji)
                .setColor("GREEN")
            channel.bulkDelete(5, true)
            channel.send(embed).then((async msg => {

                await msg.react(boxEmoji);
                await msg.react(midEmoji);
                await msg.react(zwEmoji);
                await msg.react(playgroundEmoji);
                await msg.react(beEmoji);

                resolve();
            }))
        })

    })
}

function banMessage(user, reason, channels) {
    const channel = channels.find(ch => ch.name === 'reportes');
    if (!channel) return;

    manager.getBanImage({ username: user.username, avatar: user.avatarURL({ format: 'png', size: 1024 }) }, reason, new Date().toLocaleDateString()).then((file) => {
        const embed = new MessageEmbed()
            .setTitle("Baneo detectado")
            .setDescription(`Se baneó al usuario ${user.username}`)
            .setFooter(`Razón del baneo: ` + reason)
            .setColor(0xFF1744)
            .attachFiles(file);
        channel.send(embed);
    })

}

function warnMessage(user, reason, channels) {
    const channel = channels.find(ch => ch.name === 'reportes');
    if (!channel) return;

    manager.getBanImage({ username: user.username, avatar: user.avatarURL({ format: 'png', size: 1024 }) }, reason, new Date().toLocaleDateString()).then((file) => {
        const embed = new MessageEmbed()
            .setTitle("Advertencia detectada")
            .setDescription(`Se advirtió al usuario ${user.username}`)
            .setFooter(`Razón: ` + reason)
            .setColor(0xFF1744)
        channel.send(embed);
    })
}

function addBan(user, reason) {
    if (manager.addBan({ id: user.user.id, username: user.user.username, reason })) {
        user.member.ban({
            reason: reason,
        }).then(() => {
            banMessage(user.user, reason, bot.channels.cache)
        }).catch(err => {
            message.reply('No se puede banear al usuario ' + user.user.username);
            console.error(err);
        });
    }
}

function addWarn(user, warn, channel) {
    manager.addWarn(user.user, warn, channel, undefined).then(code => {
        switch (code.code) {
            case 1:
                warnMessage(user.user, warn.reason, bot.channels.cache);
                break;
            case 2:
                warnMessage(user.user, warn.reason, bot.channels.cache);
                break;
            case 3:
                addBan(user, "Acumulación de advertencias.");
                break;
            default:
                break;
        }
    })
}

bot.login(keys.bot);