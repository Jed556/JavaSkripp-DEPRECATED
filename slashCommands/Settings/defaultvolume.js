const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");

module.exports = {
    name: "defaultvolume",
    cooldown: 3,
    description: "Sets the default song volume",
    category: "Settings",
    memberpermissions: ["MANAGE_GUILD "],
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "Integer": {
                name: "volume",
                description: "Volume to set (0 - 150)",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId, commandName,
                deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
            const { guild } = member;

            let volume = options.getInteger("volume");
            client.settings.ensure(guild.id, {
                defaultvolume: 100
            });

            if (!volume || (volume > 150 || volume < 1)) {
                return interaction.reply({
                    ephemeral: true,
                    embeds: [new MessageEmbed()
                        .setColor(ee.errColor)
                        .setFooter(client.user.username, ee.footericon)
                        .setTitle(`${client.allEmojis.x} **The Volume __must__ be between \`1\` and \`150\`!**`)
                    ],
                })
            }
            client.settings.set(guild.id, volume, "defaultvolume");
            return interaction.reply({
                ephemeral: true,
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(client.user.username, ee.footericon)
                    .setTitle(`${client.allEmojis.check} **The Default-Volume has been set to: \`${volume}\`!**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(e)
        }
    }
}