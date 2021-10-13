const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const syntaxCheck = require("syntax-checker-new");

module.exports = {
    name: "analyze",
    description: "Syntax check your javascript code",
    category: "Code",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "code",
                description: "Input your javascript code",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;

            const code = options.getString("code")

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setAuthor("syntaxCheck.js", client.user.displayAvatarURL())

            syntaxCheck.checkSyntaxString(code, "js", function (jscode) {
                if (jscode.passed)
                    interaction.reply({
                        embeds: [embed
                            .setDescription("No Errors Found!")
                        ]
                    });
                else  interaction.reply({
                    embeds: [embed
                        .setDescription(`Error: \n\`\`\`${jscode.error}\`\`\``)
                    ]
                });
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}