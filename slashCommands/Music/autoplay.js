const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "autoplay",
    description: "Plays a song related to current track after it finishes (Toggles autoplay)",
    category: "Music",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],

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

                await newQueue.toggleAutoplay();
                if (newQueue.autoplay) {
                    i.reply({
                        embeds: [new MessageEmbed()
                            .setTimestamp()
                            .setColor(emb.color)
                            .setAuthor(`ENABLED AUTOPLAY`, emb.disc.autoplay.on)
                            .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                        ]
                    })
                } else {
                    i.reply({
                        embeds: [new MessageEmbed()
                            .setTimestamp()
                            .setColor(emb.color)
                            .setAuthor(`DISABLED AUTOPLAY`, emb.disc.autoplay.off)
                            .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                        ]
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