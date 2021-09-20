const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "defaultvolume",
  category: "Settings",
  aliases: ["dvolume"],
  usage: "defaultvolume <Percentage>",
  cooldown: 1,
  description: "Defines the Default Volume of the Bot!",
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
            .setTitle(`${client.allEmojis.x} **Please add a Volume!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(guild.id, "prefix")}defaultvolume <percentage>\``)
          ],
        })
      }
      let volume = Number(args[0]);
      client.settings.ensure(guild.id, {
        defaultvolume: 100
      });

      if (!volume || (volume > 150 || volume < 1)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **The Volume __must__ be between \`1\` and \`150\`!**`)
          ],
        })
      }
      client.settings.set(guild.id, volume, "defaultvolume");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **The Default-Volume has been set to: \`${volume}\`!**`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}