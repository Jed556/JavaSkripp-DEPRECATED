const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "send",
    description: "Send a direct message to a user",
    category: "JavaSkripp",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [settings.ownerID],
    options: [
        {
            "String": {
                name: "countdown",
                description: "Enter countdown before restarting",
                required: false
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const cd = interaction.options.getString("countdown");
            if (cd) {
                setTimeout(async () => {
                    try {
                        interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTimestamp()
                                .setColor(ee.color)
                                .setDescription(`Restarting Host in ${secs}`)
                                .setFooter(client.user.username, client.user.displayAvatarURL())
                            ], ephemeral: true
                        })
                    } catch { }
                }, time);
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
            }
        } catch (e) {
            interaction.reply(`No users with tag \`${Target}\` found in mutual servers`)
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}