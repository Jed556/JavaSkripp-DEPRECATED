const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "kick",
    description: "Kicks a user from the server",
    category: "Moderation",
    cooldown: 2,
    memberpermissions: ["KICK_MEMBERS"],
    options: [
        {
            "User": {
                name: "user",
                description: "User to Kick.",
                required: true
            }
        },
        {
            "String": {
                name: "reason",
                description: "Reason of Kick",
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
                    embeds: [new MessageEmbed().setTitle("❌ Error ❌").setColor(ee.errColor)
                        .setDescription("Why Are You Trying To Kick Yourself??").setTimestamp()
                    ],
                    ephemeral: true
                });

            if (target.permissions.has("KICK_MEMBERS"))
                return interaction.reply({
                    embeds: [new MessageEmbed().setColor(ee.errColor).setDescription("❌ You Can't Kick An Admin ❌")]
                });


            const reason = options.getString("reason");

            if (reason.length > 512)
                return interaction.reply({
                    embeds: [new MessageEmbed().setTitle("❌ Can't Run Code With The Strings Given ❌").setColor(ee.errColor)
                        .setDescription("Reason Can't Be More Than 512 Characters").setTimestamp()
                    ],
                    ephemeral: true
                });

            const DMEmbed = new MessageEmbed()
                .setTitle(`You've been Kicked from ${interaction.guild.name}`)
                .setColor('RED')
                .setTimestamp()
                .addFields({
                    name: "Reason:",
                    value: reason
                }, {
                    name: "Kicked By:",
                    value: interaction.member.user.tag
                });

            await target.send({
                embeds: [DMEmbed]
            }).catch((err) => {
                console.log(err)
            });

            const Amount = options.getInteger("messages");

            target.kick({
                days: Amount,
                reason: reason
            })

            interaction.reply({
                embeds: [new MessageEmbed().setColor(ee.okColor).setDescription(`🟢 **${target.user.username}** Has Been Kicked From ${interaction.guild.name} 🟢`)],
                ephemeral: true
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}