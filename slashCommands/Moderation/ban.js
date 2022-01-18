const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "ban",
    description: "Bans a user from the server",
    category: "Moderation",
    cooldown: 2,
    memberpermissions: ["BAN_MEMBERS"],
    options: [
        {
            "User": {
                name: "user",
                description: "User to Ban.",
                required: true
            }
        },
        {
            "String": {
                name: "reason",
                description: "Reason of Ban",
                required: true
            }
        },
        {
            "Integer": {
                name: "messages",
                description: "Number of days that messages will be deleted",
                required: false,
                choices: [{
                    name: "Don't Delete Any",
                    value: "0"
                },
                {
                    name: "Delete Up To Seven Days",
                    value: "7"
                }
                ]
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const options = interaction.options
            const target = options.getMember("user");

            if (target.id === interaction.member.id)
                return interaction.reply({
                    embeds: [new MessageEmbed().setTitle("❌ Error ❌").setColor(embed.errColor)
                        .setDescription("Why Are You Trying To Ban Yourself??").setTimestamp()
                    ],
                    ephemeral: true
                });

            if (target.permissions.has("BAN_MEMBERS"))
                return interaction.reply({
                    embeds: [new MessageEmbed().setColor(embed.errColor).setDescription("❌ You Can't Ban An Admin ❌")]
                });

            const reason = options.getString("reason");

            if (reason.length > 512)
                return interaction.reply({
                    embeds: [new MessageEmbed().setTitle("❌ Can't Run Code With The Strings Given ❌").setColor(embed.errColor)
                        .setDescription("Reason Can't Be More Than 512 Characters").setTimestamp()
                    ],
                    ephemeral: true
                });

            target.send(
                new MessageEmbed()
                    .setTitle(`You've been Banned from ${interaction.guild.name}!`)
                    .setColor(embed.errColor)
                    .setTimestamp()
                    .addFields({
                        name: "Reason For Ban:",
                        value: reason
                    }, {
                        name: "Banned By:",
                        value: interaction.member.user.tag
                    })
            )

            const Amount = options.getInteger("messages")

            target.ban({
                days: Amount,
                reason: reason
            })

            interaction.reply({
                embeds: [new MessageEmbed().setColor(embed.okColor).setDescription(`🟢 **${target.user.username}** Has Been Banned From ${interaction.guild.name} 🟢`)],
                ephemeral: true
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}