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
                    .setAuthor("Support", client.user.displayAvatarURL())
                    .addField(`Discord:`, `\`${ee.owner}\`, \`${client.user.tag}\``)
                    .addField(`Email`, `\`${ee.email}\``)
                    .addField(`Github`, "\`[JavaSkripp](https://tiny.one/JavaSkripp-git)\`")
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}