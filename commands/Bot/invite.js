const { MessageEmbed } = require("discord.js");
const config = require("../../config/client.json");
const emb = require("../../config/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "invite",
    cooldown: 5,
    description: "Sends you an invite link",
    category: "Bot",
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
                    .setColor(emb.color)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setDescription(`[**Click here to invite me!**]( ${emb.invite} )`)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}