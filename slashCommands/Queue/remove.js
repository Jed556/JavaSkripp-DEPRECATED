const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/antiCrash");

module.exports = {
    name: "remove",
    description: "Removes song(s)",
    category: "Queue",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [

        {
            "Integer": {
                name: "song",
                description: "Song index to remove",
                required: true
            }
        }, //to use in the code: interacton.getInteger("ping_amount")
        {
            "Integer": {
                name: "amount",
                description: "Number of songs to remove from given index (Default: 1)",
                required: false
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
                        .setFooter(client.user.username, client.user.displayAvatarURL())
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
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
                            .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                        ephemeral: true
                    });
                }

                let songIndex = options.getInteger("song");
                let amount = options.getInteger("amount");
                if (!amount) amount = 1;
                if (songIndex > newQueue.songs.length - 1) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.errColor)
                            .setTitle(`${client.allEmojis.x} **This Song does not exist!**`)
                            .setDescription(`**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
                    ],
                    ephemeral: true
                })
                if (songIndex <= 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setTitle(`${client.allEmojis.x} **You can't remove the current Song (0)!**`)
                        .setDescription(`**Use the \`${client.settings.get(guild.id, "prefix")}skip\` (Slash)Command instead!**`)
                    ],
                    ephemeral: true
                })
                if (amount <= 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.errColor).setTitle(`${client.allEmojis.x} **You need to at least remove 1 Song!**`)
                    ],
                    ephemeral: true
                })
                newQueue.songs.splice(songIndex, amount);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`🗑 **Removed ${amount} Song${amount > 1 ? "s" : ""} out of the Queue!**`)
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
            errDM(e)
        }
    }
}