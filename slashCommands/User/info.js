const { MessageEmbed } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");
const moment = require("moment");

module.exports = {
    name: "info",
    description: "Display mentioned user or command user's information",
    category: "User",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [{
        "User": {
            name: "user",
            description: "Select a user",
            required: true
        }
    },],

    run: async (client, interaction) => {
        try {
            const Target = interaction.options.getMember("user") || interaction.member;
            await Target.user.fetch();

            const Info = new MessageEmbed()
                .setAuthor(`${Target.user.tag}`, Target.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail(Target.user.displayAvatarURL({ dynamic: true }))
                .setColor(Target.user.accentColor || "RANDOM")
                .addField("ID", Target.user.id)
                .addField("Server Member since", `${moment(Target.user.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.user.joinedAt).startOf('day').fromNow()}`)
                .addField(`${Target.user.bot ? "Discord Bot" : "Discord User"} since`, `${moment(Target.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-** ${moment(Target.user.createdAt).startOf('day').fromNow()}`)
                .addField(`Role${Target.roles.cache != 1 ? "s" : ""}`, `${Target.roles.cache < 2 ? Target.roles.cache.map(r => r).join(' ').replace("@everyone", " ") : "None"}`)
                .addField("Accent Color", Target.accentColor ? `#${Target.user.accentColor.toString(16)}` : "None")
                .addField("Banner", Target.user.bannerURL() ? "** **" : "None")
                .setImage(`${Target.user.bannerURL({ dynamic: true, size: 512 }) || ""}`)

            interaction.reply({ embeds: [Info], ephemeral: true });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}