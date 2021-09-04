const { CommandInteraction } = require('discord.js');
var Scraper = require('images-scraper');

/**
 * 
 * @param {CommandInteraction} interaction
 */


module.exports = {
    image: 'image',
    description: 'Send an image to a channel',
    options: [{
        name: "search",
        description: "Image to search",
        type: "STRING",
        required: true
    }],
    execute(interaction, args) {
        const google = new Scraper({
            puppeteer: {
                headless: true
            }
        })
        
        const imageQuery = interaction.options.getUser("image")
        if(!imageQuery) return interaction.reply({content: 'Enter an image name'});

        const imageResults = google.scrape(imageQuery, 1);
        interaction.reply(imageResults[0].url)
    }
}