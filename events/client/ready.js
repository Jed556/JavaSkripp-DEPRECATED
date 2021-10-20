//here the event starts
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { change_status } = require("../../handlers/functions");
const settings = require("../../botconfig/settings.json")
const config = require("../../botconfig/config.json")
const ee = require("../../botconfig/embed.json")
const os = require("os");
const { readdirSync, lstatSync } = require("fs");

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
        var check = [];
        readdirSync(`${__dirname}/../../slashCommands/`).forEach((dir) => {
            if (lstatSync(`${__dirname}/../../slashCommands/${dir}`).isDirectory()) {
                const cmd = readdirSync(`${__dirname}/../../slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
                for (let file of cmd) {
                    check.push(file);
                }
            }
        })
        if (client.slashCommands.size < check.length) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.errColor)
                        .setTitle(`${client.user.username} Online | Loading Error`)
                        .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
                        .addField(`⚙ Loaded`, `\`${client.slashCommands.size} Commands\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            });
            client.user.setActivity(`Redeployment • Load Error`, { type: "WATCHING" });
            client.user.setStatus("dnd");
        } else {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.okColor)
                        .setTitle(`${client.user.username} Online!`)
                        .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
                        .addField(`⚙ Loaded`, `\`${client.slashCommands.size} Commands\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ]
                });
            });
            client.user.setStatus("online");
            change_status(client);
            //loop through the status per each 10 minutes
            setInterval(() => {
                change_status(client);
            }, 10000);
        }
    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}