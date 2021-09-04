const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
tLog = new Date();

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "ping",
    description: "Check websocket ping",

    execute(client, interaction) {
        const Ping = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Ping: ${client.ws.ping}ms`)
        interaction.reply({embeds: [Ping]});
        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Ping: ${client.ws.ping}ms`)
    }
}