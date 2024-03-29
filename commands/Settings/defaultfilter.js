const { MessageEmbed } = require("discord.js");
const config = require("../../config/client.json");
const emb = require("../../config/embed.json");

const filters = require("../../config/filters.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "defaultfilter",
    cooldown: 3,
    usage: "defaultfilter",
    description: "Sets the default filter(s)",
    category: "Settings",
    memberpermissions: ["MANAGE_GUILD "],
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "String": {
                name: "filters",
                description: "Filter(s) to set as default",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            let args = options.getString("filters").split(" ");
            if (!args) args = [options.getString("filters")]

            if (args.some(a => !filters[a])) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setTitle(`${client.emoji.x} **You added at least one Filter, which is invalid!**`)
                        .setDescription("**To define Multiple Filters add a SPACE (` `) in between!**")
                        .addField("**All Valid Filters:**", Object.keys(filters).map(f => `\`${f}\``).join(", "))
                    ],
                })
            }

            client.settings.set(guild.id, args, "defaultfilters");
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(emb.color)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTitle(`${client.emoji.check} **The new Default-Filter${args.length > 0 ? "s are" : " is"}:**`)
                    .setDescription(`${args.map(a => `\`${a}\``).join(", ")}`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}