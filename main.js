const {Intents, Client, Collection} = require('discord.js');
const client = new Client(
    {partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"],
    intents: 
    [   Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES
    ],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false,
    },
    }
);


client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

module.exports = client;

require("./handler/commandHandler")(client);

client.login(client.config.DISCORD_TOKEN);