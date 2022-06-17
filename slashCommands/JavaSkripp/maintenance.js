const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "maintenance",
    description: "Toggles maintenance mode",
    category: "JavaSkripp",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [config.ownerID],

    run: async (client, interaction) => {
        try {
            let mtStat;
            if (client.maintenance) {
                client.maintenance = false;
                mtStat = "OFF";
            } else {
                client.maintenance = true;
                mtStat = "ON";
            }
            interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.color)
                    .setAuthor("maintenance.js", client.user.displayAvatarURL())
                    .setDescription(`**Maintenance Status**\nStatus: \`${mtStat}\``)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}