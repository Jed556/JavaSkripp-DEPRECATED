const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const ee = require("../../botconfig/embed.json");
const ms = require('ms');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: "mute",
    description: "Mute a member",
    memberpermissions: ["MANAGE_GUILD"],
    category: "Mod",
    cooldown: 2,
    options: [
        {
            "User": {
                name: "target",
                description: "Member to mute",
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
                name: "preset_time",
                description: "Preset mute duration",
                required: false,
                choices: [
                    {
                        name: "1 Hour",
                        value: "1h"
                    },
                    {
                        name: "1 Day",
                        value: "1d"
                    },
                    {
                        name: "1 Week",
                        value: "1w"
                    },
                    {
                        name: "1 Month",
                        value: "30d"
                    },
                    {
                        name: "1 Year",
                        value: "1y"
                    },
                ]
            }
        },
        {
            "String": {
                name: "reason",
                description: "Custom mute duration (1s/1m/1h/1d/1w/1y)",
                required: false,
            }
        },
    ],
    run: async (client, interaction) => {
        const Target = interaction.options.getUser("target");
        const Reason = interaction.options.getString("reason") || "No reason specified";
        const Time = interaction.options.getString("preset_time") || interaction.options.getString("time") || "1d";
        
        if (Target.id === interaction.member.id)
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor(ee.wrongcolor)
           .setDescription(`You can't mute yourself`)
        ]})

        if (Target.permissions.has("MANAGE_GUILD"))
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor(ee.wrongcolor)
           .setDescription("You can't mute a moderator")
        ]})

        if (!interaction.guild.roles.cache.get(process.env.MUTED_ID))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription("Mute role does not exist")
        ]})

        if (Target.roles.cache.has(process.env.MUTED_ID))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription("Member is already muted")
        ]})

        await Target.roles.add(process.env.MUTED_ID);
        setTimeout( async () => {
            if(!Target.roles.cache.has(process.env.MUTED_ID)) return;
            await Target.roles.remove(process.env.MUTED_ID);
        }, (ms(Time)))

        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${Target} muted for ${Time}, Reason: ${Reason}`)
        ]})
    }
}