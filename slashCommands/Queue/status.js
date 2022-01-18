const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "status",
    description: "Shows the queue status",
    category: "Queue",
    cooldown: 3,
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
                    .setColor(embed.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, embed.discAlert)
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
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setAuthor(`Nothing playing right now`, embed.discAlert)
                    ],
                    ephemeral: true
                })

                var djs = client.settings.get(newQueue.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`Not Set`";
                else djs.slice(0, 15).join(", ");
                let newTrack = newQueue.songs[0];
                let embed = new MessageEmbed().setColor(embed.color)
                    .setDescription(`**[${newTrack.name}](${newTrack.url})**`)
                    .addField(`${(newTrack.user === client.user) ? "💡 Autoplay by:" : "💡 Request by:"}`, `>>> ${newTrack.user}`, true)
                    .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                    .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song${newQueue.songs.length != 1 ? "s" : ""}\` - \`${newQueue.formattedDuration}\``, true)
                    .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
                    .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.emojis.check}\` Queue\`` : `${client.emojis.check} \`Song\`` : `${client.emojis.x}`}`, true)
                    .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.emojis.check}` : `${client.emojis.x}`}`, true)
                    .addField(`⬇ Download:`, `>>> [\`Music Link\`](${newTrack.streamURL})`, true)
                    .addField(`🎙 Filter${newQueue.filters.length != 1 ? "s" : ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f => `\`${f}\``).join(`, `)}` : `${client.emojis.x}`}`, newQueue.filters.length > 2 ? false : true)
                    .addField(`💿 DJ-Role${client.settings.get(newQueue.id, "djroles").length > 1 ? "s" : ""}:`, `>>> ${djs}`, (client.settings.get(newQueue.id, "djroles").length > 2 || djs != "`Not Set`") ? false : true)
                    .setAuthor(`DASHBOARD | NOW PLAYING`, embed.discSpin)
                    .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                    .setFooter(`${newTrack.user.tag}`, newTrack.user.displayAvatarURL({ dynamic: true }));
                interaction.reply({
                    embeds: [embed]
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