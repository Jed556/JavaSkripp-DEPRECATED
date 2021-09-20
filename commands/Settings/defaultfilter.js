const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const filters = require("../../botconfig/filters.json")
module.exports = {
  name: "defaultfilter",
  aliases: ["dfilter"],
  usage: "defaultfilter <Filter1 Filter2>",
  cooldown: 10,
  usage: "defaultfilter",
  description: "Defines the Default Filter(s)",
  memberpermissions: ["MANAGE_GUILD "],
  requiredroles: [],
  alloweduserids: [],,

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
      client.settings.ensure(guild.id, {
        defaultvolume: 100,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`]
      });
      if (args.some(a => !filters[a])) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **You added at least one Filter, which is invalid!**`)
            .setDescription("**To define Multiple Filters add a SPACE (` `) in between!**")
            .addField("**All Valid Filters:**", Object.keys(filters).map(f => `\`${f}\``).join(", "))
          ],
        })
      }

      client.settings.set(guild.id, args, "defaultfilters");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **The new Default-Filter${args.length > 0 ? "s are": " is"}:**`)
          .setDescription(`${args.map(a=>`\`${a}\``).join(", ")}`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}