const { MessageAttachment } = require("discord.js")
const qrc = require("qrcode");

module.exports = {
    name: "QR-code",
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
        const queue = interaction.options.getString("text")
        if (!queue) return interaction.reply("Please provide a text!")

        interaction.reply(`🛠 Converting... \`\`\`${queue}\`\`\``)
        let image = await qrc.toBuffer(queue)
        

        interaction.reply({ files: [new MessageAttachment(image, "qrcode.png")] })
    }
};