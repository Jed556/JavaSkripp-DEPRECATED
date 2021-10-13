const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");

/**
 * 
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "clear",
    description: "Bulk deletes messages",
    category: "Moderation",
    cooldown: 2,
    memberpermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            "Integer": {
                name: "amount",
                description: "Amount of messages to delete (Max: 100)",
                required: true
            }
        },
        {
            "User": {
                name: "user",
                description: "Clear mentioned user messages",
                required: false
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const Amount = interaction.options.getInteger("amount");
            const Target = interaction.options.getUser("user");
            const Channel = interaction.channel;
            const Messages = Channel.messages.fetch();
            const time = 5000;

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())

            if (Amount <= 100) {
                if (Target) {
                    const TargetMessages = (await Messages).filter((m) => m.author.id === Target.id);
                    await Channel.bulkDelete(TargetMessages, true);
                    interaction.reply({
                        embeds: [embed
                            .setDescription(`Deleted ${Amount} messages sent by ${Target}`)]
                    })
                } else {
                    await Channel.bulkDelete(Amount, true);
                    interaction.reply({
                        embeds: [embed
                            .setDescription(`Deleted ${Amount} messages in ${Channel}`)]
                    })
                }

                setTimeout(async () => {
                    try { interaction.deleteReply() } catch { }
                }, time);

            } else interaction.reply({
                embeds: [embed
                    .setColor(ee.errColor)
                    .setDescription(`${client.allEmojis.x} Exceeded max amount of 100 messages`)]
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}