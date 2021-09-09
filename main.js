const {Intents, Client, Collection} = require('discord.js');
const client = new Client({partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"], intents: 32767});

client.commands = new Collection();

module.exports = client;

['command', 'event', 'antiCrash'].forEach(handler => {
    require(`./handler/${handler}`)(client);
})

client.login(process.env.TOKEN);