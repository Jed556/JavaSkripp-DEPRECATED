const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "help",
    cooldown: 1,
    description: "Returns all Commmands, or one specific command",
    category: "Bot",
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            let args = options.getString("command");
            if (args && args.length > 0) {
                const embed = new MessageEmbed();
                const cmd = client.slashCommands.get(args.toLowerCase());

                if (!cmd) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [embed.setColor(emb.errColor).setDescription(`No Information found for command **${args.toLowerCase()}**`)]
                    });
                }

                if (cmd.name) embed.addField("**Command name**", `\`${cmd.name}\``);
                if (cmd.name) embed.setTitle(`Detailed Information about:\`${cmd.name}\``);
                if (cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);
                if (cmd.aliases) embed.addField("**Aliases**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
                if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown}\` Seconds`);
                else embed.addField("**Cooldown**", `\`${config.defaultCooldown}\` Second`);
                if (cmd.usage) {
                    embed.addField("**Usage**", `\`/${cmd.usage}\``);
                    embed.setFooter("Syntax: <> = required, [] = optional");
                }
                return interaction.reply({
                    ephemeral: true,
                    embeds: [embed.setColor(emb.color)]
                });
            } else {
                const embed = new MessageEmbed()
                    .setColor(emb.color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTitle("HELP MENU 🔰 Commands")
                    .setDescription(`[**Click here to invite me!**]( ${emb.invite} )`)
                    .setFooter(`List of commands are also available in / > JavaSkripp`, client.user.displayAvatarURL());
                const slashCommands = (category) => {
                    return client.slashCommands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
                };
                try {
                    for (let i = 0; i < client.slashCategories.length; i += 1) {
                        const current = client.slashCategories[i];
                        const items = slashCommands(current);
                        embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `${items.length ? `> ${items.join(", ")}` : "\u200b"}`);
                    }
                } catch (e) {
                    console.log(String(e.stack).red);
                }
                interaction.reply({
                    ephemeral: true,
                    embeds: [embed]
                });
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
            return interaction.reply({
                ephemeral: true,
                embeds: [new MessageEmbed()
                    .setColor(emb.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTitle(`${client.emoji.x} ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
                ]
            });
        }
    }
}