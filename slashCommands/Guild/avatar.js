const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "avatar", //the command name for the Slash Command
	description: "Displays mentioned user's or command user's avatar", //the command description for Slash Command Overview
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
		try {
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