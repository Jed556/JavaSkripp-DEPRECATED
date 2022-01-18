const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
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
            const hasLetter = /[a-zA-z]/g;
            const nums = [2, 3, 4, 5, 6, 7, 8, 9];
            const convert = (hasLetter.test(input)) ? 16 : (nums.some(v => input.includes(v))) ? 10 : 2;

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(emb.color)
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
                embed.addField(`Hexadecimal:`, `> ${parseInt(input, convert).toString(16).toUpperCase()}`);
            } else {
                interaction.reply({
                    embeds: [embed
                        .setColor(emb.errColor)
                        .setDescription(`${client.emoji.x} Invalid Input or Conversion`)]
                });
            }

            return interaction.reply({ embeds: [embed] });

            function allIndex(input) {
                embed.addField(`Input:`, `> \`${input}\``)
                var dec = parseInt(input, convert);

                if (hasLetter.test(input) || nums.some(v => input.includes(v))) {
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

                if (conv == "hex") {
                    var rems = [], ans = [];
                    const answer = dec.toString(16).toUpperCase();
                    const ansSplit = answer.split("").reverse()
                    var idx = 0;
                    while (dec > 1) {
                        const remainder = dec % 16;
                        rems.push(`${dec}/16 = ${remainder}`);
                        ans.push(`${remainder} = ${ansSplit[idx]}`);
                        dec = Math.floor(dec / 16);
                        idx++
                    }

                    embed
                        .addField(`Formula:`, `> ${indexes.map(v => `\`${v}\``).join(" + ")} = \`${dec}\``)
                        .addField(`Remainder: `, `> ${rems.map(v => `\`${v}\``).join(", ")}`)
                        .addField(`Conversion: `, `>  ${ans.reverse().map(v => `\`${v}\``).join(", ")}`)
                } else embed.addField(`Binary:`, `> ${indexes.map(v => `\`${v}\``).join(" + ")}`)
            }

            function allIndexOct(input) {
                embed.addField(`Input:`, `> \`${input}\``)

                if (hasLetter.test(input) || nums.some(v => input.includes(v))) {
                    var bin = parseInt(input, convert).toString(2);
                    embed.addField(`Parse:`, `> \`${input}\``)
                } else var bin = input;

                const split = bin.match(new RegExp('.{1,3}', 'g'))
                var indexes = [], i;
                for (var idx = 0; idx < split.length; idx++) {
                    var inputArr = split[idx].split("").reverse();
                    for (i = 0; i < inputArr.length; i++) {
                        if (inputArr[i] === "1") {
                            const power = Math.pow(2, i)
                            if (i == 0) { indexes.push(1); } else indexes.push(power);
                        }
                    }
                }
                if (hasLetter.test(input) || nums.some(v => input.includes(v))) embed.addField(`Parse:`, `> ${split.map(v => `\`${v}\``).join(" ")}`)
                embed.addField(`Formula:`, `> ${indexes.map(v => `\`${v}\``).join(" + ")}`)
            }

            function toOctal(input, convert) {
                if (hasLetter.test(input) || nums.some(v => input.includes(v))) {
                    input = parseInt(input, convert).toString(2);
                }

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