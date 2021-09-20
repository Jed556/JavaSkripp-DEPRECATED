const { MessageAttachment } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const qrc = require("qrcode");

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
            const queue = interaction.options.getString("text")
            if (!queue) return interaction.reply("Please provide a text!")

            interaction.reply(`🛠 Converting... \`\`\`${queue}\`\`\``)
            
            let image = await qrc.toBuffer(queue)
            interaction.editReply({ files: [new MessageAttachment(image, "qrcode.png")] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
};