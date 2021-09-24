const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");

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
                    .setFooter(client.user.username, ee.footericon)
                    .setTitle(`**[${client.commands.size + client.slashCommands.size + client.slashCommands.map(d => d.options).flat().length}] Modules Loaded**`)
                    .addField(`:gear: **[18] Events**`, `>>> **[3] Categories**`)
                    .addField(`:gear: **[${client.commands.size}] Prefix Commands**`, `>>> **[${client.categories.length}] Categories**`)
                    .addField(`:gear: **[${client.slashCommands.size}] Slash Commands**`, `>>> **[${client.slashCategories.length}] Categories**\n`)
                    .setTimestamp()
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(e)
        }
    }
}