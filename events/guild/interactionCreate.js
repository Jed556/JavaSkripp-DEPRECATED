//Import Modules
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const { onCoolDown } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = (client, interaction) => {
    if (client.maintenance && interaction.user.id != config.ownerID) {
        return interaction.reply({
            embeds: [new MessageEmbed()
                .setTimestamp()
                .setColor(embed.color)
                .setTitle("UNDER MAINTENANCE")
                .setDescription("JavaSkripp will be back ASAP!")
                .setFooter(client.user.username, client.user.displayAvatarURL())
            ], ephemeral: true
        })
    }

    const CategoryName = interaction.commandName;

    if (interaction.guildId == null) return;

    let prefix = config.prefix;
    if (interaction.guildId) {
        client.settings.ensure(interaction.guildId, {
            prefix: config.prefix,
            defaultvolume: 100,
            defaultautoplay: false,
            defaultfilters: ['bassboost6', 'clear'],
            djroles: [],
        })
        prefix = client.settings.get(interaction.guildId)
    }
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
        let botchannels = client.settings.get(interaction.guildId, `botchannel`) || false;
        if (!botchannels || !Array.isArray(botchannels)) botchannels = [];
        if (botchannels.length > 0) {
            if (!botchannels.includes(interaction.channelId) && !interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new Discord.MessageEmbed()
                        .setColor(embed.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.allEmojis.x} **Executing command is restricted here!**`)
                        .setDescription(`Execute it in:\n> ${botchannels.map(c => `<#${c}>`).join(", ")}`)
                    ]
                })
            }
        }

        if (onCoolDown(interaction, command)) {
            const timeLeft = onCoolDown(interaction, command);
            return interaction.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(embed.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setAuthor("Cooldown")
                    .addField("Time Left", `${(timeLeft > 1 || timeLeft < 1) ? `${timeleft} secs` : `${timeleft} sec`}`)
                    .addField("Command", command)
                ]
            })
        };

        //if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
            return interaction.reply({
                ephemeral: true, embeds: [new Discord.MessageEmbed()
                    .setColor(embed.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setAuthor("Invalid Permission")
                    .addField("Required Permissions", `${(command && command.memberpermissions) ? command.memberpermissions.map(v => `\`${v}\``).join(",") : command.memberpermissions}`)
                ]
            })
        };

        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
            return interaction.reply({
                ephemeral: true, embeds: [new Discord.MessageEmbed()
                    .setColor(embed.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setAuthor("Invalid Role")
                    .addField("Required Roles", `${(command && command.requiredroles) ? command.requiredroles.map(v => `<@&${v}>`).join(",") : command.requiredroles}`)
                ]
            })
        }

        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
            return interaction.reply({
                ephemeral: true, embeds: [new Discord.MessageEmbed()
                    .setColor(embed.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setAuthor("Invalid User")
                    .addField("Allowed Users", `${(command && command.alloweduserids) ? command.alloweduserids.map(v => `<@${v}>`).join(",") : command.alloweduserids}`)
                ]
            })
        }

        //execute the Command
        command.run(client, interaction)
    }
}