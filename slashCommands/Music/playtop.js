const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "playtop",
    description: "Plays a song/playlist and adds it to the top",
    category: "Music",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "song",
                description: "Which Song do you want to play",
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
                    .setColor(embed.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, embed.discAlert)
                ],
                ephemeral: true
            })

            if (channel.userLimit != 0 && channel.full && !channel)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Your Voice Channel is full!`, embed.discAlert)
                    ],
                    ephemeral: true
                });

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`<:declined:780403017160982538> I am already connected somewhere else`)
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
                    unshift: true
                }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                if (queue) {
                    if (check_if_dj(client, member, queue.songs[0])) {
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(embed.errColor)
                                .setFooter(client.user.username, client.user.displayAvatarURL())
                                .setTitle(`${client.emojis.x} **You are not a DJ and not the Song Requester!**`)
                                .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
                            ],
                            ephemeral: true
                        });
                    }
                }
                await client.distube.playVoiceChannel(channel, Text, options)

                //Edit the reply
                interaction.editReply({
                    content: `${queue?.songs?.length > 0 ? `${client.emojis.check} Added to the Top of the Queue` : "🎶 Now Playing"}: \`\`\`\n${Text}\n\`\`\``,
                    ephemeral: true
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.emojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
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