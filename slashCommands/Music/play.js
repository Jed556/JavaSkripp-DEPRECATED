const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "play",
    description: "Plays a song/playlist in your voice channel",
    category: "Music",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "song",
                description: "Song to play",
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
                embeds: [new MessageEmbed()
                    .setColor(emb.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, emb.discAlert)
                ],
                ephemeral: true
            })

            if (channel.userLimit != 0 && channel.full && !channel)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Your Voice Channel is full!`, emb.discAlert)
                    ],
                    ephemeral: true
                });

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`I am already connected somewhere else`, emb.discAlert)
                    ],
                    ephemeral: true
                });
            }
            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
            const Text = options.getString("song"); //same as in StringChoices //RETURNS STRING 
            //update it without a response!
            await interaction.reply({
                content: `🔍 Searching... \`\`\`${Text}\`\`\``,
                ephemeral: true
            });

            try {
                let queue = client.distube.getQueue(guildId)
                let options = {
                    member: member,
                }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                await client.distube.playVoiceChannel(channel, Text, options)
                //Edit the reply
                interaction.editReply({
                    content: `${queue?.songs?.length > 0 ? `${client.emojis.check} Added` : "🎶 Now Playing"}: \`\`\`\n${Text}\n\`\`\``,
                    ephemeral: true
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.emojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
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