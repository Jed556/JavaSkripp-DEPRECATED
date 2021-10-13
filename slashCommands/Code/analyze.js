const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");
const syntaxCheck = require("syntax-checker-new");

module.exports = {
    name: "analyze",
    description: "Syntax check your code",
    category: "Code",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "code",
                description: "Input your code",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const code = options.getString("code")

            syntaxCheck.checkSyntaxString(jscode, "js", function (syntaxReturn) {
                interaction.reply(syntaxReturn.passed);
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}