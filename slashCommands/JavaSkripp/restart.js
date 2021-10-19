const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");
const { errDM } = require("../../handlers/functions");
var Heroku = require("heroku-client");
var token = config.herokuToken;
var appName = config.herokuApp;
var dynoName = config.herokuDyno;

module.exports = {
    name: "restart",
    description: "Perform JavaSkripp global restart",
    category: "JavaSkripp",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [settings.ownerID],
    options: [
        {
            "Integer": {
                name: "countdown",
                description: "Enter countdown before restarting (seconds)",
                required: false
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const cd = interaction.options.getInteger("countdown");
            if (cd) {
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.color)
                        .setDescription(`Restarting Host in ${cd} secs`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })
                setTimeout(async () => {
                    try {
                        var heroku = new Heroku({ token: token });
                        heroku.delete('/apps/' + appName + '/dynos/' + dynoName)
                            .then(x => console.log(x));
                    } catch { }
                }, cd * 1000);
            }
            else {
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.color)
                        .setDescription("Restarting Host...")
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })
                try {
                    var heroku = new Heroku({ token: token });
                    heroku.delete('/apps/' + appName + '/dynos/' + dynoName)
                        .then(x => console.log(x));
                } catch { }
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}