//here the event starts
const config = require("../../botconfig/config.json")
const { change_status } = require("../../handlers/functions");

module.exports = client => {
    //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
    //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
    try {
        try {
            const stringlength = 32;
            console.log("\n" +
                `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen + "\n" +
                `┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen + "\n" +
                `┃ `.bold.brightGreen + `   Discord Bot is online`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `   Discord Bot is online`.length) + "┃".bold.brightGreen + "\n" +
                `┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` /--/ ${client.user.tag} /--/`.length) + "┃".bold.brightGreen + "\n" +
                `┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen + "\n" +
                `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        } catch { /* */ }
        change_status(client);
        //loop through the status per each 5 minutes
        setInterval(() => {
            change_status(client);
        }, 5 * 1000);

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}