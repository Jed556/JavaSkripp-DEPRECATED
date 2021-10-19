const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const fs = require("fs");
const os = require("os");
const exec = require("child_process").exec;

module.exports = {
    name: "analyze",
    description: "Syntax check your javascript code",
    category: "Code",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "code",
                description: "Input your javascript code",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const code = interaction.options.getString("code")

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(`Code by: ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                .setAuthor("syntaxCheck.js", client.user.displayAvatarURL())

            function makeid(length) {
                if (!length) length = 40;
                var result = "";
                var characters = "0123456789";
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            async function checkSyntaxString(string, callback) {
                fileId = makeid();
                string = string || ``;
                fs.writeFile(`${__dirname}/../../databases/files/${fileId}.js`, string, "utf8", (err) => {
                    if (err) console.log(err);
                });

                exec(`node --check ${__dirname}/../../databases/files/${fileId}.js`, function (err, stdout, stderr) {
                    if (err) {
                        callback({ passed: false, error: err });
                        return;
                    }
                    callback({ passed: true, error: null });
                });
            }

            await checkSyntaxString(code, function (syntax) {
                if (!syntax.passed) {
                    interaction.reply({
                        embeds: [embed.setColor(ee.errColor)
                            .setDescription(`**Code:** \`\`\`${code}\`\`\`\n**Error:** \`\`\`${syntax.error}\`\`\``)
                        ]
                    });
                } else {
                    interaction.reply({
                        embeds: [embed
                            .setDescription(`**No Errors Found!**\n**Code:** \`\`\`${code}\`\`\``)
                        ]
                    });
                }
            });

            try { await fs.unlink(`${__dirname}/../../databases/files/${fileId}.js`); } catch (e) { console.log(e) }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}