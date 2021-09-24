const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");

module.exports = {
    name: "add",
    description: "Adds a filter to the song",
    category: "Filter",
    cooldown: 5,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "filters",
                description: "Filters to add (Use spaces for multiple filters)",
                required: true
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

                let filters = options.getString("filters").toLowerCase().split(" ");
                if (!filters) filters = [options.getString("filters").toLowerCase()]
                if (filters.some(a => !FiltersSettings[a])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.errColor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${client.allEmojis.x} **You added at least one Filter, which is invalid!**`)
                            .setDescription("**To define Multiple Filters add a SPACE (` `) in between!**")
                            .addField("**All Valid Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom have their own Command to define a custom amount*")
                        ],
                    })
                }

                let toAdded = [];
                //add new filters
                filters.forEach((f) => {
                    if (!newQueue.filters.includes(f)) {
                        toAdded.push(f)
                    }
                })
                if (!toAdded || toAdded.length == 0) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.errColor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`${client.allEmojis.x} **You did not add a Filter, which is not in the Filters yet.**`)
                                .addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                        ],
                    })
                }

                await newQueue.setFilter(toAdded);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`♨️ **Added ${toAdded.length} ${toAdded.length == filters.length ? "Filters" : `of ${filters.length} Filters! The Rest was already a part of the Filters!`}**`)
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