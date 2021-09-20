const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "support",

  category: "Info",
  usage: "support",
  aliases: ["server"],

  cooldown: 1,
  description: "Sends a Link of the Support Server",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = message;
      const {
        guild
      } = member;
      message.reply({
        content: "jguiriba11@gmail.com | Jed556#4147"
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}