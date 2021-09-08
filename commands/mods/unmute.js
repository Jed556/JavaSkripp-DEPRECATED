const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: 'unmute',
    description: "Unmute a member",
    Perms: 'ADMINISTRATOR',
    options: [{
        name: 'target',
        description: "Member to unmute",
        type: 'USER',
        required: true,
    }],
    async execute(client, interaction) {
        const Target = interaction.options.getMember('target');

        if (!Target.roles.cache.has(process.env.MUTED_ID))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription('Member is not muted')
        ]})

        Target.roles.remove(process.env.MUTED_ID);

        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${Target} unmuted`)
        ]})
    }
}