const {Client, CommandInteraction, MessageEmbed} = require('discord.js')
const ee = require("../../botconfig/embed.json");

/**
 * 
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "ban",
    description: "Ban a member",
    memberpermissions: ["MANAGE_GUILD"],
    options: [
        {
            "User": {
                name: "target",
                description: "Member to ban",
                required: true,
            }
        },
        {
            "String": {
                name: "reason",
                description: "Provide a reason",
                required: true,
            }
        },
        {
            "String": {
                name: "messages",
                description: "Delete messages",
                required: false,
                choices: [
                    {
                        name:"Don't delete any",
                        value: "0"
                    },
                    {
                        name:"Previous 7 days",
                        value: "7"
                    },
                ]
            }
        },
    ],
    run: async (interaction) => {
        const Target = interaction.options.getUser("target");

        if (Target.id === interaction.member.id)
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor(ee.wrongcolor)
           .setDescription(`You can't ban yourself`)
        ]})

        
        if (Target.permissions.has("MANAGE_GUILD"))
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor(ee.wrongcolor)
           .setDescription(`You can't ban a moderator`)
        ]})

        const Reason = interaction.options.getString("reason");

        if (Reason > 512)
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`Reason exceeded 512 character limit`)
         ]})

        const Amount = interaction.options.getString("messages");
        
        if (Amount) {
        Target.ban({days: Amount, reason: Reason})
        } else if (!Amount) {
            Target.ban({reason: Reason})
        }

        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Banned **${Target.user.username}**, Reason: ${Reason}`)
        ]})
    }
}