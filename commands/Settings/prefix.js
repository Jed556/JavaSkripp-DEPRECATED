const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "prefix",
  category: "Settings",
  aliases: ["setprefix"],
  usage: "prefix <newPrefix>",
  cooldown: 1,
  description: "Changes the Prefix of the Bot!",
  memberpermissions: ["MANAGE_GUILD "],
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
      if (!args[0]) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Please add a Prefix!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(guild.id, "prefix")}prefix <newPrefix>\``)
          ],
        })
      }
      let newPrefix = args[0];
      client.settings.ensure(guild.id, {
        prefix: config.prefix
      });

      client.settings.set(guild.id, newPrefix, "prefix");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **The new Prefix is now: \`${newPrefix}\`**`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}