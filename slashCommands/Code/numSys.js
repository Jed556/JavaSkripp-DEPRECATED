const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "numsys",
    description: "Convert input to selected number system",
    category: "Code",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "input",
                description: "Input number",
                required: true
            }
        },
        {
            "StringChoices": {
                name: "convert",
                description: "Convert to number system",
                required: true,
                choices: [
                    ["Binary", "bin"],
                    ["Decimal", "dec"],
                    ["Hexadecimal", "hex"],
                    ["Octal", "oct"],
                ]
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            var input = interaction.options.getString("input");
            const conv = interaction.options.getString("convert");
            const convert = (isNaN(input)) ? 16 : 2;

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())

            if (conv == "bin") {
                allIndex(input)
                embed.addField(`Binary:`, `> ${parseInt(input, convert).toString(2).padStart(input.length, "0")}`);
            } else if (conv == "oct") {
                allIndexOct(input)
                toOctal(input, convert);
            } else if (conv == "dec") {
                allIndex(input)
                embed.addField(`Decimal:`, `> ${parseInt(input, convert).toString(10)}`);
            } else if (conv == "hex") {
                allIndex(input)
                embed.addField(`Hexadecimal:`, `> ${parseInt(input, convert)} >> ${parseInt(input, convert).toString(16).toUpperCase()}`);
            } else {
                interaction.reply({
                    embeds: [embed
                        .setColor(ee.errColor)
                        .setDescription(`${client.allEmojis.x} Invalid Input or Conversion`)]
                });
            }

            return interaction.reply({ embeds: [embed] });

            function allIndex(input) {
                embed.addField(`Input:`, `> \`${input}\``)
                if (isNaN(input)) {
                    input = parseInt(input, convert).toString(2);
                    embed.addField(`Parse:`, `> \`${input}\``)
                }
                var inputArr = input.split("").reverse();
                var indexes = [], i;
                for (i = 0; i < inputArr.length; i++)
                    if (inputArr[i] === "1") {
                        const power = Math.pow(2, i)
                        if (i == 0) { indexes.push(1); } else indexes.push(power);
                    }

                embed.addField(`Formula:`, `> ${indexes.map(v => `\`${v}\``).join(" + ")}`)
            }

            function allIndexOct(input) {
                embed.addField(`Input:`, `> \`${input}\``)
                const split = input.match(new RegExp('.{1,3}', 'g'))
                var indexes = [], parse = [], i;
                for (var idx = 0; idx < split.length; idx++) {
                    if (isNaN(input)) {
                        split[idx] = parseInt(split[idx], convert).toString(2).padStart(3, "0");
                        parse.push(split[idx]);
                    }
                    var inputArr = split[idx].split("").reverse();
                    for (i = 0; i < inputArr.length; i++) {
                        if (inputArr[i] === "1") {
                            const power = Math.pow(2, i)
                            if (i == 0) { indexes.push(1); } else indexes.push(power);
                        }
                    }
                }
                if (isNaN(input)) embed.addField(`Parse:`, `> \`${parse.join(" ")}\``)
                embed.addField(`Formula:`, `> ${indexes.map(v => `\`${v}\``).join(" + ")}`)
            }

            function toOctal(input, convert) {
                var result = [];
                const split = input.match(new RegExp('.{1,3}', 'g'))
                for (var i = 0; i < split.length; i++) {
                    const bin = parseInt(split[i], convert).toString(8);
                    result.push(bin)
                };
                const oct = result.toString(8).split(",")
                const pOct = result.toString(8).split(",").join("")
                let sum = oct.reduce(function (sum, n) {
                    return parseFloat(sum) + parseFloat(n)
                })
                if (result.length == 1) embed.addField(`Octal:`, `> ${sum}`);
                else embed.addField(`Octal:`, `> ${pOct} >> ${sum}`);
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}