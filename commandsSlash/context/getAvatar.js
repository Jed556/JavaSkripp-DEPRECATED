const { Client, ContextMenuInteraction, MessageEmbed} = require('discord.js');

/**
*
* @param {Client} client
* @param {ContextMenuInteraction} interaction
* @param {String[]} args
*/

module.exports = {
   name: 'Get Avatar',
   type: 'USER',
run: async(client, interaction, args) => {
    const user = await client.users.fetch(interaction.targetId);

    const embed = new MessageEmbed()
    .setAuthor(user.tag)
    .setImage(user.displayAvatarURL({dynamic: true}))

    interaction.followUp({embeds: [embed]})
   }
}