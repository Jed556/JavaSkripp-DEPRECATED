const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "dashboard",

  category: "Info",
  usage: "dashboard",
  aliases: ["dash"],

  cooldown: 1,
  description: "Sends a Link of the Dashboard",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, args) => {
    try {
      message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription("Dashboard is not yet supported")
          //.setDescription(`> **Website:** ${websiteSettings.website.domain}/\n\n> **Dashboard:** ${websiteSettings.website.domain}/dashboard\n\n> **ServerQueues:** ${websiteSettings.website.domain}/queuedashboard\n\n> **Current Queue:** ${websiteSettings.website.domain}/queue/${message.guild.id}`)
        ]
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}