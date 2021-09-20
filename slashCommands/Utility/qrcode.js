const { CommandInteraction, MessageAttachment } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

/**
 *
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "qrcode",
    description: "Create a QR code.",
    category: "Utility",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "text",
                description: "Link/text to convert into QR code",
                required: true
            }
        },
    ],

    run: async (interaction) => {
        try {
            const convert = interaction.options.getString("text");
            if (!convert) return interaction.reply("Please provide a text!");
            
            interaction.reply({content: `🛠 Converting... \`\`\`${convert}\`\`\``});
            
            let result = await qrc.toBuffer(convert)
            interaction.editReply({ files: [new MessageAttachment(result, "qrcode.png")] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
};