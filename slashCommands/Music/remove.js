const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "remove",
    description: "Removes song(s)",
    category: "Music",
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
            let newQueue = client.distube.getQueue(guildId);

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

            let songIndex = options.getInteger("song");
            let amount = options.getInteger("amount");
            if (!amount) amount = 1;
            if (songIndex > newQueue.songs.length - 1) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor(`SONG INDEX DOESN'T EXIST`, emb.disc.alert)
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                ],
                ephemeral: true
            })

            if (songIndex <= 0) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor(`SONG IS CURRENTLY PLAYING`, emb.disc.alert)
                    .setDescription(`**You can't remove the currently playing song (0) \n Use the \`skip\` Slash Command instead!**`)
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                ],
                ephemeral: true
            })

            if (amount <= 0) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor(`REMOVE AT LEAST 1 SONG`, emb.disc.alert)
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                ],
                ephemeral: true
            })

            newQueue.songs.splice(songIndex, amount);
            interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.color)
                    .setAuthor(`REMOVED ${amount} SONG${amount == 1 ? "S" : ""} FROM QUEUE`, emb.disc.song.remove)
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                ]
            })
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