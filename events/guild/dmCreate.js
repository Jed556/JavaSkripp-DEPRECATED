//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);

module.exports = async (client, message) => {
    client.on("messageCreate", async message => {
        if (message.channel.type === "DM") {
            console.log(message.content)
        }
    })
}