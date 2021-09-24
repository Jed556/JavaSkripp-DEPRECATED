const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");

module.exports = {
    name: "invite",
    cooldown: 5,
    description: "Sends you an invite link",
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
                    .setDescription(`[**Click here to invite me!**]( ${ee.invite} )`)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(e)
        }
    }
}