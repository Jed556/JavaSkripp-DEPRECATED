const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const moment = require("moment");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "stats",
    description: "Display mentioned user or command user's information",
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

    run: async (interaction) => {
        try {
            const Target = interaction.options.getUser("user")

            const Info = new MessageEmbed()
                .setAuthor(`${Target.user.username}`, Target.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail(Target.user.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .addField("Server member since", `${moment(Target.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.joinedAt).startOf('day').fromNow()}`)
                .addField("Discord user since", `${moment(Target.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.user.createdAt).startOf('day').fromNow()}`)

            if (Target.roles.cache.size > 1) {
                Info.addField(`Role${Target.roles.cache != 1 ? "s" : ""}`, `${Target.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}`)
            } else {
                Response.addField("Roles", "No roles to display")
            }

            interaction.reply({ embeds: [Info] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}