const { Client, CommandInteraction } = require('discord.js');
const Scraper = require('images-scraper');

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
        const google = new Scraper({
            puppeteer: {
                headless: true,
                args: ["--no-sandbox"]
            }
        })
        
        const imageQuery = interaction.options.getString('search')

        const imageResults = google.scrape(imageQuery, 1);
        interaction.reply(imageResults[0].url)
    }
}