const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "say",
    description: "Says something in the current channel",
    category: "JavaSkripp",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [config.ownerID],
    options: [
        {
            "String": {
                name: "message",
                description: "Enter message",
                required: true
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const message = interaction.options.getString("message")
            try {
                interaction.channel.send({ content: message });
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.okColor)
                        .addField(`Message:`, `${message ? `> ${message}` : "\u200b"}`)
                        .setAuthor("MESSAGE SENT", interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })
            } catch {
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.errColor)
                        .addField(`Unsent Message:`, `${message ? `> ${message}` : "\u200b"}`)
                        .setAuthor("ERROR SENDING", interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}