const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const fs = require('fs');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    /* // Music player events 
    fs.readdir('./player-events/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`../player-events/${file}`);
            let eventName = file.split(".")[0];
            console.log(`Loading player event ${eventName}`);
            client.player.on(eventName, event.bind(null, client));
        });
    });
    */

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/commandsSlash/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });

    client.on("ready", async () => {
        // Reset then register for a single guild
        // await client.guilds.cache.get('guildid').commands.set([]);
        // await client.guilds.cache
        //    .get("replace this with your guild id")
        //    .commands.set(arrayOfSlashCommands);

        // Reset then register for all the guilds the bot is in
        await client.application.commands.set([]);
        await client.application.commands.set(arrayOfSlashCommands);
    });
}