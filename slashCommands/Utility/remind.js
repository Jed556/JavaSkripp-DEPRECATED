const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "remind",
    description: "Remind's user after a countdown",
    category: "Utility",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "Integer": {
                name: "time",
                description: "Remind after x mins",
                required: true
            }
        },
        {
            "String": {
                name: "description",
                description: "Description of reminder",
                required: false
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const time = interaction.options.getInteger("time");
            const desc = interaction.options.getString("description") || "No Description"

            interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(emb.color).setTimestamp()
                    .setAuthor(interaction.user.tag)
                    .setDescription(`**Reminder Set**`)
                    .addField("Reminder:", desc)
                    .addField("Time:", `${time} minutes`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ], ephemeral: true
            })

            // Sec: x * 1000 // Min: x * 1000 * 60 // Hr: Min: x * 1000 * 60 * 60 //
            await new Promise(r => setTimeout(r, time * 1000 * 60))

            interaction.followUp({
                embeds: [new MessageEmbed()
                    .setColor(emb.color).setTimestamp()
                    .setAuthor(interaction.user.tag)
                    .setDescription(`HEY! <@${interaction.user.id}>`)
                    .addField("Reminder:", desc)
                    .addField("Time:", `${time} minutes`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ], ephemeral: true
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
};