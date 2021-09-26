
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const math = require("mathjs");

module.exports = {
    name: "calc",
    description: "Runs an interactive calculator",
    category: "Utility",
    cooldown: 5,
    requiredroles: [],
    alloweduserids: [],
    run: async (client, interaction) => {
        try {
            interaction.deferReply("Starting...")

            let button = new Array([], [], [], [], []);
            let row = [];
            let text = [
                "Clear", "(", ")", "/", "⌫",
                "7", "8", "9", "*", "!",
                "4", "5", "6", "-", "^",
                "1", "2", "3", "+", "π",
                ".", "0", "00", "=", "Delete"
            ];
            let current = 0;

            for (let i = 0; i < text.length; i++) {
                if (button[current].length === 5) current++;
                button[current].push(createButton(text[i]));
                if (i === text.length - 1) {
                    for (let btn of button) row.push(addRow(btn));
                }
            }

            const emb = new MessageEmbed()
                .setColor(ee.color)
                .setDescription("```0```");

            await interaction
                .followUp({
                    embeds: [emb],
                    components: row
                })
                .then(async (interaction) => {
                    let isWrong = false;
                    let time = 600000;
                    let value = "";
                    let emb1 = new MessageEmbed()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setColor(ee.errColor);

                    function createCollector(val, result = false) {
                        const filter = (button) =>
                            button.user.id === interaction.user.id &&
                            button.customId === "cal" + val;
                        let collect = interaction.createMessageComponentCollector({
                            filter,
                            componentType: "BUTTON",
                            time: time
                        });

                        collect.on("collect", async (x) => {
                            if (x.user.id !== interaction.user.id) return;

                            x.deferUpdate();

                            if (result === "new") value = "0";
                            else if (isWrong) {
                                value = val;
                                isWrong = false;
                            } else if (value === "0") value = val;
                            else if (result) {
                                isWrong = true;
                                value = mathEval(value);
                            } else value += val;
                            if (value.includes("⌫")) {
                                value = value.slice(0, -2);
                                if (value === "") value = " ";
                                emb1.setDescription("```" + value + "```");
                                await interaction.edit({
                                    embeds: [emb1],
                                    components: row
                                });
                            } else if (value.includes("Delete"))
                                return interaction.deleteReply().catch(() => { });
                            else if (value.includes("Clear")) return (value = "0");
                            emb1.setDescription("```" + value + "```");
                            await interaction.edit({
                                embeds: [emb1],
                                components: row
                            });
                        });
                    }

                    for (let txt of text) {
                        let result;

                        if (txt === "Clear") result = "new";
                        else if (txt === "=") result = true;
                        else result = false;
                        createCollector(txt, result);
                    }
                    setTimeout(async () => {
                        emb1.setDescription(
                            "Your Time for using the calculator ran out (10 minutes)"
                        );
                        emb1.setColor(ee.errColor);
                        await interaction.edit({ embeds: [emb1], components: [] });
                    }, time);
                });

            function addRow(btns) {
                let row1 = new MessageActionRow();
                for (let btn of btns) {
                    row1.addComponents(btn);
                }
                return row1;
            }

            function createButton(label, style = "SECONDARY") {
                if (label === "Clear") style = "DANGER";
                else if (label === "Delete") style = "DANGER";
                else if (label === "⌫") style = "DANGER";
                else if (label === "π") style = "SECONDARY";
                else if (label === "!") style = "SECONDARY";
                else if (label === "^") style = "SECONDARY";
                else if (label === ".") style = "PRIMARY";
                else if (label === "=") style = "SUCCESS";
                else if (isNaN(label)) style = "PRIMARY";
                const btn = new MessageButton()
                    .setLabel(label)
                    .setStyle(style)
                    .setCustomId("cal" + label);
                return btn;
            }

            function mathEval(input) {
                try {
                    let res = `${input} = ${math.evaluate(input.replace("π", math.pi))}`;
                    return res;
                } catch {
                    return "Wrong Input";
                }
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}