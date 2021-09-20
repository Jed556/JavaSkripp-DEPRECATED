const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { check_if_dj } = require("../../handlers/functions");

module.exports = {
    name: "move",
    description: "Moves one Song to another Place",
    category: "Queue",
    cooldown: 3,
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
                name: "where",
                description: "Where to move the song (1 == after current, -1 == Top)",
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
                embeds: [
                    new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
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
                    ],
                    ephemeral: true
                });
            }
            
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now**`)
                    ],
                    ephemeral: true
                })
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
                            .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                        ephemeral: true
                    });
                }
                let songIndex = options.getInteger("song");
                let position = options.getInteger("where");
                if (position >= newQueue.songs.length || position < 0) position = -1;
                if (songIndex > newQueue.songs.length - 1) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **This Song does not exist!**`)
                        .setDescription(`**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
                    ],
                    ephemeral: true
                })
                if (position == 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Cannot move Song before Playing Song!**`)
                    ],
                    ephemeral: true
                })
                let song = newQueue.songs[songIndex];
                //remove the song
                newQueue.songs.splice(songIndex);
                //Add it to a specific Position
                newQueue.addToQueue(song, position)
                interaction.reply({
                    embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(`📑 Moved **${song.name}** to the **\`${position}th\`** Place right after **_${newQueue.songs[position - 1].name}_!**`)
                      .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor)
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