const { Message, Client } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

module.exports = {
    name: 'suggest',
    aliases: ['suggestions', 'suggestion'],
    description: 'Create a suggestion',
    permissions: ["VIEW_CHANNEL"],
    run: async (message, args, client) => {
        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if(!channel) return message.channel.send({content: `**suggestions** channel does not exist`});

        let messageArgs = args.join(' ');
        const embed = new client.MessageEmbed()
        .setColor('#FADF2E')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs);
        
        channel.send({embed: [embed]}).then((msg) =>{
            msg.react('👍🏻');
            msg.react('👎🏻');
            message.delete();
        }).catch((err) => {
            throw err;
        })
    }
}