const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "invite",

  category: "Info",
  usage: "invite",
  aliases: ["inviteme", "addme", ],

  cooldown: 5,
  description: "Sends you an invite link",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, args) => {
    try {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`[**Click here to invite me!**]( https://tinyurl.com/JavaSkripp )`)
          //.setDescription(`[**Click here to invite me!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)\n\n||[**Click here to invite me __without__ Slash Commands!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)||`)
        ]
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}