const fs = require("fs");
const allevents = [];
module.exports = async (client) => {
    try {
        try {
            const stringlength = 30;
            console.log("\n" +
            `┏━━━━━━━━━━━━━━━━━┓`.bold.brightGreen + "\n" +
            `┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen + "\n" +
            `┃ `.bold.brightGreen + ` COMMAND HANDLER`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` COMMAND HANDLER`.length) + "┃".bold.brightGreen + "\n" +
            `┃ `.bold.brightGreen + `/-/ Discord: Jed556#4147 /-/`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `/-/ By Discord: Jed556#4147 /-/`.length) + "   ┃".bold.brightGreen + "\n" +
            `┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen + "\n" +
            `┗━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        } catch (e) {
            console.log(e)}
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
        await ["client", "guild"].forEach(e => load_dir(e));
        console.log(`\n${amount} Events Loaded`.brightGreen);
        try {
            const stringlength2 = 30;
            console.log("\n" +
            `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow + "\n" +
            `┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow + "\n" +
            `┃ `.bold.yellow + ` Logging into the BOT...`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length - ` Logging into the BOT...`.length) + "┃".bold.yellow + "\n" +
            `┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow + "\n" +
            `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
        } catch {
            /* */ }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};