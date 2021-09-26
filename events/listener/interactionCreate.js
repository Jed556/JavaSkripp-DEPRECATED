//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = (client, interaction) => {
    try {
        const CategoryName = interaction.commandName;
        const SubCommand = interaction.options.getSubcommand();

        if (interaction.guildId == null) return [interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(ee.errColor)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setDescription(`**HEY! You can't execute commands in a DM.**`)
            ]
        }), console.log(`[${interaction.user.tag}] Command: /${CategoryName} ${SubCommand}`)]

        const guild = interaction.guild.name;
        const channel = interaction.channel.name;
            console.log(`[${guild} in #${channel} from ${interaction.user.tag}] Command: /${CategoryName} ${SubCommand}`);
    } catch { }
}