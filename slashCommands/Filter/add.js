const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

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

            if (!channel || channel.guild.me.voice.channel.id != channel.id)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setAuthor(`JOIN ${guild.me.voice.channel ? "MY" : "A"} VOICE CHANNEL FIRST!`, emb.disc.alert)
                        .setDescription(channel.id ? `**Channel: <#${channel.id}>**` : "")
                    ],
                    ephemeral: true
                })

            if (channel.userLimit != 0 && channel.full && !channel)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setAuthor(`YOUR VOICE CHANNEL IS FULL`, emb.disc.alert)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                    ephemeral: true
                });

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setAuthor(`NOTHING PLAYING YET`, emb.disc.alert)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                    ephemeral: true
                })

                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTimestamp()
                            .setColor(emb.errColor)
                            .setAuthor(`YOU ARE NOT A DJ OR THE SONG REQUESTER`, emb.disc.alert)
                            .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                        ],
                        ephemeral: true
                    });
                }

                let filters = options.getString("filters").toLowerCase().split(" ");
                if (!filters) filters = [options.getString("filters").toLowerCase()]
                if (filters.some(a => !FiltersSettings[a])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emoji.x} **You added at least one Filter, which is invalid!**`)
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
                                .setColor(emb.errColor)
                                .setFooter(client.user.username, client.user.displayAvatarURL())
                                .setTitle(`${client.emoji.x} **You did not add a Filter, which is not in the Filters yet.**`)
                                .addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                        ],
                    })
                }

                await newQueue.setFilter(toAdded);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setTimestamp()
                        .setTitle(`♨️ **Added ${toAdded.length} ${toAdded.length == filters.length ? "Filters" : `of ${filters.length} Filters! The Rest was already a part of the Filters!`}**`)
                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.errColor)
                        .setAuthor(`AN ERROR OCCURED`, emb.disc.error)
                        .setDescription(`\`/info support\` for support or DM me \`${client.user.tag}\` \`\`\`${e}\`\`\``)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
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