const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
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
    ],

    run: async (client, interaction) => {
        try {
            const city = interaction.options.getString("city");
            const country = interaction.options.getString("country");

            embed = new MessageEmbed()
                .setTimestamp()
                .setColor(emb.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())

            weather.find({ search: `${city}, ${country}`, degreeType: 'C' }, function (err, result) {
                if (err) return console.log(err)
                parseData = JSON.parse(JSON.stringify(result));

                for (let i = 0; i < parseData.length; i++) {
                    var wind = parseData[i].current.winddisplay.split(" ");
                    embed
                        .setAuthor(`WEATHER | ${parseData[0].location.name}`)
                        .addField("🏦 Location:", `\`${parseData[i].location.lat}\n${parseData[i].location.long}\``, true)
                        .addField("⌚ Date:", `\`${parseData[i].current.day}\n${parseData[i].current.date}\``, true)
                        .addField("🌡 Temp:", `\`${parseData[i].current.temperature}° ${parseData[i].location.degreetype}\``, true)
                        .addField("☁ Sky:", `\`${parseData[i].current.skytext}\``, true)
                        .addField("💨 Wind:", `\`${wind[0]} ${wind[1]}\n${wind[2]}\``, true)
                        .addField("\u200b", `\u200b\n\u200b\n\u200b`, true)
                }
                interaction.reply({ embeds: [embed] })
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
};