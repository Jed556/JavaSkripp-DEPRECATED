const {Client, CommandInteraction, MessageEmbed} = require('discord.js')

/**
 * 
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    name: "ban",
    description: "Ban a member",
    memberpermissions: ["MANAGE_GUILD "]
    options: [{
            name: 'target',
            description: "Member to ban",
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: "Provide a reason",
            type: 'STRING',
            required: true,
        },
        {
            name: 'messages',
            description: "Delete messages",
            type: 'STRING',
            required: false,
            choices: [
                {
                    name:"Don't delete any",
                    value: "0"
                },
                {
                    name:"Previous 7 days",
                    value: "7"
                },
            ]
        },
    ],
    async execute(client, interaction) {
        const Target = interaction.options.getMember('target');

        if (Target.id === interaction.member.id)
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor('RED')
           .setDescription(`You can't ban yourself`)
        ]})

        
        if (Target.permissions.has('ADMINISTRATOR'))
        return interaction.reply({embeds: [
           new MessageEmbed()
           .setColor('RED')
           .setDescription(`You can't ban an administrator or moderator`)
        ]})

        const Reason = interaction.options.getString('reason');

        if (Reason > 512)
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`Reason exceeded 512 character limit`)
         ]})

        const Amount = interaction.options.getString('messages');
        
        if (Amount) {
        Target.ban({days: Amount, reason: Reason})
        } else if (!Amount) {
            Target.ban({reason: Reason})
        }

        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Banned **${Target.user.username}**, Reason: ${Reason}`)
        ]})
    }
}