//Import Modules
const config = require("../../config/client.json");
const emb = require("../../config/embed.json");
const Discord = require("discord.js");
module.exports = (client, interaction) => {
    try {
        const CategoryName = interaction.commandName;
        const SubCommand = interaction.options.getSubcommand();

        if (interaction.guildId == null) return [interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(emb.errColor)
                    .setDescription(`**HEY! You can't execute commands in a DM.**`)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
            ]
        }), console.log(`[${interaction.user.tag}] Command: /${CategoryName} ${SubCommand}`)]

        const guild = interaction.guild.name;
        const channel = interaction.channel.name;
            console.log(`[${guild} in #${channel} from ${interaction.user.tag}] Command: /${CategoryName} ${SubCommand}`);
    } catch { }
}