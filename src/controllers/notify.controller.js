import Database from '../controllers/database.controller.js';
import { Client, MessageEmbed } from 'discord.js';

export default class NotifierController {

    /**
     * 
     * @param {String} game 
     * @param {{name, url}} user 
     * @param {Client} bot 
     */
    static alertToDM({game, user}, bot) {
        var list = Database.notifies[game];
        list.map((users) => {
            const userClient = bot.users.cache.find((u) => u.id == users.id)
            const embed = new MessageEmbed().setTitle("Alguien busca jugar!")
                .setDescription(`Te quieres unir al ${game} de ${user.name}?`)
                .addField("URL:", user.url)
                .setAuthor(user.name, user.avatar, user.url)
                .setColor("GREEN")

            userClient.send(embed);
        })
    }
}