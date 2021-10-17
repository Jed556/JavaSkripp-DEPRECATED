const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);

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
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;

            const code = options.getString("code")

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setAuthor("syntaxCheck.js", client.user.displayAvatarURL())

            async function runShell(command) {
                let result;
                try {
                    result = await execProm(command);
                } catch (ex) {
                    result = ex;
                }
                if (Error[Symbol.hasInstance](result))
                    return;

                return result;
            }

            runShell(code).then(res => {
                if (res) {
                    interaction.reply({
                        embeds: [embed.setColor(ee.errColor)
                            .setDescription(`**Code:** \`\`\`${code}\`\`\`\n**Error:** \`\`\`${res}\`\`\``)
                        ]
                    });
                } else {
                    interaction.reply({
                        embeds: [embed
                            .setDescription(`**No Errors Found!**\n**Code:** \`\`\`${res}\`\`\``)
                        ]
                    });
                }
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}