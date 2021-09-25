const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");
const { errDM } = require("../../handlers/antiCrash");

module.exports = {
    name: "send",
    description: "Send a direct message to a user",
    category: "Moderation",
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
                name: "image",
                description: "Enter image url",
                required: false
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const Message = interaction.options.getString("message")
            const Target = interaction.options.getString("user")
            const Image = interaction.options.getString("image")
            const tag = ["#", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

            if (Target == client.user.tag) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .addField(`Unsent Message:`, `${Message ? `> ${Message}` : "\u200b"}`)
                    .setImage(`${Image ? `${Image}` : ""}`)
                    .addField(`Reason:`, `You can't use \`/send\` to ${client.user.tag} `)
                    .setAuthor(Target, avatar.displayAvatarURL({ dynamic: true }))
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ], ephemeral: true
            })
            
            if (tag.some(v => Target.includes(v))) {
                const userID = await client.users.cache.find(u => u.tag === Target).id
                const avatar = await client.users.fetch(userID).catch(console.error);

                client.users.fetch(userID, false).then((user) => {
                    user.send({
                        embeds: [new MessageEmbed()
                            .setTimestamp()
                            .setColor(ee.color)
                            .addField(`Message:`, `${Message ? `> ${Message}` : "\u200b"}`)
                            .setImage(`${Image ? `${Image}` : ""}`)
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
                        .setImage(`${Image ? `${Image}` : ""}`)
                        .setAuthor(Target, avatar.displayAvatarURL({ dynamic: true }))
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ], ephemeral: true
                })

            } else return interaction.reply("Please enter the user tag (ex. Gatorade#4147)");
        } catch (e) {
            interaction.reply(`No users with tag \`${Target}\` found`)
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}