const {
    MessageEmbed
} = require(`discord.js`);
const ee = require("../../botconfig/embed.json");

module.exports = {
   name: "clear",
   description: "Bulk delete messages",
   category: "Mod",
   cooldown: 2,
   memberpermissions: ["MANAGE_MESSAGES"],
   options: [
    {
        "Integer": {
            name: "amount",
            description: "Amount of messages to delete (Max: 100)",
            required: true
        }
    },
    {
        "User": {
            name: "target",
            description: "Clear mentioned user messages",
            required: false
        }
    }],
    run: async (client, interaction) => {
        const Amount = interaction.options.getInteger('amount');
        const Target = interaction.options.getUser('target');
        const Channel = interaction.channel;
        const Messages = Channel.messages.fetch();

        if (Amount <= 100) {
            if (Target) {
                const TargetMessages = (await Messages).filter((m) => m.author.id === Target.id);
                await Channel.bulkDelete(TargetMessages, true);
                interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Deleted ${Amount} messages sent by ${Target}`)]})
            } else {
                Channel.bulkDelete(Amount, true);
                interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Deleted ${Amount} messages in ${Channel}`)]})
            }
        } else interaction.reply({embeds: [new MessageEmbed().setColor(ee.wrongcolor).setDescription(`${client.allEmojis.x} Exceeded max amount of 100 messages`)]})
   }
}