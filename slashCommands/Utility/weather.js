const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const weather = require("weather-js");

module.exports = {
    name: "weather",
    description: "Get weather info",
    category: "Utility",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "city",
                description: "City to check weather status",
                required: true
            }
        },
        {
            "String": {
                name: "country",
                description: "Country to check weather status",
                required: true
            }
        },
        {
            "Integer": {
                name: "forecasts",
                description: "Number of forecasts to display",
                required: false
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const city = interaction.options.getString("city");
            const country = interaction.options.getString("country");

            embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)

            weather.find({ search: `${city}, ${country}`, degreeType: 'C' }, function (err, result) {
                if (err) return console.log(err)
                parseData = JSON.parse(JSON.stringify(result));
                console.log(parseData, "\n");

                for (let i = 0; i < parseData.length; i++) {
                    embed
                        .setAuthor(`WEATHER | ${parseData[0].location.name}`)
                        .addField("Location:", `\`${parseData[i].location.lat}, ${parseData[i].location.long}\``, true)
                        .addField("Date:", `\`${parseData[i].current.day}, ${parseData[i].current.date}\``, true)
                        .addField("Temperature:", `\`${parseData[i].current.temperature}° ${parseData[i].location.degreetype}\``, true)
                        .addField("Sky:", `\`${parseData[i].current.skytext}\``, true)
                        .addField("Wind:", `\`${parseData[i].current.winddisplay}\``, true)
                        .addField("\u200b", `\u200b`, true)
                }
                interaction.reply({ embeds: [embed] })
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
};