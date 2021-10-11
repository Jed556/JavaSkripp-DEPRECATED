const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "remove",
    description: "Removes a song filter",
    category: "Filter",
    cooldown: 5,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "filters",
                description: "Filters to remove (Use spaces for multiple filters)",
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
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, ee.discAlert)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Join __my__ Voice Channel!`, ee.discAlert)
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
                        .setAuthor(`Nothing playing right now`, ee.discAlert)
                    ],
                    ephemeral: true
                })

                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
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
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.errColor)
                                .setFooter(client.user.username, client.user.displayAvatarURL())
                                .setTitle(`${client.allEmojis.x} **You added at least one Filter, which is invalid!**`)
                                .setDescription("**To define Multiple Filters add a SPACE (` `) in between!**")
                                .addField("**All Valid Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom are having there own Command, please use them to define what custom amount u want!*")
                        ],
                    })
                }

                let toRemove = [];
                //add new filters    bassboost, clear    --> [clear] -> [bassboost]   
                filters.forEach((f) => {
                    if (newQueue.filters.includes(f)) {
                        toRemove.push(f)
                    }
                })
                if (!toRemove || toRemove.length == 0) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.errColor)
                                .setFooter(client.user.username, client.user.displayAvatarURL())
                                .setTitle(`${client.allEmojis.x} **You did not add a Filter, which is in the Filters.**`)
                                .addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                        ],
                    })
                }

                await newQueue.setFilter(toRemove);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`♨️ **Removed ${toRemove.length} ${toRemove.length == filters.length ? "Filters" : `of ${filters.length} Filters! The Rest wasn't a part of the Filters yet!`}**`)
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
            errDM(client, e)
        }
    }
}