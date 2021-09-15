const { Client, CommandInteraction } = require('discord.js');
const fotology = require('fotology');

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "image", //the command name for the Slash Command
	description: "Send an image to a channel", //the command description for Slash Command Overview
	category: "Guild",
	cooldown: 1,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ 
		{
			"String": {
				name: "search",
				description: "Image to search",
				required: true
			}
		}, 
	],
    run: async (client, interaction) => {
        const config = {
			size: "large",
			language: "en",
			safe: true,
			rights: "cc_publicdomain"
		}

		const imageQuery = interaction.options.getString('search')

		fotology(imageQuery, config)
		.then(function (imageURLs) {
			for (i in imageURLs)
				interaction.reply(imageURLs[i])
		})
    }
}