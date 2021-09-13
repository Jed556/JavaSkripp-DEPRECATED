const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: "avatar", //the command name for the Slash Command
	description: "Displays mentioned user's or command user's avatar", //the command description for Slash Command Overview
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
    
    run: async (client, interaction) => {
		try {
			const Target = interaction.options.getUser("target")

			const Response = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(`${Target.tag}'s Avatar`)
			.setImage(Target.displayAvatarURL({dynamic: true}))
			.setFooter(`Requested by ${interaction.user.tag}`)

			interaction.reply({embeds: [Response], ephemeral: true});
			console.log(`Sent ${Target.tag}'s Avatar`)
		}catch (e) {
			console.log(String(e.stack).bgRed)
   		}
	}
}