const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "list",
    description: "Lists the current queue",
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
                embeds: [ new MessageEmbed()
                    .setColor(emb.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, emb.discAlert)
                ],
                ephemeral: true
            })

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Join __my__ Voice Channel!`, emb.discAlert)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                    ephemeral: true
                });
            }

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setAuthor(`Nothing playing right now`, emb.discAlert)
                    ],
                    ephemeral: true
                })
                
                let embeds = [];
                let k = 10;
                let theSongs = newQueue.songs;
                //defining each Pages
                for (let i = 0; i < theSongs.length; i += 10) {
                    let qus = theSongs;
                    const current = qus.slice(i, k)
                    let j = i;
                    const info = current.map((track) => `**${j++} -** [\`${String(track.name).replace(/\[/igu, "{").replace(/\]/igu, "}").substr(0, 60)}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
                    const embed = new MessageEmbed()
                        .setColor(emb.color)
                        .setDescription(`${info}`)
                    if (i < 10) {
                        embed.setTitle(`📑 **Top ${theSongs.length > 50 ? 50 : theSongs.length} | Queue of ${guild.name}**`)
                        embed.setDescription(`**(0) Current Song:**\n> [\`${theSongs[0].name.replace(/\[/igu, "{").replace(/\]/igu, "}")}\`](${theSongs[0].url})\n\n${info}`)
                    }
                    embeds.push(embed);
                    k += 10; //Raise k to 10
                }
                if (theSongs.length > 1) {
                    embeds[embeds.length - 1] = embeds[embeds.length - 1]
                        .setFooter(client.user.username + `\n${theSongs.length} Songs in Queue | Duration: ${newQueue.formattedDuration}`, client.user.displayAvatarURL())
                } else {
                    embeds[embeds.length - 1] = embeds[embeds.length - 1]
                        .setFooter(client.user.username + `\n${theSongs.length} Song in Queue | Duration: ${newQueue.formattedDuration}`, client.user.displayAvatarURL())
                }
                let pages = []
                for (let i = 0; i < embeds.length; i += 3) {
                    pages.push(embeds.slice(i, i + 3));
                }
                pages = pages.slice(0, 24)
                const Menu = new MessageSelectMenu()
                    .setCustomId("QUEUEPAGES")
                    .setPlaceholder("Select a Page")
                    .addOptions([
                        pages.map((page, index) => {
                            let Obj = {};
                            Obj.label = `Page ${index}`
                            Obj.value = `${index}`;
                            Obj.description = `Shows the ${index}/${pages.length - 1} Page`
                            return Obj;
                        })
                    ])
                const row = new MessageActionRow().addComponents([Menu])
                interaction.reply({
                    embeds: [embeds[0]],
                    components: [row],
                    ephemeral: true
                });

                //Event
                client.on('interactionCreate', (i) => {
                    if (!i.isSelectMenu()) return;
                    if (i.customId === "QUEUEPAGES" && i.applicationId == client.user.id) {
                        i.reply({
                            embeds: pages[Number(i.values[0])],
                            ephemeral: true
                        }).catch(e => { })
                    }
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.emoji.x} | Error: `,
                    embeds: [
                        new MessageEmbed().setColor(emb.errColor)
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