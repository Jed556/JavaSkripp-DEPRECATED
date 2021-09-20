const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const Scraper = require("images-scraper");

module.exports = {
    name: "image",
    description: "Send an image to a channel",
    category: "Search",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "image",
                description: "Image to search",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const google = new Scraper({
                puppeteer: {
                    headless: true,
                    args: ["--no-sandbox"]
                },
                safe: true
            })

            const search = interaction.options.getString("image");
            interaction.reply(`🔍 Searching... \`\`\`${search}\`\`\``)

            const results = await google.scrape(search, 30);
            interaction.editReply(results[Math.floor(Math.random() * results.length)].url);
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}