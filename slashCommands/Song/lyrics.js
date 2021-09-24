const { MessageEmbed } = require("discord.js");
const { KSoftClient } = require('@ksoft/api');
const config = require(`../../botconfig/config.json`);
const ksoft = new KSoftClient(config.ksoftapi);
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { lyricsEmbed, check_if_dj } = require("../../handlers/functions");

module.exports = {
    name: "lyrics",
    category: "Music",
    description: "Shows the Lyrics of the current song",
    cooldown: 10,
    requiredroles: [],
    alloweduserids: [],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;
            const { channel } = member.voice;

            if (!channel) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ], ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`${client.allEmojis.x} **I am nothing Playing right now**`)
                    ], ephemeral: true
                })

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} Lyrics are Disabled!`)
                        .setDescription(`**Due to legal reasons, lyrics are disabled and won't work for an unknown amount of time!**`)
                    ],
                });

                let embeds = [];
                await ksoft.lyrics.get(newQueue.songs[0].name).then(
                    async track => {
                        if (!track.lyrics) return interaction.reply({
                            content: `${client.allEmojis.x} **No Lyrics Found!**`,
                            ephemeral: true
                        });
                        lyrics = track.lyrics;
                        embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
                    }).catch(e => {
                        console.log(e)
                        return interaction.reply({
                            content: `${client.allEmojis.x} **No Lyrics Found!**\n${String(e).substr(0, 1800)}`,
                            ephemeral: true
                        });
                    })
                interaction.reply({
                    embeds: embeds,
                    ephemeral: true
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ], ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}