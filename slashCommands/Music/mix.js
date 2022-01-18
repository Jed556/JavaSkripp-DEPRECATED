const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
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

            if (!channel) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(embed.errColor)
                    .setAuthor(`Join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!`, embed.discAlert)
                ],
                ephemeral: true
            })

            if (channel.userLimit != 0 && channel.full && !channel)
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`Your Voice Channel is full!`, embed.discAlert)
                    ],
                    ephemeral: true
                });

            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`I am already connected somewhere else`, embed.discAlert)
                    ],
                    ephemeral: true
                });
            }

            let link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
            let args = [interaction.options.getString("mix")]
            if (args[0]) {
                //ncs | no copyrighted music
                if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
                //pop
                if (args[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
                //default
                if (args[0].toLowerCase().startsWith("d")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
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
                content: `${client.allEmojis.loading} Loading the **'${args[0] ? args[0] : "Default"}' Music Mix**`,
                ephemeral: true
            });

            try {
                let queue = client.distube.getQueue(guildId)
                let options = {
                    member: member,
                }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                await client.distube.playVoiceChannel(channel, link, options)
                //Edit the reply
                interaction.editReply({
                    content: `${queue?.songs?.length > 0 ? `${client.allEmojis.check} Loaded` : "🎶 Now Playing"}: the **'${args[0] ? args[0] : "Default"}'**`,
                    ephemeral: true
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(embed.errColor)
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