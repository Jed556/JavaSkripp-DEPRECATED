const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "ping",
    description: "Displays bot latency",
    category: "Bot",
    cooldown: 1,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "StringChoices": {
                name: "ping",
                description: "Type of ping to get",
                required: false,
                choices: [
                    ["Bot", "botping"],
                    ["Discord API", "api"]
                ]
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
            const StringOption = options.getString("ping"); //same as in StringChoices
            //let UserOption = options.getUser("OPTIONNAME");
            //let ChannelOption = options.getChannel("OPTIONNAME");
            //let RoleOption = options.getRole("OPTIONNAME");

            if (StringOption) {
                if (StringOption == "botping") {
                    await interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(embed.color)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.loading} Getting the Bot Ping...`)
                        ],
                        ephemeral: true
                    });
                    interaction.editReply({
                        embeds: [new MessageEmbed()
                            .setColor(embed.color)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.ping} Ping`)
                            .addField(`Bot Ping:`, `\`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms\``, true)
                            .setTimestamp()
                        ],
                        ephemeral: true
                    })
                }
                //Other Option: API
                else {
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(embed.color)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.ping} Ping`)
                            .addField(`API Ping:`, `\`${Math.floor(client.ws.ping)}ms\``, true)
                            .setTimestamp()
                        ],
                        ephemeral: true
                    })
                }
            } else {
                await interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.loading} Getting the Bot Ping...`)
                    ],
                    ephemeral: true
                });
                interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.ping} Ping`)
                        .addField(`Bot Ping:`, `\`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms\``, true)
                        .addField(`API Ping:`, `\`${Math.floor(client.ws.ping)}ms\``, true)
                        .setTimestamp()
                    ],
                    ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM
        }
    }
}