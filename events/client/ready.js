//here the event starts
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Discord = require("discord.js");
const { change_status } = require("../../handlers/functions");
const settings = require("../../botconfig/settings.json")
const config = require("../../botconfig/config.json")
const ee = require("../../botconfig/embed.json")
let os = require("os");

module.exports = async (client) => {
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
        } catch { }
        const attachment = new MessageAttachment("icon/Online.png")
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.okColor)
                    .setAuthor(`${client.user.username.toUpperCase()} ONLINE`, "attachment://Online.png")
                    .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
                    .addField("🤖 Node", `\`${process.version}\``, true)
                    .addField("\u200b", `\u200b`, true)
                    .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
                    .addField(`⚙ Loaded`, `\`${client.slashCommands.size} Commands\``, true)
                    .addField("\u200b", `\u200b`, true)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ], files: [attachment]
            });
        });
        change_status(client);
        //loop through the status per each 10 minutes
        setInterval(() => {
            change_status(client);
        }, 10 * 1000);

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}