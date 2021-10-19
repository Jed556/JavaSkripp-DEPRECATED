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
                description: "Amount of messages to delete",
                required: true
            }
        },
        {
            "User": {
                name: "user",
                description: "Clear mentioned user's messages",
                required: false
            }
        }
    ],

    run: async (client, interaction) => {
        try {
            const { channel, options } = interaction;
            const Amount = options.getInteger("amount");
            const Target = options.getUser("user");
            const Messages = channel.messages.fetch();
            const time = 5000;

            var embed = new MessageEmbed()
                .setTimestamp()
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL())

            if (Amount <= 100) {
                if (Target) {
                    let i = 0;
                    const filtered = [];
                    (await Messages).filter((m) => {
                        if (m.author.id === Target.id && Amount > i) {
                            filtered.push(m);
                            i++
                        }
                    });
                    await channel.bulkDelete(filtered, true).then(msgs => {
                        interaction.reply({
                            embeds: [embed
                                .setDescription(`**Deleted ${msgs.size} messages sent by ${Target}**`)]
                        })
                    })
                } else {
                    await channel.bulkDelete(Amount, true).then(msgs => {
                        interaction.reply({
                            embeds: [embed
                                .setDescription(`**Deleted ${msgs.size} messages in ${channel}**`)]
                        })
                    })
                }
            } else {
                if (Target) {
                    let i = 0;
                    const filtered = [];
                    (await Messages).filter((m) => {
                        if (m.author.id === Target.id && Amount > i) {
                            filtered.push(m);
                            i++
                        }
                    });
                    await channel.bulkDelete(filtered, true).then(msgs => {
                        interaction.reply({
                            embeds: [embed
                                .setDescription(`**Deleted ${msgs.size} messages sent by ${Target}**`)]
                        })
                        setTimeout(async () => {
                            try { await interaction.deleteReply() } catch { }
                        }, time);
                    })
                } else {
                    let iBulk = 0;
                    bulkAmt = [];
                    while (Math.ceil(Amount / 100) > iBulk) {
                        await setTimeout(() => {
                            try {
                                channel.bulkDelete(100, true).then(msgs => {
                                    await interaction.reply({
                                        embeds: [embed
                                            .setDescription(`**Deleted ${msgs.size} messages in ${channel}** \`Loop: ${iBulk + 1}]\``)]
                                    })
                                    setTimeout(async () => {
                                        try { await interaction.deleteReply() } catch { }
                                    }, time);
                                })
                            } catch { }
                        }, 1500);
                        iBulk++;
                    }
                }
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}