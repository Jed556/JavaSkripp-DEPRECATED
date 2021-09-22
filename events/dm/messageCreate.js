//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const Discord = require(`discord.js`);

module.exports = async (client, message) => {
    function DM() {
        if (!message.author.bot) {
            console.log(`[${message.author.tag}] Message: ${message.content}`);
            client.users.fetch(settings.ownerID, false).then((user) => {
                if (message.attachments.size > 0) {
                    user.send({ content: `**[${message.author.tag}] Message:** ${message.content}`, files: [message.attachments.first().url] });
                } else {
                    user.send({ content: `**[${message.author.tag}] Message:** ${message.content}` });
                }
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