const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const moment = require('moment')

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: 'stats',
    description: "Display mentioned user or command user's information",
    options: [{
        name: 'target',
        description: "Select member",
        type: 'USER',
        required: true
    }],
    async execute(client, interaction) {
        const Target = interaction.options.getMember('target')

        const Info = new MessageEmbed()
        .setAuthor(`${Target.user.username}`, Target.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(Target.user.displayAvatarURL({dynamic: true}))
        .setColor('RANDOM')
        .addField(`Server member since ${moment(Target.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.joinedAt).startOf('day').fromNow()}`)
        .addField(`Discord user since ${moment(Target.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.joinedAt).startOf('day').fromNow()}`)

        if (Target.roles.cache.size > 1) {
            Info.addField(`Roles: ${Target.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}`)
        } else {
            Response.addField("Roles: No roles to display")
        }

        interaction.reply({embeds: [Info]})
    }
}