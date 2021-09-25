const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { errDM } = require("../../handlers/antiCrash");

module.exports = {
    name: "tictactoe",
    description: "Play tic tac toe with someone",
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
            if (opponent.id == interaction.user.id)
                return interaction.followUp({
                    content: "You cannot play by yourself!",
                    ephemeral: true
                });

            let acceptEmbed = new MessageEmbed()
                .setTitle(`Waiting for ${opponent.tag} to accept!`)
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor(ee.color)
                .setFooter(client.user.username, client.user.displayAvatarURL());

            let accept = new MessageButton()
                .setLabel("Accept")
                .setStyle("SUCCESS")
                .setCustomId("accepttt");

            let decline = new MessageButton()
                .setLabel("Decline")
                .setStyle("DANGER")
                .setCustomId("declinettt");

            let accep = new MessageActionRow().addComponents([
                accept,
                decline
            ]);
            interaction.followUp({
                content: "Hey <@" + opponent.id + ">. You got a tictactoe request",
                embeds: [acceptEmbed],
                components: [accep]
            });
            let m = await interaction.fetchReply();
            const collector = m.createMessageComponentCollector({
                type: "BUTTON",
                time: 30000
            });
            collector.on("collect", async (button) => {
                if (button.user.id !== opponent.id)
                    return button.reply({
                        content: "You cant play the game as they didnt call u to play.",
                        ephemeral: true
                    });

                if (button.customId == "declinettt") {
                    button.deferUpdate();
                    return collector.stop("decline");
                } else if (button.customId == "accepttt") {
                    collector.stop();
                    button.interaction.delete();

                    let fighters = [interaction.user.id, opponent.id].sort(() =>
                        Math.random() > 0.5 ? 1 : -1
                    );

                    let x_emoji = options.xEmoji || "❌";
                    let o_emoji = options.oEmoji || "⭕";

                    let dashmoji = options.idleEmoji || "➖";

                    let Args = {
                        user: 0,
                        a1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        }
                    };

                    const xoemb = new MessageEmbed()
                        .setTitle("TicTacToe")
                        .setDescription(
                            `**How to Play ?**\n*Wait for your turn.. If its your turn, Click one of the buttons from the table to draw your emoji at there.*`
                        )
                        .setColor(ee.color)
                        .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();
                    let infomsg = interaction.editReply({ embeds: [xoemb] });

                    let msg = await interaction.channel.send({
                        content: `Waiting for Input | <@!${Args.userid}>, Your Emoji: ${o_emoji}`
                    });
                    tictactoe(msg);

                    async function tictactoe(m) {
                        Args.userid = fighters[Args.user];
                        let won = {
                            "<:O_:863314110560993340>": false,
                            "<:X_:863314044781723668>": false
                        };
                        if (
                            Args.a1.emoji == o_emoji &&
                            Args.b1.emoji == o_emoji &&
                            Args.c1.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.a2.emoji == o_emoji &&
                            Args.b2.emoji == o_emoji &&
                            Args.c2.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.a3.emoji == o_emoji &&
                            Args.b3.emoji == o_emoji &&
                            Args.c3.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.a1.emoji == o_emoji &&
                            Args.b2.emoji == o_emoji &&
                            Args.c3.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.a3.emoji == o_emoji &&
                            Args.b2.emoji == o_emoji &&
                            Args.c1.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.a1.emoji == o_emoji &&
                            Args.a2.emoji == o_emoji &&
                            Args.a3.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.b1.emoji == o_emoji &&
                            Args.b2.emoji == o_emoji &&
                            Args.b3.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (
                            Args.c1.emoji == o_emoji &&
                            Args.c2.emoji == o_emoji &&
                            Args.c3.emoji == o_emoji
                        )
                            won["<:O_:863314110560993340>"] = true;
                        if (won["<:O_:863314110560993340>"] != false) {
                            if (Args.user == 0)
                                return m.edit({
                                    content: `<@!${fighters[1]}> (${o_emoji}) won.. That was a nice game.`,
                                    components: []
                                });
                            else if (Args.user == 1)
                                return m.edit({
                                    content: `<@!${fighters[0]}> (${o_emoji}) won.. That was a nice game.`,
                                    components: []
                                });
                        }
                        if (
                            Args.a1.emoji == x_emoji &&
                            Args.b1.emoji == x_emoji &&
                            Args.c1.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.a2.emoji == x_emoji &&
                            Args.b2.emoji == x_emoji &&
                            Args.c2.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.a3.emoji == x_emoji &&
                            Args.b3.emoji == x_emoji &&
                            Args.c3.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.a1.emoji == x_emoji &&
                            Args.b2.emoji == x_emoji &&
                            Args.c3.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.a3.emoji == x_emoji &&
                            Args.b2.emoji == x_emoji &&
                            Args.c1.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.a1.emoji == x_emoji &&
                            Args.a2.emoji == x_emoji &&
                            Args.a3.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.b1.emoji == x_emoji &&
                            Args.b2.emoji == x_emoji &&
                            Args.b3.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (
                            Args.c1.emoji == x_emoji &&
                            Args.c2.emoji == x_emoji &&
                            Args.c3.emoji == x_emoji
                        )
                            won["<:X_:863314044781723668>"] = true;
                        if (won["<:X_:863314044781723668>"] != false) {
                            if (Args.user == 0)
                                return m.edit({
                                    content: `<@!${fighters[1]}> (${x_emoji}) won.. That was a nice game.`,
                                    components: []
                                });
                            else if (Args.user == 1)
                                return m.edit({
                                    content: `<@!${fighters[0]}> (${x_emoji}) won.. That was a nice game.`,
                                    components: []
                                });
                        }
                        let a1 = new MessageButton()
                            .setStyle(Args.a1.style)
                            .setEmoji(Args.a1.emoji)
                            .setCustomId("a1")
                            .setDisabled(Args.a1.disabled);
                        let a2 = new MessageButton()
                            .setStyle(Args.a2.style)
                            .setEmoji(Args.a2.emoji)
                            .setCustomId("a2")
                            .setDisabled(Args.a2.disabled);
                        let a3 = new MessageButton()
                            .setStyle(Args.a3.style)
                            .setEmoji(Args.a3.emoji)
                            .setCustomId("a3")
                            .setDisabled(Args.a3.disabled);
                        let b1 = new MessageButton()
                            .setStyle(Args.b1.style)
                            .setEmoji(Args.b1.emoji)
                            .setCustomId("b1")
                            .setDisabled(Args.b1.disabled);
                        let b2 = new MessageButton()
                            .setStyle(Args.b2.style)
                            .setEmoji(Args.b2.emoji)
                            .setCustomId("b2")
                            .setDisabled(Args.b2.disabled);
                        let b3 = new MessageButton()
                            .setStyle(Args.b3.style)
                            .setEmoji(Args.b3.emoji)
                            .setCustomId("b3")
                            .setDisabled(Args.b3.disabled);
                        let c1 = new MessageButton()
                            .setStyle(Args.c1.style)
                            .setEmoji(Args.c1.emoji)
                            .setCustomId("c1")
                            .setDisabled(Args.c1.disabled);
                        let c2 = new MessageButton()
                            .setStyle(Args.c2.style)
                            .setEmoji(Args.c2.emoji)
                            .setCustomId("c2")
                            .setDisabled(Args.c2.disabled);
                        let c3 = new MessageButton()
                            .setStyle(Args.c3.style)
                            .setEmoji(Args.c3.emoji)
                            .setCustomId("c3")
                            .setDisabled(Args.c3.disabled);
                        let a = new MessageActionRow().addComponents([a1, a2, a3]);
                        let b = new MessageActionRow().addComponents([b1, b2, b3]);
                        let c = new MessageActionRow().addComponents([c1, c2, c3]);
                        let buttons = { components: [a, b, c] };

                        m.edit({
                            content: `Waiting for Input | <@!${Args.userid}> | Your Emoji: ${Args.user == 0 ? `${o_emoji}` : `${x_emoji}`
                                }`,
                            components: [a, b, c]
                        });

                        const collector = m.createMessageComponentCollector({
                            componentType: "BUTTON",
                            max: 1,
                            time: 30000
                        });

                        collector.on("collect", (b) => {
                            if (b.user.id !== Args.userid)
                                return b.reply({
                                    content: "You cant play now",
                                    ephemeral: true
                                });

                            if (Args.user == 0) {
                                Args.user = 1;
                                Args[b.customId] = {
                                    style: "SUCCESS",
                                    emoji: o_emoji,
                                    disabled: true
                                };
                            } else {
                                Args.user = 0;
                                Args[b.customId] = {
                                    style: "DANGER",
                                    emoji: x_emoji,
                                    disabled: true
                                };
                            }
                            b.deferUpdate();
                            const map = (obj, fun) =>
                                Object.entries(obj).reduce(
                                    (prev, [key, value]) => ({
                                        ...prev,
                                        [key]: fun(key, value)
                                    }),
                                    {}
                                );
                            const objectFilter = (obj, predicate) =>
                                Object.keys(obj)
                                    .filter((key) => predicate(obj[key]))
                                    .reduce((res, key) => ((res[key] = obj[key]), res), {});
                            let Brgs = objectFilter(
                                map(Args, (_, fruit) => fruit.emoji == dashmoji),
                                (num) => num == true
                            );
                            if (Object.keys(Brgs).length == 0)
                                return m.edit({ content: "It's a tie!", components: [] });
                            tictactoe(m);
                        });
                        collector.on("end", (collected) => {
                            if (collected.size == 0)
                                m.edit({
                                    content: `<@!${Args.userid}> didn\'t react in time! (30s)`,
                                    components: []
                                });
                        });
                    }
                }
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time") {
                    let embed = new MessageEmbed()
                        .setTitle("Challenge Not Accepted in Time")
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                        .setColor(options.timeoutEmbedColor || 0xc90000)
                        .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription("Ran out of time!\nTime limit: 30s");
                    m.edit({
                        embeds: [embed],
                        components: []
                    });
                }
                if (reason == "decline") {
                    let embed = new MessageEmbed()
                        .setTitle("Game Declined!")
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                        .setColor(options.timeoutEmbedColor || 0xc90000)
                        .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${opponent.user.tag} has declined your game!`);
                    m.edit({
                        embeds: [embed],
                        components: []
                    });
                }
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(e)
        }
    }
}
