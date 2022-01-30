const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "jump",
    description: "Jumps to a specific song in the queue",
    category: "Queue",
    cooldown: 3,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "Integer": {
                name: "position",
                description: "To which Song do you want to jump in the Queue?",
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

                let Position = options.getInteger("position")
                if (Position > newQueue.songs.length - 1 || Position < 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.errColor)
                        .setAuthor(`POSITION INVALID`, emb.disc.alert)
                        .setDescription(`**Position must be between 0 and ${newQueue.songs.length - 1}**`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                    ephemeral: true
                })

                await newQueue.jump(Position);
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.color)
                        .setAuthor(`JUMPED TO SONG`, emb.disc.jump)
                        .setDescription(`**INDEX: ${Position}**`)
                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                    ]
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