const Discord = require('discord.js');
const { Client, CommandInteraction } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports =  {
    name: "tictactoe", //the command name for the Slash Command
	description: "Play tic tac toe with someone", //the command description for Slash Command Overview
	category: "Guild",
	cooldown: 1,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (interaction) => {
        try {
            interaction.reply("Tic Tac Toe!", {
                components: [
                    {type: 1, components: [
                            {type: 2, label: "_", style: 2, custom_id: "ttt11"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt12"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt13"},
                    ]},
                    {type: 1, components: [
                            {type: 2, label: "_", style: 2, custom_id: "ttt21"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt22"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt23"},
                    ]},
                    {type: 1, components: [
                            {type: 2, label: "_", style: 2, custom_id: "ttt31"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt32"},
                            {type: 2, label: "_", style: 2, custom_id: "ttt33"},
                    ]},
                ]
            });

            /**
            *
            * @param {Discord.MessageComponentInteraction} interaction
            */
            async function updateGrid(interaction) {
            /** @type {Discord.Message} message */
            const message = interaction.message;

            let xs = 0, os = 0;

            for(let actionRow of message.components) {
            for(let button of actionRow.components) {
                if(button.label === 'X') xs++;
                else if(button.label === 'O') os++;
            }
            }

            const xs_turn = xs <= os;
            const i = parseInt(interaction.customID[3]),
            j = parseInt(interaction.customID[4]);

            const buttonPressed = message.components[i-1].components[j-1];

            if(buttonPressed.label !== '_')
            return await interaction.reply("Someone already played there!", {ephemeral: true});

            buttonPressed.label = xs_turn ? 'X' : 'O';
            buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

            const styleToNumber = style => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;

            const components = [];

            for(let actionRow of message.components) {
            components.push({type: 1, components: []});
            for (let button of actionRow.components) {
                components[components.length - 1].components.push({type: 2, label: button.label, style: styleToNumber(button.style), custom_id: button.customID});
            }
            }

            await message.edit({components: components});

            await interaction.deferUpdate();
            }
        } catch (e) {
			console.log(String(e.stack).bgRed)
        }
    }
}
