const { MessageEmbed } = require('discord.js');
const Scraper = require('images-scraper');

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
	
    run: async (interaction) => {
        const google = new Scraper({
            puppeteer: {
                headless: true,
                args: ["--no-sandbox"]
            }
        })

        const search = interaction.options.getString("search");
		interaction.reply(`🔍 Searching... \`\`\`${search}\`\`\``)
		
        const results = await google.scrape(search, 1);
        interaction.editReply(results[0].url);
    }
}