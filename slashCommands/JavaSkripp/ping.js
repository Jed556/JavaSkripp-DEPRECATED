const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "ping",
    description: "Pings a user",
    category: "JavaSkripp",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [settings.ownerID],
    options: [
        {
            "User": {
                name: "user",
                description: "Enter countdown before restarting (seconds)",
                required: true
            }
        },
        {
            "Integer": {
                name: "loop",
                description: "Number of pings",
                required: false
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const user = interaction.options.getUser("user");
            const loop = interaction.options.getInteger("loop");
            const replyArray = ["Hey! ", "Oi! ", "Eyyy! ", "Ping! ", "Pong! ", "Pssst! ", "Oy! ", "", "AAAAA "]

            if (user.bot) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setDescription(`${client.allEmojis.x} **You can't ping bots**`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            });

            const ping = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setDescription(`**${replyArray[Math.floor(Math.random() * replyArray.length)]}**${user}`)
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                .setFooter(client.user.username, client.user.displayAvatarURL())

            if (loop > 1) {
                interaction.reply({ embeds: [ping] });
                for (let i = 2; i <= loop; i++) interaction.followUp({
                    embeds: [ping
                        .setDescription(`**${replyArray[Math.floor(Math.random() * replyArray.length)]}**${user}`)]
                });
            } else interaction.reply({ embeds: [ping] });

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}