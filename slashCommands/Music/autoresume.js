const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "autoresume",
    description: "Autoresume music if the bot restarts (Toggles autoresume)",
    category: "Music",
    cooldown: 2,
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
                    .setColor(emb.errColor)
                    .setTitle(`${client.emojis.x} **Please join ${guild.me.voice.channel ? "my" : "a"} VoiceChannel First!**`)
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

            client.settings.set(guild.id, !client.settings.get(guild.id, "autoresume"), "autoresume");
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.check} **The Autoresume __\`${client.settings.get(guild.id, "autoresume") ? "Enabled" : "Disabled"}\`__!**`)
                ],
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}