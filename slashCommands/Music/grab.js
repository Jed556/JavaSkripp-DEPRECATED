const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "grab",
    category: "Music",
    description: "Grabs the current song and sends it to your DMs",
    cooldown: 1,
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
                    .setColor(ee.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, ee.discAlert)
                ], ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Join __my__ Voice Channel!`, ee.discAlert)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ], ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setAuthor(`Nothing playing right now`, ee.discAlert)
                    ], ephemeral: true
                })

                let newTrack = newQueue.songs[0];
                member.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(newTrack.name)
                        .setURL(newTrack.url)
                        .addField(`${(newTrack.user === client.user) ? "💡 Autoplay by:" : "💡 Request by:"}`, `>>> ${newTrack.user}`, true)
                        .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                        .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song${newQueue.songs.length != 1 ? "s" : ""}\` - \`${newQueue.formattedDuration}\``, true)
                        .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
                        .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check} \`Queue\`` : `${client.allEmojis.check} \`Song\`` : `${client.allEmojis.x}`}`, true)
                        .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check}` : `${client.allEmojis.x}`}`, true)
                        .addField(`⬇ Download:`, `>>> [\`Music Link\`](${newTrack.streamURL})`, true)
                        .addField(`🎙 Filter${newQueue.filters.length != 1 ? "s" : ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f => `\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 2 ? false : true)
                        .addField("\u200b", `\u200b`, true)
                        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                        .setFooter(`Played in: ${guild.name}`, guild.iconURL({ dynamic: true }))
                        .setTimestamp()
                    ]
                }).then(() => {
                    interaction.reply({
                        content: `📪 **Grabbed! Check your DMs!**`,
                        ephemeral: true
                    })
                }).catch(() => {
                    interaction.reply({
                        content: `${client.allEmojis.x} **I can't DM you!**`,
                        ephemeral: true
                    })
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ], ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}