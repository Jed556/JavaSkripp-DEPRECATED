//Import Modules
const config = require(`../../botconfig/config.json`);
const emb = require(`../../botconfig/embed.json`);
const { MessageEmbed } = require(`discord.js`);
const { getRandomInt } = require("../../handlers/functions");

module.exports = async (client, message) => {
    function DM() {
        const log = new MessageEmbed()
            .setTimestamp()
            .setColor(emb.color)
            .addField(`Message:`, `${message.content ? `> ${message.content}` : "\u200b"}`)
            .setImage(`${message.attachments.size ? `${message.attachments.first().url}` : ""}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(client.user.username, client.user.displayAvatarURL())

        const msg = message.content.toLowerCase()
        const illegalArray = [
            "fuck", "shit", "bitch", "nigga", "piss off", "dick head", "asshole", "bastard", "cunt", "wanker",
            "twat", "tangina", "puta", "pota", "putang ina", "putangina", "bobo", "bubu", "bobu", "bubo", "vovo",
            "vuvu", "vovu", "vuvo", "potaena", "putanginamo", "pokpok", "gago", "pakshet", "pucha", "ulol",
            "punyeta", "tarantado", "pakyu", "fuck u"
        ]

        if (config.friendlyMode) {
            if ((msg == "hi") || (msg == "hello") || (msg == "hey")) {
                const replyArray = ["Yoooo!", "Hey There!", "Hello There!", "Hello Friend!", "Heyyy!"]
                const reply = replyArray[getRandomInt(replyArray.length)];
                message.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.color)
                        .setTitle(reply)
                        .setFooter(`${client.user.username} - Autoreply`, client.user.displayAvatarURL({ dynamic: true }))
                    ]
                });
                log.addField(`Reply:`, `> ${reply}`)
            }

            if (illegalArray.some(v => msg.includes(v))) {
                const replyArray = ["That's illegal!", "Watch your language!", "Watch your fucking mouth!", "Mind your tone!", "Whoaaaa!"]
                const reply = replyArray[getRandomInt(replyArray.length)];
                var match = msg.match(new RegExp(illegalArray.join("|"), "g"))
                message.reply({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(emb.errColor)
                        .setTitle(reply)
                        .addField(`Reason:`, `> ${match.map(m => `\`${m}\``).join(", ")}`)
                        .setFooter(`${client.user.username} - Autoreply`, client.user.displayAvatarURL({ dynamic: true }))
                    ]
                });
                log.addField(`Reply:`, `> ${reply}`)
                log.addField(`Reason:`, `> ${match.map(m => `\`${m}\``).join(", ")}`)
                log.setColor(emb.errColor)
            }
        }
        client.users.fetch(config.ownerID, false).then((user) => {
            user.send({ embeds: [log] });
        });
        console.log(`[${message.author.tag}]${message.content ? ` MESSAGE: ${message.content}` : ""}${message.attachments.size ? ` ATTACHMENT: ${message.attachments.first().url}` : ""}`);
    }

    if (message.author.bot) return;
    if (!message.guild || !message.channel) return DM();

    const guild = message.guild.name;
    const channel = message.channel.name;
    console.log(`[${guild} in #${channel} from ${message.author.tag}]${message.content ? ` MESSAGE: ${message.content}` : ""}${message.attachments.size ? ` ATTACHMENT: ${message.attachments.first().url}` : ""}`);
}