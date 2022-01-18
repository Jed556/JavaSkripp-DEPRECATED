const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "defaultautoplay",
    cooldown: 3,
    description: "Toggles the defaults for autoplay",
    category: "Settings",
    memberpermissions: ["MANAGE_GUILD "],
    requiredroles: [],
    alloweduserids: [],
    
    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            client.settings.ensure(guild.id, {
                defaultvolume: 100,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`]
            });

            client.settings.set(guild.id, !client.settings.get(guild.id, "defaultautoplay"), "defaultautoplay");
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(emb.color)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTitle(`${client.emojis.check} **The Default-Autoplay got __\`${client.settings.get(guild.id, "defaultautoplay") ? "Enabled" : "Disabled"}\`__!**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}