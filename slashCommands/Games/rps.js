const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "rps",
    description: "Play rock paper scissors with someone",
    category: "Games",
    cooldown: 1,
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "User": {
                name: "opponent",
                description: "Pick your opponent",
                required: true
            }
        },
    ],

    run: async (client, interaction) => {
        try {
            interaction.deferReply("Starting...")
            let opponent = interaction.options.getUser("opponent");

            if (!opponent)
                return interaction.followUp({
                    content: "No opponent mentioned!",
                    ephemeral: true
                });
            if (opponent.bot)
                return interaction.followUp({
                    content: "You can't play against bots",
                    ephemeral: true
                });
            if (opponent.id == interaction.user.id)
                return interaction.followUp({
                    content: "You cannot play by yourself!",
                    ephemeral: true
                });

            let acceptEmbed = new MessageEmbed()
                .setTitle(`Waiting for ${opponent.tag} to accept!`)
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                .setColor(emb.color)
                .setFooter(client.user.username, client.user.displayAvatarURL());

            let accept = new MessageButton()
                .setLabel("Accept")
                .setStyle("SUCCESS")
                .setCustomId("accept");

            let decline = new MessageButton()
                .setLabel("Decline")
                .setStyle("DANGER")
                .setCustomId("decline");

            let accep = new MessageActionRow().addComponents([
                accept,
                decline
            ]);
            interaction.followUp({
                content: `Hey <@${opponent.id}>. You got a RPS invite`,
                embeds: [acceptEmbed],
                components: [accep]
            });
            let m = await interaction.fetchReply();

            const collector = m.createMessageComponentCollector({
                type: "BUTTON",
                time: 30000
            });

            collector.on("collect", (button) => {
                if (button.user.id !== opponent.id)
                    return button.reply({
                        content: "You cant play the game as they didnt call u to play.",
                        ephemeral: true
                    });

                if (button.customId == "decline") {
                    button.deferUpdate();
                    return collector.stop("decline");
                }
                button.deferUpdate();
                let embed = new MessageEmbed()
                    .setTitle(`${interaction.user.tag} VS. ${opponent.tag}`)
                    .setColor(emb.color)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setDescription("Select 🪨, 📄, or ✂️");

                let rock = new MessageButton()
                    .setLabel("ROCK")
                    .setCustomId("rock")
                    .setStyle("SECONDARY")
                    .setEmoji("🪨");

                let paper = new MessageButton()
                    .setLabel("PAPER")
                    .setCustomId("paper")
                    .setStyle("SECONDARY")
                    .setEmoji("📄");

                let scissors = new MessageButton()
                    .setLabel("SCISSORS")
                    .setCustomId("scissors")
                    .setStyle("SECONDARY")
                    .setEmoji("✂️");

                let row = new MessageActionRow().addComponents([
                    rock,
                    paper,
                    scissors
                ]);

                interaction.editReply({
                    embeds: [embed],
                    components: [row]
                });

                collector.stop();
                let ids = new Set();
                ids.add(interaction.user.id);
                ids.add(opponent.id);
                let op, auth;

                const collect = m.createMessageComponentCollector({
                    type: "BUTTON",
                    time: 30000
                });

                collect.on("collect", (b) => {
                    if (!ids.has(b.user.id))
                        return button.reply({
                            content: "You cant play the game as they didnt call u to play.",
                            ephemeral: true
                        });
                    ids.delete(b.user.id);
                    b.deferUpdate();
                    if (b.user.id == opponent.id) {
                        mem = b.customId;
                    }
                    if (b.user.id == interaction.user.id) {
                        auth = b.customId;
                    }
                    if (ids.size == 0) collect.stop();
                });
                collect.on("end", (c, reason) => {
                    if (reason == "time") {
                        let embed = new MessageEmbed()
                            .setTitle("Game Timed Out!")
                            .setColor(emb.errColor)
                            .setDescription(
                                "One or more players did not make a move in time(30s)"
                            )
                            .setFooter(client.user.username, client.user.displayAvatarURL());
                        interaction.editReply({
                            embeds: [embed],
                            components: []
                        });
                    } else {
                        if (mem == "rock" && auth == "scissors") {
                            let embed = new MessageEmbed()
                                .setTitle(`${opponent.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Rock defeats Scissors")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else if (mem == "scissors" && auth == "rock") {
                            let embed = new MessageEmbed()
                                .setTitle(`${interaction.user.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Rock defeats Scissors")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else if (mem == "scissors" && auth == "paper") {
                            let embed = new MessageEmbed()
                                .setTitle(`${opponent.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Scissors defeats Paper")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else if (mem == "paper" && auth == "scissors") {
                            let embed = new MessageEmbed()
                                .setTitle(`${interaction.user.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Scissors defeats Paper")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else if (mem == "paper" && auth == "rock") {
                            let embed = new MessageEmbed()
                                .setTitle(`${opponent.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Paper defeats Rock")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else if (mem == "rock" && auth == "paper") {
                            let embed = new MessageEmbed()
                                .setTitle(`${interaction.user.tag} Wins!`)
                                .setColor(emb.okColor)
                                .setDescription("Paper defeats Rock")
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        } else {
                            let embed = new MessageEmbed()
                                .setTitle("Draw!")
                                .setColor(emb.okColor)
                                .setDescription(`Both players chose ${mem}`)
                                .setFooter(client.user.username, client.user.displayAvatarURL());
                            interaction.editReply({ embeds: [embed], components: [] });
                        }
                    }
                });
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time") {
                    let embed = new MessageEmbed()
                        .setTitle("Challenge Not Accepted in Time")
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setDescription("Ran out of time!\nTime limit: 30s");
                    interaction.editReply({
                        embeds: [embed],
                        components: []
                    });
                }
                if (reason == "decline") {
                    let embed = new MessageEmbed()
                        .setTitle("Game Declined!")
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                        .setColor(emb.errColor)
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                        .setDescription(`${opponent.tag} has declined your game!`);
                    interaction.editReply({
                        embeds: [embed],
                        components: []
                    });
                }
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}