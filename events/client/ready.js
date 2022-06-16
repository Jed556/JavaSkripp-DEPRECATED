const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { change_status } = require("../../handlers/functions");
const config = require("../../config/client.json")
const emb = require("../../config/embed.json")
const { readdirSync, lstatSync } = require("fs");
const os = require("os");

module.exports = async (client) => {
    //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
    //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
    try {
        client.user.setStatus("dnd");
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
        readdirSync(`${__dirname}/../../commands/`).forEach((dir) => {
            if (lstatSync(`${__dirname}/../../commands/${dir}`).isDirectory()) {
                const cmd = readdirSync(`${__dirname}/../../commands/${dir}/`).filter((file) => file.endsWith(".js"));
                for (let file of cmd) check.push(file);
            }
        })
        let log = new MessageEmbed()
            .setTimestamp()
            .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
            .addField("🤖 Node", `\`${process.version}\``, true)
            .addField("\u200b", `\u200b`, true)
            .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
            .addField(`⚙ Loaded`, `\`${client.slashCommands.size}/${check.length} Commands\``, true)
            .addField("\u200b", `\u200b`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())

        if (client.slashCommands.size < check.length) {
            client.users.fetch(config.ownerID, false).then((user) => {
                user.send({
                    embeds: [log
                        .setColor(emb.errColor)
                        .setTitle(`${client.user.username} | Load Error`)
                    ]
                });
            });
            client.user.setActivity(`Redeploys • ERROR`, { type: "WATCHING" });
        } else {
            client.users.fetch(config.ownerID, false).then((user) => {
                user.send({
                    embeds: [log
                        .setColor(emb.okColor)
                        .setTitle(`${client.user.username} Online!`)
                    ]
                });
            });

            setInterval(() => {
                change_status(client);
            }, 10000); //loop every 10 mins
        }
    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}