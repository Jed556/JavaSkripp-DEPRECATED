const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { MUTED_ID } = require("../../config.json");
const ms = require('ms');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: 'mute',
    description: "Mute a member",
    Perms: "ADMINISTRATOR",
    options: [{
            name: 'target',
            description: "Member to mute",
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: "Provide a reason",
            type: 'STRING',
            required: true,
        },
        {
            name: 'preset-time',
            description: "Preset mute duration",
            type: 'STRING',
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
            ]
        },
        {
            name: 'time',
            description: "Mute duration (1s/1m/1h/1d)",
            type: 'STRING',
            required: false,
        },
    ],
    async execute(client, interaction, args) {
        const Target = interaction.options.getMember('target');
        const Reason = interaction.options.getUser('reason') || "No reason specified";
        const Time = interaction.options.getString('preset-time') || interaction.options.getString('time') || "1d";
        
        if (!interaction.guild.roles.cache.get(MUTED_ID))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription('Mute role does not exist')
        ]})

        await Target.roles.add(MUTED_ID);
        setTimeout( async () => {
            if(!Target.roles.cache.has(MUTED_ID)) return;
            await Target.roles.remove(MUTED_ID);
        }, (ms(Time)))

        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${Target} muted for ${Time}, Reason: ${Reason}`)
        ]})
    }
}