const { Interaction, Message, Client } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {Interaction} interaction
 * @param {String[]} args
 */

module.exports = {
    name: 'clear',
    aliases: ['clr', 'cls'],
    description: "Clear messages",
    permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES", "MANAGE_GUILD"],
    run: async(interaction, message, args,) => {
        if(args[0]) return message.channel.send("Enter amount of messages");
        if(isNaN(args[0])) return message.channel.send("Enter a real number");
        
        if(args[0] > 100) return message.channel.send("Maximum of 100 messages only")
        if(args[0] < 1) return message.channel.send("Add at least one message")

        await message.channel.messages.fetch({limit: args[0]}).then(message =>{
            message.channel.bulkDelete(messages);
        })
    }
}