const { Client, CommandInteraction, MessageEmbed} = require('discord.js');

/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
*/

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.followUp({content: "Command no longer exists"}) && client.commands.delete(interaction.commandName);

            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND'){
                    option.options?.forEach((x) => {
                        if (x.value) args.push(option.value);
                    })
                } else if (option.value) args.push(option.value);
            }


            command.execute(client, interaction, args)
        }
    }
}