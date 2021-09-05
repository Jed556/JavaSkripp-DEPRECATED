const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
tLog = new Date();

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
   name: 'avatar',
   description: "Displays mentioned user's or command user's avatar",
   options: [{
        name: 'target',
        description: "Select a user",
        type: 'USER',
        required: true
    }],
    
    execute(client, interaction){
        const Target = interaction.options.getUser("target")

        const Response = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(`${Target.tag}'s Avatar`)
        .setImage(Target.displayAvatarURL({dynamic: true}))
        .setFooter(`Requested by ${interaction.user.tag}`)

        interaction.reply({embeds: [Response], ephemeral: true});
        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m ${Target.tag}'s Avatar`)
   }
}