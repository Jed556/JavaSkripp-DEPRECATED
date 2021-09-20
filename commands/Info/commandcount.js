const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "commandcount",
  category: "Info",
  usage: "commandcount",
  aliases: ["cmds", "commandc", "count", "cmdcount"],
  cooldown: 1,
  description: "Shows the Amount of Commands an Categories",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, args) => {
    try {
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:gear: **[${client.commands.size}] Commands**`)
          .setDescription(`:gear: **[${client.categories.length}] Categories**\n\n:gear: **[${client.slashCommands.size + client.slashCommands.map(d => d.options).flat().length}] Slash Commands**\n\n`)
        ]
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}