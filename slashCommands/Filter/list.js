const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");
const { errDM } = require("../../handlers/functions");

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
            let newQueue = client.distube.getQueue(guildId);

            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .addField("**All available Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom have their own Command to define a custom amount*")
                ],
                ephemeral: true
            })

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(emb.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .addField("**All available Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom have their own Command to define a custom amount*")
                        .addField("**All __current__ Filters:**", newQueue.filters && newQueue.filters.length > 0 ? newQueue.filters.map(f => `\`${f}\``).join(", ") : `None`)
                ],
            })
        } catch (e) {
            console.log(e.stack ? e.stack : e)
            interaction.editReply({
                content: `${client.emoji.x} | Error: `,
                embeds: [new MessageEmbed()
                    .setColor(emb.errColor)
                    .setDescription(`\`\`\`${e}\`\`\``)
                ],
                ephemeral: true
            })
            errDM(client, e)
        }
    }
}