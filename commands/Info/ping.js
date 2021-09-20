const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "ping",

  category: "Info",
  usage: "ping",
  aliases: ["latency"],

  description: "Gives you information on how fast the Bot is",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, message, args) => {
    try {
      const {
        member,
        guildId,
        guild
      } = message;
      const {
        channel
      } = member.voice;
      await message.reply({
          content: `${client.allEmojis.loading} Getting the Bot Ping...`,
          ephemeral: true
        })
        .then(newMsg => newMsg.edit({
          content: `${client.allEmojis.ping} Bot Ping: \`${Math.floor((Date.now() - message.createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\`\n\n${client.allEmojis.ping} Api Ping: \`${Math.floor(client.ws.ping)} ms\``,
          ephemeral: true
        }).catch(e => {
          return console.log(e)
        }))
        .catch(e => {
          console.log(e)
        })

    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}