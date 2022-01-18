const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "loop",
    description: "Enable/Disable a loop",
    category: "Queue",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "StringChoices": {
                name: "loop",
                description: "Loop to disable/enable",
                required: true,
                choices: [
                    ["Disable", "0"],
                    ["Song Loop", "1"],
                    ["Queue Loop", "2"]
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
                    .setColor(emb.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, emb.discAlert)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Join __my__ Voice Channel!`, emb.discAlert)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                    ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setAuthor(`Nothing playing right now`, emb.discAlert)
                    ],
                    ephemeral: true
                })
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emoji.x} **You are not a DJ and not the Song Requester!**`)
                            .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                        ephemeral: true
                    });
                }

                let loop = Number(options.getString("loop"))
                await newQueue.setRepeatMode(loop);
                if (newQueue.repeatMode == 0) {
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(emb.color)
                            .setTimestamp()
                            .setTitle(`${client.emoji.x} **Disabled the Loop Mode!**`)
                            .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                    })
                } else if (newQueue.repeatMode == 1) {
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(emb.color)
                            .setTimestamp()
                            .setTitle(`🔂 **Enabled the __Song__-Loop** ||(Disabled the **Queue-Loop**)||`)
                            .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                    })
                } else {
                    interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(emb.color)
                            .setTimestamp()
                            .setTitle(`🔁 **Enabled the __Queue__-Loop!** ||(Disabled the **Song-Loop**)||`)
                            .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                    })
                }
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.emoji.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
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