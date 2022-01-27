const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "nowplaying",
    category: "Music",
    description: "Displays the current playing song",
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
                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                ],
                ephemeral: true
            })

                let newTrack = newQueue.songs[0];
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setTitle(newTrack.name)
                        .setURL(newTrack.url)
                        .addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
                        .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                        .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
                        .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
                        .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.emoji.check} \`Queue\`` : `${client.emoji.check} \`Song\`` : `${client.emoji.x}`}`, true)
                        .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.emoji.check}` : `${client.emoji.x}`}`, true)
                        .addField(`⬇ Download Song:`, `>>> [\`Download here\`](${newTrack.streamURL})`, true)
                        .addField(`🎙 Filter${newQueue.filters.length > 0 ? "s" : ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f => `\`${f}\``).join(`, `)}` : `${client.emoji.x}`}`, newQueue.filters.length > 1 ? false : true)
                        .addField(`<:Youtube:840260133686870036>  View${newTrack.views > 0 ? "s" : ""}:`, `>>> \`${newTrack.views}\``, true)
                        .addField(`:thumbsup: Like${newTrack.likes > 0 ? "s" : ""}:`, `>>> \`${newTrack.likes}\``, true)
                        .addField(`:thumbsdown: Dislike${newTrack.dislikes > 0 ? "s" : ""}:`, `>>> \`${newTrack.dislikes}\``, true)
                        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                        .setFooter(`Played in: ${guild.name}`, guild.iconURL({ dynamic: true }))
                        .setTimestamp()
                    ]
                }).catch((e) => {
                    onsole.log(e.stack ? e.stack : e)
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