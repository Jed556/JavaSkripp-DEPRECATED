const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "botchat",
    cooldown: 1,
    description: "Manages the Bot-Chats!",
    category: "Settings",
    memberpermissions: ["MANAGE_GUILD "],
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "StringChoices": {
                name: "action",
                description: "Action to do",
                required: true,
                choices: [
                    ["Add Whitelisted Bot-Chat", "add"],
                    ["Remove Whitelisted Bot-Chat", "remove"],
                ]
            }
        },
        {
            "Channel": {
                name: "channel",
                description: "Channel to add/remove",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            let add_remove = options.getString("action");
            let Channel = options.getChannel("channel");
            client.settings.ensure(guild.id, { botchannel: [] });

            if (add_remove == "add") {
                if (client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.x} **This Channel is already a whitelisted Bot-Channel!**`)
                        ],
                    })
                }
                client.settings.push(guild.id, Channel.id, "botchannel");
                var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.join(", ");
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.check} **The Channel \`${Channel.name}\` got added to the ${client.settings.get(guild.id, "djroles").length - 1} whitelisted Bot-Channels!**`)
                        .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s" : ""}:**`, `>>> ${djs}`, true)
                    ],
                })
            } else {
                if (!client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.x} **This Channel is not a whitelisted Bot-Channel yet!**`)
                        ],
                    })
                }
                client.settings.remove(guild.id, Channel.id, "botchannel");
                var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.join(", ");
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.check} **The Channel \`${Channel.name}\` got removed from the ${client.settings.get(guild.id, "djroles").length} whitelisted Bot-Channels!**`)
                        .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s" : ""}:**`, `>>> ${djs}`, true)
                    ],
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}