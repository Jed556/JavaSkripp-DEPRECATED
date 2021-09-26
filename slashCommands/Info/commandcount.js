const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "cmdcount",
    cooldown: 1,
    description: "Shows the amount of commands and categories loaded",
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
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTitle(`**[${client.slashCommands.size}] Modules Loaded**`)
                    .addField(`⚙ **[18] Events**`, `>>> **[3] Categories**`)
                    .addField(`⚙ **[${client.slashCommands.size}] Slash Commands**`, `>>> **[${client.slashCategories.length || 0}] Categories**\n`)
                    .setTimestamp()
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}