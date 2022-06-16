const { MessageEmbed } = require("discord.js");
const config = require("../../config/client.json");
const emb = require("../../config/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "unban",
    description: "Unbans a user from the server",
    category: "Moderation",
    cooldown: 2,
    memberpermissions: ["BAN_MEMBERS"],
    options: [
        {
            "String": {
                name: "userID",
                description: "User ID to Unban.",
                required: true
            }
        },
        {
            "String": {
                name: "reason",
                description: "Reason of Unban",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const options = interaction.options
            const userID = options.getString("userID");
            const error = "User Not Banned or doesn't exist"

            const reason = options.getString("reason");

            if (reason.length > 512)
                return interaction.reply({
                    embeds: [new MessageEmbed().setTitle("❌ Can't Run Code With The Strings Given ❌").setColor(emb.errColor)
                        .setDescription("Reason Can't Be More Than 512 Characters").setTimestamp()
                    ],
                    ephemeral: true
                });

            const SuccessEmbed = new MessageEmbed()
                .setTitle(`🟢 Unbanned **[${userID}]** Successfully From ${interaction.guild.name} 🟢`)
                .setColor(emb.okColor)
                .setTimestamp()
                .addFields({
                    name: "Reason For Unban:",
                    value: reason
                })

            const ErrorEmbed = new MessageEmbed()
                .setTitle(`❌ Couldn't Unban [${userID}] From ${interaction.guild.name} ❌`)
                .setColor(emb.errColor)
                .setTimestamp()
                .addFields({
                    name: "Reason It Failed:",
                    value: error
                })

            interaction.guild.members.unban(userID)
                .then(() => {
                    interaction.reply({
                        embeds: [SuccessEmbed],
                        ephemeral: true
                    })
                })
                .catch(() => {
                    interaction.reply({
                        embeds: [ErrorEmbed],
                        ephemeral: true
                    })
                })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}