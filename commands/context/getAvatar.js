const { Client, ContextMenuInteraction, MessageEmbed} = require('discord.js');

/**
*
* @param {Client} client
* @param {ContextMenuInteraction} interaction
*/

module.exports = {
   name: 'Get Avatar',
   type: 'USER',
async execute(client, interaction) {
    const user = await client.users.fetch(interaction.targetId);

    const embed = new MessageEmbed()
    .setAuthor(user.tag)
    .setImage(user.displayAvatarURL({dynamic: true}))

    interaction.reply({embeds: [embed]})
   }
}