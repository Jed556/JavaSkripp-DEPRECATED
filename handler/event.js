const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const client = require('../main');

/**
 * 
 * @param {Client} client
 */

module.exports = async (client) => {
    const eventFiles = readdirSync('./events').filter(files => files.endsWith('.js'));
    for(const file of eventFiles) {
        const event = require(`../events/${file}`);
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}