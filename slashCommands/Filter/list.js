const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");
const { DM } = require("../../handlers/antiCrash");

module.exports = {
    name: "list",
    description: "Lists all active and possible filters",
    category: "Filter",
    cooldown: 5,
    requiredroles: [],
    alloweduserids: [],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(client.user.username, ee.footericon)
                            .addField("**All available Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom have their own Command to define a custom amount*")
                    ],
                    ephemeral: true
                })

                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(client.user.username, ee.footericon)
                            .addField("**All available Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom have their own Command to define a custom amount*")
                            .addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                    ],
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                interaction.editReply({
                    content: `${client.allEmojis.x} | Error: `,
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ],
                    ephemeral: true
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
            DM(e)
        }
    }
}