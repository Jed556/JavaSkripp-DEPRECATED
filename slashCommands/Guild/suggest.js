const { Message, Client, CommandInteraction} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: 'suggest',
    description: 'Create a suggestion',
    options: [{
        name: "suggestion",
        description: "Your suggestion",
        type: "STRING",
        required: true
    }],
    async execute (interaction, message, args, client) {
        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if(!channel) return interaction.reply({content: `**suggestions** channel does not exist`});

        const messageArgs = interaction.options.getUser("suggestion")
        const embed = new client.MessageEmbed()
        .setColor('#FADF2E')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs);
        
        interaction.reply({embeds: [embed]}).then((msg) =>{
            msg.react('👍🏻');
            msg.react('👎🏻');
            message.delete();
        }).catch((err) => {
            throw err;
        })
    }
}