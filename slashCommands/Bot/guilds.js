const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "guilds",
    cooldown: 1,
    description: "Displays guilds that JavaSkripp listen to",
    category: "Bot",
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],

    run: async (client, interaction) => {
        try {
            const Response = new MessageEmbed()
                .setColor(ee.color)
                .setTitle("Guilds")
                .addField("Total Guilds:",  `\`${client.guilds.cache.size}\``)
                .addField("Guild Names:", `${client.guilds.cache.map(g => `• ${g.name}`).join(`\n`)}`)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setTimestamp()

            interaction.reply({ embeds: [Response], ephermeral: true });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}