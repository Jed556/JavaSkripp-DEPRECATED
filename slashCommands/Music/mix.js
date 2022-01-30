const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "mix",
    description: "Plays a defined mix",
    category: "Music",
    cooldown: 2,
    requiredroles: [],
    alloweduserids: [],
    options: [{
        "StringChoices": {
            name: "mix",
            description: "Music mix",
            required: true,
            choices: [
                ["Blues Mix", "blues"],
                ["Charts Mix", "charts"],
                ["Chill Mix", "chill"],
                ["Default Mix", "default"],
                ["Heavymetal Mix", "heavymetal"],
                ["Gaming Mix", "gaming"],
                ["Jazz Mix", "jazz"],
                ["Metal Mix", "metal"],
                ["Magic-Release Mix", "magic-release"],
                ["NCS Mix", "ncs"],
                ["No Copyright Mix", "nocopyright"],
                ["Old Gaming Mix", "oldgaming"],
                ["Pop Mix", "pop"],
                ["Remixes Mix", "remixes"],
                ["Rock Mix", "rock"],
                ["Strange-Fruits Mix", "strange-fruits-gaming"],
            ]
        }
    },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;
            const { channel } = member.voice;
            let queue = client.distube.getQueue(guildId)
            let options = { member: member }

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

            if (check_if_dj(client, member, newQueue.songs[0])) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.errColor)
                        .setAuthor(`YOU ARE NOT A DJ OR THE SONG REQUESTER`, emb.disc.alert)
                        .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                    ephemeral: true
                });
            }

            let link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
            let args = [interaction.options.getString("mix")]
            if (args[0]) {
                //ncs | no copyrighted music
                if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
                //pop
                if (args[0].toLowerCase().startsWith("p")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
                //default
                if (args[0].toLowerCase().startsWith("d")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
                //remixes from Magic Release
                if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
                //rock
                if (args[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U";
                //oldgaming
                if (args[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
                //gaming
                if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
                //Charts
                if (args[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
                //Chill
                if (args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
                //Jazz
                if (args[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt";
                //blues
                if (args[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk";
                //strange-fruits
                if (args[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
                //magic-release
                if (args[0].toLowerCase().startsWith("ma")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
                //metal
                if (args[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
                //heavy metal
                if (args[0].toLowerCase().startsWith("h")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
            } //update it without a response!
            await interaction.reply({
                embeds: [new MessageEmbed()
                    .setAuthor(`LOADING MUSIC MIX`, emb.disc.song.loading)
                    .setDescription(`**Mix: ${args[0] ? args[0] : "DEFAULT"}**`)
                ],
                ephemeral: true
            });

            if (!queue) options.textChannel = guild.channels.cache.get(channelId)
            await client.distube.play(channel, link, options)
            //Edit the reply
            interaction.editReply({
                embeds: [new MessageEmbed()
                    .setAuthor(`LOADED MUSIC MIX`, emb.disc.song.loading)
                    .setDescription(`**NOW PLAYING: ${args[0] ? args[0] : "DEFAULT"}**`)
                ],
                ephemeral: true
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