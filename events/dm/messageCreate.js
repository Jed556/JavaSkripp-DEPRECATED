//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);

module.exports = async (client, message) => {
    function DM() {
        const log = new MessageEmbed()
            .setTimestamp()
            .setColor(ee.color)
            .addField(`Message:`, `${message.content ? `> ${message.content}` : "\u200b"}`)
            .setImage(`${message.attachments.size ? `${message.attachments.first().url}` : ""}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(client.user.username, client.user.displayAvatarURL())

        const msg = message.content.toLowerCase()
        const illegalArray = [
            "fuck", "shit", "bitch", "nigga", "piss off", "dick head", "asshole", "bastard", "cunt", "wanker",
            "twat", "tangina", "puta", "putang ina", "putangina", "bobo", "bubu", "bobu", "bubo", "vovo",
            "vuvu", "vovu", "vuvo", "potaena", "putanginamo", "pokpok", "gago", "pakshet", "pucha", "ulol",
            "punyeta", "tarantado"
        ]

        if ((msg == "hi") || (msg == "hello") || (msg == "hey")) {
            const replyArray = ["Yoooo!", "Hey There!", "Hello There!", "Hello Friend!", "Heyyy!"]
            const reply = replyArray[Math.floor(Math.random() * replyArray.length)];
            message.reply(reply);
            log.addField(`Reply:`, `> ${reply}`)
        }
        if (illegalArray.some(v => msg.includes(v))) {
            const replyArray = ["That's illegal!", "Watch your language!", "Watch your fucking mouth!", "Mind your tone!", "Hold your tongue!"]
            const reply = replyArray[Math.floor(Math.random() * replyArray.length)];

            const reason = []
            do {
                const match = illegalArray.find(v => msg.includes(v))
                reason.forEach((v) => {
                    reason.push(match)
                    illegalArray.split(match).pop()
                })
            } while (illegalArray.some(v => msg.includes(v)))

            message.reply(reply);
            log.addField(`Reply:`, `> ${reply}`)
            log.addField(`Reason:`, `> ${reason.map(v => `\`${v}\``).join(`, `)}`)
            log.setColor(ee.wrongcolor)
        }

        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({ embeds: [log] });
        });
        console.log(`[${message.author.tag}]${message.content ? ` MESSAGE: ${message.content}` : ""}${message.attachments.size ? ` ATTACHMENT: ${message.attachments.first().url}` : ""}`);
    }

    if (message.author.bot) return;
    if (!message.guild || !message.channel) return DM();

    const guild = message.guild.id;
    const channel = message.channel.id;
    console.log(`[Guild ${guild.name} in #${channel.name} from ${message.author.tag}]${message.content ? ` MESSAGE: ${message.content}` : ""}${message.attachments.size ? ` ATTACHMENT: ${message.attachments.first().url}` : ""}`);
}