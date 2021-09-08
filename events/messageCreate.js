const {Client, Message, MessageEmbed} = require('discord.js');
const { commands } = require('../main');

/**
 * 
 * @param {Client} client
 * @param {Message} message
 */

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        if (
            message.author.bot ||
            !message.guild ||
            !message.content.toLowerCase().startsWith(process.env.PREFIX)
        )
            return;

        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName.toLowerCase()) ||
        client.commands.find(cmd => cmd.aliases?.includes(commandName));

        if (!command) return;
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const NoPerms = new MessageEmbed()
                .setColor('RED')
                .setDescription('You have no permissions to run this command')
                message.reply({embeds: NoPerms})
                .then((sent) =>{
                    setTimeout(() => {
                        sent.delete();
                    }, 3000)
                })
            }
        }

        const { cooldowns } = client;
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id + cooldownAmount);
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) /1000;
                const timeLeftEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`Wait ${timeLeft.toFixed(1)} seconds to run this command again`)
                return message.channel.send(timeLeftEmbed)
                .then ((sent) => {
                    setTimeout(() => {
                        sent.delete();
                    }, 3000);
                })
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args, commandName, client, Discord);
        } catch (error) {
            console.log(error);
            const ErrorEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('An error occured while trying to run this command')
            message.channel.send({embeds: [ErrorEmbed]});
        }
    }
}