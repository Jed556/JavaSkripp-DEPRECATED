//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);

module.exports = async (client, message) => {
    function DM() {
        if (!message.author.bot) {
            console.log(`[${message.author.tag}] Message: ${message.content} ${message.attachments.size > 0 ? `\nAttachment: ${message.attachments.first().url}` : ""}`);
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.color)
                        .setTitle(`**Message:**`)
                        .setDescription(message.content)
                        .setImage(`${message.attachments.size > 0 ? `${message.attachments.first().url}` : ""}`)
                        .setAuthor(message.author.tag, message.author.avatar({ dynamic: true }))
                });
            });

            const msg = message.content.toLowerCase()
            if ((msg == "hi") || (msg == "hello") || (msg == "hey")) {
                const replyArray = ["Yoooo!", "Hey There!", "Hello There!", "Hello Friend!", "Heyyy!"]
                const reply = replyArray[Math.floor(Math.random() * replyArray.length)];
                message.reply(reply);
            }
        }
    }
    if (!message.guild || !message.channel || message.author.bot) return DM();
}