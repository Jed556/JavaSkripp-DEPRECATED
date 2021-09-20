const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

/**
 * 
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "clear",
    description: "Bulk deletes messages",
    category: "Mod",
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

            if (Amount <= 100) {
                if (Target) {
                    const TargetMessages = (await Messages).filter((m) => m.author.id === Target.id);
                    await Channel.bulkDelete(TargetMessages, true);
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setDescription(`Deleted ${Amount} messages sent by ${Target}`)]
                    })
                } else {
                    Channel.bulkDelete(Amount, true);
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setDescription(`Deleted ${Amount} messages in ${Channel}`)]
                    })
                }
            } else interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${client.allEmojis.x} Exceeded max amount of 100 messages`)]
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}