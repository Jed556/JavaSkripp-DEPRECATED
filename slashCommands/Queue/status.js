const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/antiCrash");

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
                    .setColor(ee.errColor)
                    .setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(client.user.username, ee.footericon)
                        .setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                    ephemeral: true
                });
            }
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setTitle(`${client.allEmojis.x} **I am nothing Playing right now**`)
                    ],
                    ephemeral: true
                })
                
                var djs = client.settings.get(newQueue.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.slice(0, 15).join(", ");
                let newTrack = newQueue.songs[0];
                let embed = new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(`**[${newTrack.name}](${newTrack.url})**`)
                    .addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
                    .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                    .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song${newQueue.songs.length != 1 ? "s" : ""}\`\n\`${newQueue.formattedDuration}\``, true)
                    .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
                    .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check}\` Queue\`` : `${client.allEmojis.check} \`Song\`` : `${client.allEmojis.x}`}`, true)
                    .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check}` : `${client.allEmojis.x}`}`, true)
                    .addField(`⬇ Download Song:`, `>>> [\`Download here\`](${newTrack.streamURL})`, true)
                    .addField(`🎙 Filter${newQueue.filters.length != 1 ? "s" : ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f => `\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
                    .addField(`💿 DJ-Role${client.settings.get(newQueue.id, "djroles").length > 1 ? "s" : ""}:`, `>>> ${djs}`, client.settings.get(newQueue.id, "djroles").length > 1 ? false : true)
                    .setAuthor(`DASHBOARD | NOW PLAYING`, ee.discspin, newTrack.url)
                    .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                    .setFooter(`${newTrack.user.tag}`, newTrack.user.displayAvatarURL({ dynamic: true }));
                interaction.reply({
                    embeds: [embed]
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [
                        new MessageEmbed().setColor(ee.errColor)
                            .setDescription(`\`\`\`${e}\`\`\``)
                    ],
                    ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(e)
        }
    }
}