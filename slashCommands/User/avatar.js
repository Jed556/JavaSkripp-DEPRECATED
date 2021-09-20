const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "avatar",
    description: "Displays mentioned user's or command user's avatar",
    category: "User",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "User": {
                name: "user",
                description: "Select a user",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const Target = interaction.options.getUser("user")

            const Response = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${Target.tag}'s Avatar`)
                .setImage(Target.displayAvatarURL({ dynamic: true }))
                .setFooter(`Requested by ${interaction.user.tag}`)

            interaction.reply({ embeds: [Response], ephemeral: true });
            console.log(`Sent ${Target.tag}'s Avatar`)
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}