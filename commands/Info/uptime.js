const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
  duration
} = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "uptime",

  category: "Info",
  usage: "uptime",

  cooldown: 1,
  description: "Returns the duration on how long the Bot is online",
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
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`:white_check_mark: **${client.user.username}** is since:\n ${duration(client.uptime).map(t=>`\`${t}\``).join(", ")} online`)
        ]
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}