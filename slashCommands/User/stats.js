const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");
const moment = require("moment");

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

    run: async (client, interaction) => {
        try {
            const Target = interaction.options.getUser("user")
            const Member = interaction.options.getMember("user")

            const Info = new MessageEmbed()
                .setAuthor(`${Target.tag}`, Target.displayAvatarURL({ dynamic: true }))
                .setThumbnail(Target.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .addField("Server member since", `${moment(Target.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.joinedAt).startOf('day').fromNow()}`)
                .addField("Discord user since", `${moment(Target.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.createdAt).startOf('day').fromNow()}`)

            if (Member.roles.cache.size > 1) {
                Info.addField(`Role${Member.roles.cache != 1 ? "s" : ""}`, `${Member.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}`)
            } else {
                Info.addField("Roles", "No roles to display")
            }

            interaction.reply({ embeds: [Info] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}