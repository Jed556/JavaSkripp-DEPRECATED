const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { onCoolDown } = require("../../handlers/functions");
const { MessageEmbed } = require("discord.js")

module.exports = (client, interaction) => {
    if (client.maintenance && interaction.user.id != config.ownerID) {
        return interaction.reply({
            embeds: [new MessageEmbed()
                .setTimestamp()
                .setColor(emb.errColor)
                .setAuthor("UNDER MAINTENANCE", emb.maintenance.on)
                .setDescription("JavaSkripp will be back ASAP!")
                .setFooter(client.user.username, client.user.displayAvatarURL())
            ],
            ephemeral: true
        })
    }

    const CategoryName = interaction.commandName;

    if (interaction.guildId == null) return;

    client.settings.ensure(interaction.guildId, {
        prefix: config.prefix,
        defaultvolume: 100,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
    })
    let prefix = client.settings.get(interaction.guildId)
    let command = false;

    try {
        if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
            command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
        }
    } catch {
        if (client.slashCommands.has("normal" + CategoryName)) {
            command = client.slashCommands.get("normal" + CategoryName);
        }
    }
    if (command) {
        let botchannels = client.settings.get(interaction.guildId, `botchannel`);
        if (!botchannels || !Array.isArray(botchannels)) botchannels = [];
        if (botchannels.length > 0) {
            if (!botchannels.includes(interaction.channelId) && !interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setAuthor(`COMMANDS ARE DISABLED IN THIS CHANNEL`, emb.alert)
                        .setDescription(`**Execute it in:\n> ${botchannels.map(c => `<#${c}>`).join(", ")}**`)
                    ],
                    ephemeral: true
                })
            }
        }

        if (onCoolDown(interaction, command)) {
            const timeLeft = onCoolDown(interaction, command);
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor("Cooldown", emb.cooldown)
                    .addField("Time Left", `${timeLeft} sec${(timeLeft != 1) ? "s" : ""}`)
                    .addField("Command", command)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            })
        };

        //if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor("Invalid Permission", emb.noPermission)
                    .addField("Required Permissions", `${(command && command.memberpermissions) ? command.memberpermissions.map(v => `\`${v}\``).join(",") : command.memberpermissions}`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            })
        };

        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor("Invalid Role", emb.noRole)
                    .addField("Required Roles", `${(command && command.requiredroles) ? command.requiredroles.map(v => `<@&${v}>`).join(",") : command.requiredroles}`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            })
        }

        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(emb.errColor)
                    .setAuthor("Invalid User", emb.invalidUser)
                    .addField("Allowed Users", `${(command && command.alloweduserids) ? command.alloweduserids.map(v => `<@${v}>`).join(",") : command.alloweduserids}`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ],
                ephemeral: true
            })
        }

        //execute the Command
        command.run(client, interaction)
    }
}