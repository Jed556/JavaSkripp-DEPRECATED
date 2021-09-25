const { MessageAttachment } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");

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

    run: async (client, interaction) => {
        try {
            interaction.deferReply();
            const convert = interaction.options.getString("text");
            if (!convert) return interaction.followUp("Please provide a text!");

            interaction.followUp({ content: `🛠 Converting... \`\`\`${convert}\`\`\``, ephemeral: true });

            let result = await qrc.toBuffer(convert)
            interaction.editReply({attachments: [new MessageAttachment(result, "qrcode.png")], ephemeral: false })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
};