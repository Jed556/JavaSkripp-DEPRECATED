const { Interaction } = require('discord.js');
var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

/**
 * 
 * @param {Interaction} interaction
 */


module.exports = {
    image: 'image',
    aliases: ['i'],
    description: 'Sends image to a channel',
    run: async (client, message, args) => {
        const image_query = args.join(' ');
        if(!image_query) return interaction.editReply({content: 'Enter an image name'});

        const image_results = await google.scrape(image_query, 1);
        message.channel.send(image_results[0].url)
    }
}