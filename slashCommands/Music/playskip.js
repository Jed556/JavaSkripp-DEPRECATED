const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { check_if_dj } = require("../../handlers/functions");

module.exports = {
    name: "playskip",
    description: "Skips the current song and plays a song/playlist",
    category: "Music",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "song",
                description: "Song to play",
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

            if (channel.userLimit != 0 && channel.full)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`:x: Your Voice Channel is full, I can't join!`)
                    ],
                    ephemeral: true
                });

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`:x: I am already connected somewhere else`)
                    ],
                    ephemeral: true
                });
            }

            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
            const Text = options.getString("song"); //same as in StringChoices //RETURNS STRING 
            //update it without a response!
            await interaction.reply({
                content: `🔍 Searching... \`\`\`${Text}\`\`\``,
                ephemeral: true
            });

            try {
                let queue = client.distube.getQueue(guildId)
                let options = {
                    member: member,
                    skip: true
                }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                if (queue) {
                    if (check_if_dj(client, member, queue.songs[0])) {
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.errColor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
                                .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
                            ],
                            ephemeral: true
                        });
                    }
                }
                await client.distube.playVoiceChannel(channel, Text, options)
                //Edit the reply
                interaction.editReply({
                    content: `${queue?.songs?.length > 0 ? "⏭ Skipping to" : "🎶 Now Playing"}: \`\`\`\n${Text}\n\`\`\``,
                    ephemeral: true
                });
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