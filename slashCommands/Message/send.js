const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");

module.exports = {
    name: "send",
    description: "Send a direct message to a user",
    category: "Message",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [settings.ownerID],
    options: [
        {
            "String": {
                name: "user",
                description: "Enter user tag (ex. Gatorade#4147)",
                required: true
            }
        },
        {
            "String": {
                name: "message",
                description: "Enter message",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const Message = interaction.options.getString("message")
            const Target = interaction.options.getString("user")
            const userID = client.users.cache.find(u => u.tag === Target).id

            interaction.reply(userID, Message);

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}