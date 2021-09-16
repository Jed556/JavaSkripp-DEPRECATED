const { MessageEmbed } = require('discord.js');
const moment = require('moment')

module.exports = {
    name: "stats", //the command name for the Slash Command
	description: "Display mentioned user or command user's information", //the command description for Slash Command Overview
    category: "Guild",
	cooldown: 1,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ 
		{
			"User": {
				name: "target",
				description: "Select a user",
				required: true
			}
		}, 
	],
    run: async (interaction) => {
        const {
            member,
            channelId,
            guildId,
            applicationId,
            commandName,
            deferred,
            replied,
            ephemeral,
            options,
            id,
            createdTimestamp
        } = interaction;

        const Target = options.getMember("target")

        const Info = new MessageEmbed()
        .setAuthor(`${Target.user.username}`, Target.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(Target.user.displayAvatarURL({dynamic: true}))
        .setColor('RANDOM')
        .addField("Server member since", `${moment(Target.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.joinedAt).startOf('day').fromNow()}`)
        .addField("Discord user since", `${moment(Target.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.user.createdAt).startOf('day').fromNow()}`)

        if (Target.roles.cache.size > 1) {
            Info.addField("Roles", `${Target.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}`)
        } else {
            Response.addField("Roles", "No roles to display")
        }

        interaction.reply({embeds: [Info]})
    }
}