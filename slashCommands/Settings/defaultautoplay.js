const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

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
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`${client.allEmojis.check_mark} **The Default-Autoplay got __\`${client.settings.get(guild.id, "defaultautoplay") ? "Enabled" : "Disabled"}\`__!**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}