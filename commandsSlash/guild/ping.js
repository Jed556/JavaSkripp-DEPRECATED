const { Interaction, Client } = require("discord.js");
tLog = new Date();

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 * @param {String[]} args
 */

module.exports = {
    name: "ping",
    aliases: ['p'],
    description: 'Websocket ping',


    run: async (client, interaction, args) => {
        interaction.editReply({content: `Ping: ${client.ws.ping}ms`});
        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Ping: ${client.ws.ping}ms`)
    }
}