const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
tLog = new Date();

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
			"String": {
				name: "target",
				description: "Select a user",
				required: true
			}
		}, 
	],
    
    run: async (client, interaction) => {
        const Target = interaction.options.getUser("target")

        const Response = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(`${Target.tag}'s Avatar`)
        .setImage(Target.displayAvatarURL({dynamic: true}))
        .setFooter(`Requested by ${interaction.user.tag}`)

        interaction.reply({embeds: [Response], ephemeral: true});
        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m ${Target.tag}'s Avatar`)
   }
}