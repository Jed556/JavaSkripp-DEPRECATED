const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
	name: "ping",
	description: "Displays bot latency",
	category: "Bot",
	cooldown: 1,
	memberpermissions: [],
	requiredroles: [],
	alloweduserids: [],
	options: [
		{
			"StringChoices": {
				name: "ping",
				description: "Type of ping to get",
				required: false,
				choices: [
					["Bot", "botping"],
					["Discord API", "api"]
				]
			}
		},
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
	],

	run: async (client, interaction) => {
		try {
			const { member, channelId, guildId, applicationId, commandName,
				deferred, replied, ephemeral, options, id, createdTimestamp } = interaction;
			const { guild } = member;

			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
			const StringOption = options.getString("ping"); //same as in StringChoices
			//let UserOption = options.getUser("OPTIONNAME");
			//let ChannelOption = options.getChannel("OPTIONNAME");
			//let RoleOption = options.getRole("OPTIONNAME");

			if (StringOption) {
				if (StringOption == "botping") {
					await interaction.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.color)
							.setFooter(client.user.username, client.user.displayAvatarURL())
							.setTitle(`${client.allEmojis.loading} Getting the Bot Ping...`)
						],
						ephemeral: true
					});
					interaction.editReply({
						embeds: [new MessageEmbed()
							.setColor(ee.color)
							.setFooter(client.user.username, client.user.displayAvatarURL())
							.setTitle(`${client.allEmojis.ping} Ping`)
							.addField(`Bot Ping:`, `\`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms\``, true)
							.setTimestamp()
						],
						ephemeral: true
					})
				}
				//Other Option: API
				else {
					interaction.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.color)
							.setFooter(client.user.username, client.user.displayAvatarURL())
							.setTitle(`${client.allEmojis.ping} Ping`)
							.addField(`API Ping:`, `\`${Math.floor(client.ws.ping)}ms\``, true)
							.setTimestamp()
						],
						ephemeral: true
					})
				}
			} else {
				await interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.color)
						.setFooter(client.user.username, client.user.displayAvatarURL())
						.setTitle(`${client.allEmojis.loading} Getting the Bot Ping...`)
					],
					ephemeral: true
				});
				interaction.editReply({
					embeds: [new MessageEmbed()
						.setColor(ee.color)
						.setFooter(client.user.username, client.user.displayAvatarURL())
						.setTitle(`${client.allEmojis.ping} Ping`)
						.addField(`Bot Ping:`, `\`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms\``, true)
						.addField(`API Ping:`, `\`${Math.floor(client.ws.ping)}ms\``, true)
						.setTimestamp()
					],
					ephemeral: true
				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
			errDM
		}
	}
}