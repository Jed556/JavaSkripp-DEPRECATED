const fs = require("fs");
const emb = require("../botconfig/embed.json");
const allevents = [];

module.exports = async (client) => {
    try {
        try {
            console.log("\n" + `STARTUP IN PROGRESS`.bold.yellow + "\n" + `By: Jed556`.yellow);
        } catch (e) {
            console.log(e)
        }

        let amount = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                    amount++;
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await ["client", "guild", "listener"].forEach(e => load_dir(e));
        console.log("\n" + `${amount} Events Loaded`.brightGreen);

        try {
            const stringlength2 = 30;
            console.log("\n" +
                `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow + "\n" +
                `┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow + "\n" +
                `┃ `.bold.yellow + ` Logging into the BOT...`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length - ` Logging into the BOT...`.length) + "┃".bold.yellow + "\n" +
                `┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow + "\n" +
                `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow + "\n")
        } catch { }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};