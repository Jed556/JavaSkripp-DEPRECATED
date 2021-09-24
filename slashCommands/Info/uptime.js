const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { duration } = require("../../handlers/functions")
const { DM } = require("../../handlers/antiCrash");

module.exports = {
    name: "uptime",
    cooldown: 1,
    description: "Returns how long JavaSkripp is online",
    category: "Info",
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],
    
    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            interaction.reply({
                ephemeral: true,
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(client.user.username, ee.footericon)
                    .setTitle(`${client.allEmojis.check} **${client.user.username}** is since:\n ${duration(client.uptime).map(t => `\`${t}\``).join(", ")} online`)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            DM(e)
        }
    }
}