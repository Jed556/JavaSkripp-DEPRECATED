const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);
module.exports.errDM = errDM;

function errDM(client, reason, promise, err, origin, monitor, e) {
    if (e) {
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setAuthor("antiCrash.js", client.user.displayAvatarURL())
                    .setTitle("Command Error")
                    .setDescription(`**Error:**\`\`\`${String(e.stack)}\`\`\``)
                    .setFooter("Check logs for more details")
                ]
            });
        });
    } else if (promise) {
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setAuthor("antiCrash.js", client.user.displayAvatarURL())
                    .setTitle("Unhandled Rejection/Catch")
                    .setDescription(`**Reason:**\`\`\`${reason}\`\`\`\n**Promise:**\`\`\`${promise}\`\`\``)
                    .setFooter("Check logs for more details")
                ]
            });
        });
    } else if (monitor) {
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setAuthor("antiCrash.js", client.user.displayAvatarURL())
                    .setTitle("Uncaught Exception/Catch (MONITOR)")
                    .setDescription(`**Error:**\`\`\`${err}\`\`\`\n**Origin:**\`\`\`${origin}\`\`\``)
                    .setFooter("Check logs for more details")
                ]
            });
        });
    } else if (origin) {
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setAuthor("antiCrash.js", client.user.displayAvatarURL())
                    .setTitle("Uncaught Exception/Catch")
                    .setDescription(`**Error:**\`\`\`${err}\`\`\`\n**Origin:**\`\`\`${origin}\`\`\``)
                    .setFooter("Check logs for more details")
                ]
            });
        });
    } else {
        client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [new MessageEmbed()
                    .setTimestamp()
                    .setColor(ee.errColor)
                    .setAuthor("antiCrash.js", client.user.displayAvatarURL())
                    .setTitle("Multiple Resolves")
                    .setDescription(`**Type:**\`\`\`${type}\`\`\`\n**Promise:**\`\`\`${promise}\`\`\`\n**Reason:**\`\`\`${reason}\`\`\``)
                    .setFooter("Check logs for more details")
                ]
            });
        });
    }
}

module.exports = async (client) => {

    process.on('unhandledRejection', (reason, promise) => {
        console.log('[antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, promise);
        errDM(reason, promise);
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        var monitor = true
        errDM(err, origin, monitor);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        errDM(err, origin);
    })

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('[antiCrash] :: Multiple Resolves');
        //console.log(type, promise, reason);
        //errDM();
    });
}