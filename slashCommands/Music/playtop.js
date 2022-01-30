const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
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

            let newQueue = client.distube.getQueue(guildId);
            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(emb.errColor)
                    .setAuthor(`NOTHING PLAYING YET`, emb.disc.alert)
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
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

            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
            const Text = options.getString("song"); //same as in StringChoices //RETURNS STRING 
            //update it without a response!
            await interaction.reply({
                embeds: [new MessageEmbed()
                    .setAuthor(`SEARCHING`, emb.disc.spin)
                    .setDescription(`Song: **${Text}**`)
                ],
                ephemeral: true
            });

            try {
                let queue = client.distube.getQueue(guildId)
                let options = { member: member, unshift: true }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                await client.distube.play(channel, Text, options)
            } catch (e) {
                console.log(e.stack ? e.stack.bgRed : e.bgRed)
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
                errDM(client, e)
            }

            //Edit the reply
            interaction.editReply({
                embeds: [new MessageEmbed()
                    .setAuthor(`SKIPPED TO SONG`, emb.disc.song.add)
                    .setDescription(`Song: **${Text}**`)
                ],
                ephemeral: true
            });
        } catch (e) {
            console.log(e.stack ? e.stack.bgRed : e.bgRed)
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
            errDM(client, e)
        }
    }
}