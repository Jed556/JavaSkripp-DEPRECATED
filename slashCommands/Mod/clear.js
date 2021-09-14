const { channel } = require('diagnostics_channel');
const { Client, CommandInteraction, MessageEmbed} = require('discord.js');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
   name: "clear",
   description: "Clear messages",
   cooldown: 1,
   memberpermissions: ["MANAGE_GUILD "],
   options: [
    {
        "Integer": {
            name: "amount",
            description: "Amount of messages to delete",
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
    async execute(client, interaction) {
        const Amount = interaction.options.getNumber('amount');
        const Target = interaction.options.getMember('target');
        const Channel = interaction.channel;
        const Messages = Channel.messages.fetch();

        if (Target) {
            const TargetMessages = (await Messages).filter((m) => m.author.id === Target.id);
            await Channel.bulkDelete(TargetMessages, true);
            interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Deleted ${Amount} messages sent by ${Target}`)]})
        } else {
            Channel.bulkDelete(Amount, true);
            interaction.reply({embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Deleted ${Amount} messages in ${Channel}`)]})
        }

   }
}