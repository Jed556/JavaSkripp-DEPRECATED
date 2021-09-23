const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");

module.exports = {
    name: "send",
    description: "Send a direct message to a user",
    category: "Message",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [settings.ownerID],
    options: [
        {
            "String": {
                name: "user",
                description: "Enter user tag (ex. Gatorade#4147)",
                required: true
            }
        },
        {
            "String": {
                name: "message",
                description: "Enter message",
                required: true
            }
        },
        {
            "String": {
                name: "file",
                description: "Enter file url",
                required: false
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const Message = interaction.options.getString("message")
            const Target = interaction.options.getString("user")
            const File = interaction.options.getString("file")
            const tag = ["#", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            const { displayAvatarURL } = await client.fetchUser(Target).catch(console.error);

            if (tag.some(v => Target.includes(v))) {
                const userID = client.users.cache.find(u => u.tag === Target).id
                client.users.fetch(userID, false).then((user) => {
                    user.send({
                        embeds: [new MessageEmbed()
                            .setTimestamp()
                            .setColor(ee.color)
                            .addField(`Message:`, `${Message ? `> ${Message}` : "\u200b"}`)
                            .setImage(`${File ? `${File}` : ""}`)
                            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                        ]
                    });
                });
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.color)
                        .addField(`Sent Message:`, `${Message ? `> ${Message}` : "\u200b"}`)
                        .setImage(`${File ? `${File}` : ""}`)
                        .setAuthor(Target, displayAvatarURL)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })

            } else return interaction.reply("Please enter the user tag (ex. Gatorade#4147)");

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}