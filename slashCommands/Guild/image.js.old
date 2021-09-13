const { Client, CommandInteraction } = require('discord.js');
const Scraper = require('images-scraper');

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    image: 'image',
    description: "Send an image to a channel",
    options: [{
        name: 'search',
        description: "Image to search",
        type: 'STRING',
        required: true
    }],
    async execute(client, interaction) {
        const google = new Scraper({
            puppeteer: {
                headless: true
            }
        })
        
        const imageQuery = interaction.options.getString('search')

        const imageResults = google.scrape(imageQuery, 1);
        interaction.reply(imageResults[0].url)
    }
}