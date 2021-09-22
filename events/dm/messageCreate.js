//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);

module.exports = async (client, message) => {
    function DM() {
        console.log(`[${message.author.tag}] ${message.content ? `MESSAGE: ${message.content}` : ""} ${message.attachments.size ? `ATTACHMENT: ${message.attachments.first().url}` : ""}`);
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.color)
                    .addField(`**Message from ${message.author.tag}**`, `${message.content ? `> ${message.content}` : ""}`)
                    .setImage(`${message.attachments.size ? `${message.attachments.first().url}` : ""}`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        });

        const msg = message.content.toLowerCase()
        if ((msg == "hi") || (msg == "hello") || (msg == "hey")) {
            const replyArray = ["Yoooo!", "Hey There!", "Hello There!", "Hello Friend!", "Heyyy!"]
            const reply = replyArray[Math.floor(Math.random() * replyArray.length)];
            message.reply(reply);
        }
    }

    if (message.author.bot) return;
    if (!message.guild || !message.channel) return DM();
}