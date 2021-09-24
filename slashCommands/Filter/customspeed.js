const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");

module.exports = {
    name: "customspeed",
    description: "Changes the speed of the song",
    category: "Filter",
    cooldown: 5,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "StringChoices": {
                name: "amount",
                description: "Speed percentage to set",
                required: true,
                choices: [
                    ["25", "0.25"],
                    ["50", "0.5"],
                    ["75", "0.75"],
                    ["100", "1"],
                    ["125", "1.25"],
                    ["150", "1.5"],
                    ["175", "1.75"],
                    ["200", "2"],
                ]
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;
            const { channel } = member.voice;

            if (!channel) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.errColor)
                    .setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                    ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setTitle(`${client.allEmojis.x} **I am nothing Playing right now**`)
                    ],
                    ephemeral: true
                })
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.errColor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${client.allEmojis.x}**You are not a DJ and not the Song Requester!**`)
                            .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                        ephemeral: true
                    });
                }
                let speed_amount = options.getString("amount")

                FiltersSettings.customspeed = `atempo=${speed_amount}`;
                client.distube.filters = FiltersSettings;
                //add old filters so that they get removed 	
                //if it was enabled before then add it
                if (newQueue.filters.includes("customspeed")) {
                    await newQueue.setFilter(["customspeed"]);
                }

                await newQueue.setFilter(["customspeed"]);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`♨️ **Set the Speed to ${speed_amount}!**`)
                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ],
                    ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}