const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

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
        },
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
                    new MessageEmbed().setColor(embed.errColor).setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, embed.discAlert)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Join __my__ Voice Channel!`, embed.discAlert)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                    ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(embed.errColor).setAuthor(`Nothing playing right now`, embed.discAlert)
                    ],
                    ephemeral: true
                })
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(embed.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.x} **You are not a DJ and not the Song Requester!**`)
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
                        new MessageEmbed().setColor(embed.errColor).setTitle(`${client.emojis.x} **This Song does not exist!**`)
                            .setDescription(`**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
                    ],
                    ephemeral: true
                })
                if (position == 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed().setColor(embed.errColor).setTitle(`${client.emojis.x} **Cannot move Song before Playing Song!**`)
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
                        .setColor(embed.color)
                        .setTimestamp()
                        .setTitle(`📑 Moved **${song.name}** to the **\`${position}th\`** Place right after **_${newQueue.songs[position - 1].name}_!**`)
                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.emojis.x} | Error: `,
                    embeds: [
                        new MessageEmbed().setColor(embed.errColor)
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