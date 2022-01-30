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
                    embed.setAuthor(`TOP ${theSongs.length > 50 ? 50 : theSongs.length} | QUEUE OF ${guild.name}`, emb.disc.list)
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
                .setPlaceholder("Select Page")
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