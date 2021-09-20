const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
    name: "cmdcount",
    cooldown: 1,
    description: "Shows the amount of commands an categories loaded",
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
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`**[${client.commands.size + client.slashCommands.size + client.slashCommands.map(d => d.options).flat().length}] Total Commands Loaded**`)
                    .addField(`:gear: **[${client.commands.size}] Prefix Commands**`, `>>> **[${client.categories.length}] Categories**`)
                    .addField(`:gear: **[${client.slashCommands.size + client.slashCommands.map(d => d.options).flat().length}] Slash Commands**`, `>>> **[${client.slashCategories.length}] Categories**\n`)
                    .setTimestamp()
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}