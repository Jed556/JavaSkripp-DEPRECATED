const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
    name: "support",
    cooldown: 1,
    description: "Sends contacts for bot support",
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
                    .setTitle("Support")
                    .addField(`Discord:`, `\`${ee.owner}\`, \`${client.user.tag}\``)
                    .addField(`Gmail:`, `\`${ee.email}\``)
                    .addField(`Github:`, "[Jed556/JavaSkripp](https://github.com/Jed556/JavaSkripp-Public)")
                    .addField(`Updates`, "[Project Updates](https://github.com/Jed556/JavaSkripp-Public/projects/1?fullscreen=true)")
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}