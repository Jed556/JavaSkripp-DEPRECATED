console.log("\n" + "DISTUBE HANDLER LAUNCHED".yellow);
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { lyricsEmbed, check_if_dj, errDM } = require("./functions");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const { KSoftClient } = require("@ksoft/api");
const ksoft = new KSoftClient(config.ksoftapi);
const PlayerMap = new Map()
let songEditInterval = null;

module.exports = (client) => {
    try {
        client.distube
            .on(`playSong`, async (queue, track) => {
                try {
                    client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {
                        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                } catch (error) {
                    console.log(error)
                    errDM(client, error)
                }
                try {
                    var newQueue = client.distube.getQueue(queue.id)
                    var newTrack = track;
                    var data = receiveQueueData(newQueue, newTrack)
                    //Send message with buttons
                    let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
                        PlayerMap.set(`currentmsg`, msg.id);
                        return msg;
                    })
                    //create a collector for the thinggy
                    var collector = currentSongPlayMsg.createMessageComponentCollector({
                        filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
                        time: track.duration > 0 ? track.duration * 1000 : 600000
                    }); //collector for 5 seconds
                    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
                    let lastEdited = false;

                    /**
                     * @INFORMATION - EDIT THE SONG DASHBOARD EVERY 10 SECONDS!
                     */
                    try { clearInterval(songEditInterval) } catch (e) { }
                    songEditInterval = setInterval(async () => {
                        if (!lastEdited) {
                            try {
                                var newQueue = client.distube.getQueue(queue.id)
                                var newTrack = newQueue.songs[0];
                                var data = receiveQueueData(newQueue, newTrack)
                                await currentSongPlayMsg.edit(data).catch((e) => {
                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                })
                            } catch (e) {
                                clearInterval(songEditInterval)
                            }
                        }
                    }, 10000)

                    collector.on('collect', async i => {
                        if (i.customId != `10` && check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])) {
                            return i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.errColor)
                                    .setFooter(client.user.username, client.user.displayAvatarURL())
                                    .setAuthor(`No Permission`, emb.discAlert)
                                    .setDescription(`**You are not a DJ and not the Song Requester!**\n**DJ-ROLES:**\n${check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])}`)
                                ],
                                ephemeral: true
                            });
                        }
                        lastEdited = true;
                        setTimeout(() => {
                            lastEdited = false
                        }, 7000)

                        // Check if conditions were met before proceeding
                        let { member } = i; //get the channel instance from the Member
                        const { channel } = member.voice
                        //if the member is not in a channel, return error
                        if (!channel)
                            return i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.errColor)
                                    .setAuthor(`Join a Voice Channel First!`, emb.discAlert)
                                ],
                                ephemeral: true
                            })
                        //if not in the same channel as the player, return error
                        if (channel.id !== newQueue.voiceChannel.id)
                            return i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.errColor)
                                    .setAuthor(`Join __my__ Voice Channel First! <#${channel.id}>`, emb.discAlert)
                                ],
                                ephemeral: true
                            })
                        //get the player instance
                        const queue = client.distube.getQueue(i.guild.id);
                        //if no player available return aka not playing anything
                        if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                            return i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.errColor)
                                    .setAuthor(`Nothing Playing yet`, emb.discAlert)
                                ],
                                ephemeral: true
                            })
                        }

                        // ---------------------------------------- PREVIOUS ---------------------------------------- //
                        if (i.customId == `1`) {
                            //if there are no previous songs then return error
                            if (!newQueue.previousSongs || newQueue.previousSongs.length == 0) {
                                return i.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(emb.errColor)
                                        .setAuthor(`No Previous song`, emb.discAlert)
                                    ],
                                    ephemeral: true
                                })
                            }
                            await newQueue.previous();
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`⏮ **Playing previous Song!**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                        }

                        // ---------------------------------------- SKIP ---------------------------------------- //
                        if (i.customId == `2`) {
                            //if there is nothing more to skip then stop music and leave the Channel
                            if (newQueue.songs.length == 0) {
                                //if its on autoplay mode, then do autoplay before leaving...
                                i.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(emb.color)
                                        .setTimestamp()
                                        .setTitle(`⏹ **Stopped playing and left the Channel**`)
                                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                                })
                                clearInterval(songEditInterval);
                                //edit the current song message
                                await client.distube.stop(i.guild.id)
                                return
                            }
                            //skip the track
                            await client.distube.skip(i.guild.id)
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`⏭ **Skipped to the next Song!**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                        }

                        // ---------------------------------------- STOP ---------------------------------------- //
                        if (i.customId == `3`) {
                            //stop the track
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`⏹ **Stopped playing and left the Channel!**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                            clearInterval(songEditInterval);
                            //edit the current song message
                            await client.distube.stop(i.guild.id)
                        }

                        // ---------------------------------------- PAUSE & RESUME ---------------------------------------- //
                        if (i.customId == `4`) {
                            if (newQueue.playing) {
                                await client.distube.pause(i.guild.id);
                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                })
                                i.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(emb.color)
                                        .setTimestamp()
                                        .setTitle(`⏸ **Paused!**`)
                                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                                })
                            } else {
                                //pause the player
                                await client.distube.resume(i.guild.id);
                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                })
                                i.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(emb.color)
                                        .setTimestamp()
                                        .setTitle(`▶️ **Resumed!**`)
                                        .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                                })
                            }
                        }

                        // ---------------------------------------- SHUFFLE ---------------------------------------- //
                        if (i.customId == `5`) {
                            //Pause the player
                            await newQueue.shuffle()
                            //Send success message
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`🔀 **Shuffled ${newQueue.songs.length} Songs!**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                        }

                        // ---------------------------------------- AUTOPLAY ---------------------------------------- //
                        if (i.customId == `6`) {
                            //pause the player
                            await newQueue.toggleAutoplay()
                            if (newQueue.autoplay) {
                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                })
                            } else {
                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                })
                            }
                            //Send Success Message
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`${newQueue.autoplay ? `${client.emojis.check} **Enabled Autoplay**` : `${client.emojis.x} **Disabled Autoplay**`}`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                        }

                        // ---------------------------------------- SONG LOOP ---------------------------------------- //
                        if (i.customId == `7`) {
                            //Disable the Repeatmode
                            if (newQueue.repeatMode == 1) {
                                await newQueue.setRepeatMode(0)
                            }
                            //Enable it
                            else {
                                await newQueue.setRepeatMode(1)
                            }
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`${newQueue.repeatMode == 1 ? `${client.emojis.check} **Enabled Song-Loop**` : `${client.emojis.x} **Disabled Song-Loop**`}`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                            currentSongPlayMsg.edit(data).catch((e) => {
                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            })
                        }

                        // ---------------------------------------- QUEUE LOOP ---------------------------------------- //
                        if (i.customId == `8`) {
                            //Disable the Repeatmode
                            if (newQueue.repeatMode == 2) {
                                await newQueue.setRepeatMode(0)
                            }
                            //Enable it
                            else {
                                await newQueue.setRepeatMode(2)
                            }
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`${newQueue.repeatMode == 2 ? `${client.emojis.check} **Enabled Queue-Loop**` : `${client.emojis.x} **Disabled Queue-Loop**`}`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                            currentSongPlayMsg.edit(data).catch((e) => {
                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            })
                        }

                        // ---------------------------------------- REWIND ---------------------------------------- //
                        if (i.customId == `9`) {
                            let seektime = newQueue.currentTime - 10;
                            if (seektime < 0) seektime = 0;
                            if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
                            await newQueue.seek(Number(seektime))
                            collector.resetTimer({ time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000 })
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`⏪ **Rewinded the song for \`10\` Seconds**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                            currentSongPlayMsg.edit(data).catch((e) => {
                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            })
                        }

                        // ---------------------------------------- FORWARD ---------------------------------------- //
                        if (i.customId == `10`) {
                            let seektime = newQueue.currentTime + 10;
                            if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
                            await newQueue.seek(Number(seektime))
                            collector.resetTimer({ time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000 })
                            i.reply({
                                embeds: [new MessageEmbed()
                                    .setColor(emb.color)
                                    .setTimestamp()
                                    .setTitle(`⏩ **Forwarded the song for \`10\` Seconds**`)
                                    .setFooter(`Action by: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))]
                            })
                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                            currentSongPlayMsg.edit(data).catch((e) => {
                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            })
                        }

                        // ---------------------------------------- LYRICS ---------------------------------------- //
                        if (i.customId == `11`) {
                            return i.reply({
                                content: `${client.emojis.x} **Lyrics are disabled!**\n> *Due to legal Reasons, Lyrics are disabled and won't work for an unknown amount of time!*`,
                                ephemeral: true
                            });
                            let embeds = [];
                            await ksoft.lyrics.get(newQueue.songs[0].name).then(
                                async track => {
                                    if (!track.lyrics) return i.reply({ content: `${client.emojis.x} **No Lyrics Found!**`, ephemeral: true });
                                    lyrics = track.lyrics;
                                    embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
                                }).catch(e => {
                                    console.log(e)
                                    return i.reply({ content: `${client.emojis.x} **No Lyrics Found!** \n${String(e).substr(0, 1800)}`, ephemeral: true });
                                })
                            i.reply({
                                embeds: embeds, ephemeral: true
                            })
                        }
                    });
                } catch (error) {
                    console.error(error)
                    errDM(client, error)
                }
            })

            .on(`addSong`, (queue, song) => queue.textChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(emb.color)
                        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
                        .setFooter(song.user.tag, song.user.displayAvatarURL({ dynamic: true }))
                        .setAuthor(`Song added to the Queue!`, emb.discAdd)
                        .setDescription(`Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
                        .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - 1} song${queue.songs.length != 1 ? "s" : ""}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
                        .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
                ]
            }))

            .on(`addList`, (queue, playlist) => queue.textChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(emb.color)
                        .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
                        .setFooter(playlist.user.tag, playlist.user.displayAvatarURL({ dynamic: true }))
                        .setAuthor(`Playlist added to the Queue!`, emb.discAdd)
                        .setDescription(`Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} Song${playlist.songs.length != 0 ? "s" : ""}\``)
                        .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - - playlist.songs.length} song${queue.songs.length != 1 ? "s" : ""}\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
                        .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
                ]
            }))

            // DisTubeOptions.searchSongs = true
            .on(`searchResult`, (message, result) => {
                let i = 0
                message.channel.send(`**Choose an option from below**\n${result.map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join(`\n`)}\n*Enter anything else or wait 60 seconds to cancel*`)
            })

            // DisTubeOptions.searchSongs = true
            .on(`searchCancel`, message => message.channel.send(`Searching canceled`).catch((e) => console.log(e)))

            .on(`error`, (channel, e) => {
                channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`AN ERROR OCCURED`, emb.discError)
                        .setDescription(`\`/info support\` for support or DM me \`${client.user.tag}\` \`\`\`${e}\`\`\``)
                    ]
                }).catch((e) => console.log(e))
                console.error(e)
                errDM(client, e)
            })

            .on(`empty`, queue => {
                var embed = new MessageEmbed().setColor(emb.color)
                    .setAuthor(`VOICE CHANNEL EMPTY`, emb.discAlert)
                    .setDescription(`**LEAVING THE CHANNEL...**`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embed], components: [] }).catch((e) => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            })

            .on(`searchNoResult`, message => message.channel.send(`No result found!`).catch((e) => console.log(e)))

            .on(`finishSong`, (queue, song) => {
                var embed = new MessageEmbed().setColor(emb.color)
                    .setAuthor(`DASHBOARD | SONG ENDED`, emb.discDone)
                    .setDescription(`**[${song.name}](${song.url})**`)
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
                    .setFooter(`${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg => {
                    currentSongPlayMsg.edit({ embeds: [embed], components: [] }).catch((e) => {
                        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                }).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            })

            .on(`finish`, queue => {
                queue.textChannel.send({
                    embeds: [
                        new MessageEmbed().setColor(emb.color).setFooter(client.user.username, client.user.displayAvatarURL())
                            .setAuthor("LEFT THE CHANNEL", emb.discAlert)
                            .setDescription("**No more songs left**")
                            .setTimestamp()
                    ]
                })
            })

            .on(`initQueue`, queue => {
                try {
                    client.settings.ensure(queue.id, {
                        defaultvolume: 100,
                        defaultautoplay: false,
                        defaultfilters: [`bassboost6`, `clear`]
                    })
                    let data = client.settings.get(queue.id)
                    queue.autoplay = Boolean(data.defaultautoplay);
                    queue.volume = Number(data.defaultvolume);
                    queue.setFilter(data.defaultfilters);
                } catch (error) {
                    console.error(error)
                }
            });
    } catch (e) {
        console.log(String(e.stack).bgRed)
        errDM(client, e)
    }

    function receiveQueueData(newQueue, newTrack) {
        var djs = client.settings.get(newQueue.id, `djroles`);
        if (!djs || !Array.isArray(djs)) djs = [];
        else djs = djs.map(r => `<@&${r}>`);
        if (djs.length == 0) djs = "`Not Set`";
        else djs.slice(0, 15).join(", ");
        if (!newTrack) return new MessageEmbed()
            .setColor(emb.errColor)
            .setAuthor("NO SONG FOUND", emb.discError)
            .setFooter(`${newTrack.user.tag}`, newTrack.user.displayAvatarURL({ dynamic: true }));
        var embed = new MessageEmbed().setColor(emb.color).setTimestamp()
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
            .setAuthor(`DASHBOARD | NOW PLAYING`, emb.discSpin)
            .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
            .setFooter(`${newTrack.user.tag}`, newTrack.user.displayAvatarURL({ dynamic: true }));

        let previous = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji('⏮').setLabel(`Previous`);
        let skip = new MessageButton().setStyle('PRIMARY').setCustomId('2').setEmoji(`⏭`).setLabel(`Skip`)
        let stop = new MessageButton().setStyle('DANGER').setCustomId('3').setEmoji(`⏹`).setLabel(`Stop`)
        let pause = new MessageButton().setStyle('SECONDARY').setCustomId('4').setEmoji('⏸').setLabel(`Pause`)
        let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Shuffle`)
        let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji('🔁').setLabel(`Autoplay`)
        let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Song`)
        let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('8').setEmoji(`🔁`).setLabel(`Queue`)
        let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-10 Sec`)
        let forward = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('⏩').setLabel(`+10 Sec`)
        let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('11').setEmoji('📝').setLabel(`Lyrics`).setDisabled();
        if (newQueue.songs.length == 0) {
            skip = skip.setDisabled();
        } else {
            skip = skip.setDisabled(false);
        }
        if (!newQueue.previousSongs || newQueue.previousSongs.length == 0) {
            previous = previous.setDisabled();
        } else {
            previous = previous.setDisabled(false);
        }
        if (!newQueue.playing) {
            pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
        }
        if (newQueue.autoplay) {
            autoplay = autoplay.setStyle('SECONDARY')
        }
        if (newQueue.repeatMode === 0) {
            songloop = songloop.setStyle('SUCCESS')
            queueloop = queueloop.setStyle('SUCCESS')
        }
        if (newQueue.repeatMode === 1) {
            songloop = songloop.setStyle('SECONDARY')
            queueloop = queueloop.setStyle('SUCCESS')
        }
        if (newQueue.repeatMode === 2) {
            songloop = songloop.setStyle('SUCCESS')
            queueloop = queueloop.setStyle('SECONDARY')
        }
        if (Math.floor(newQueue.currentTime) < 10) {
            rewind = rewind.setDisabled()
        } else {
            rewind = rewind.setDisabled(false)
        }
        if (Math.floor((newTrack.duration - newQueue.currentTime)) <= 10) {
            forward = forward.setDisabled()
        } else {
            forward = forward.setDisabled(false)
        }
        const row1 = new MessageActionRow().addComponents([previous, skip, stop, pause, shuffle]);
        const row2 = new MessageActionRow().addComponents([songloop, queueloop, autoplay, rewind, forward]);
        return {
            embeds: [embed],
            components: [row1, row2]
        };
    }
};