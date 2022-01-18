const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "dj",
    cooldown: 3,
    description: "Manages the DJs!",
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
                    ["Add Dj-Role", "add"],
                    ["Remove Dj-Role", "remove"],
                ]
            }
        },
        {
            "Role": {
                name: "role",
                description: "Role to add/remove",
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
            let Role = options.getRole("role");
            client.settings.ensure(guild.id, { djroles: [] });

            if (add_remove == "add") {
                if (client.settings.get(guild.id, "djroles").includes(Role.id)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.x} **This Role is already a DJ-ROLE!**`)
                        ],
                    })
                }
                client.settings.push(guild.id, Role.id, "djroles");
                var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.join(", ");
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.check} **The Role \`${Role.name}\` got added to the ${client.settings.get(guild.id, "djroles").length - 1} DJ-Roles!**`)
                        .addField(`🎧 **DJ-Role${client.settings.get(guild.id, "djroles").length > 1 ? "s" : ""}:**`, `>>> ${djs}`, true)
                    ],
                })
            } else {
                if (!client.settings.get(guild.id, "djroles").includes(Role.id)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed()
                            .setColor(emb.errColor)
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                            .setTitle(`${client.emojis.x} **This Role is not a DJ-ROLE yet!**`)
                        ],
                    })
                }
                client.settings.remove(guild.id, Role.id, "djroles");
                var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.join(", ");
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emojis.check} **The Role \`${Role.name}\` got removed from the ${client.settings.get(guild.id, "djroles").length} DJ-Roles!**`)
                        .addField(`🎧 **DJ-Role${client.settings.get(guild.id, "djroles").length > 1 ? "s" : ""}:**`, `>>> ${djs}`, true)
                    ],
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}