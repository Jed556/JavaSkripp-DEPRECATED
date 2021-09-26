const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);
module.exports.errDM = function (client, reason, promise, err, origin, monitor, e) {
    const report = new MessageEmbed()
        .setTimestamp()
        .setColor(ee.errColor)
        .setAuthor("antiCrash.js", client.user.displayAvatarURL())
        .setFooter("Check logs for more details")

    if (e) {
        return client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Command Error")
                    .setDescription(`**Error:**\`\`\`${e.stack ? String(e.stack) : String(e)}\`\`\``)
                ]
            });
        });
    } else if (promise) {
        return client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Unhandled Rejection/Catch")
                    .setDescription(`
                    **Reason:**\`\`\`${reason}\`\`\`\n
                    **Promise:**\`\`\`${promise}\`\`\``)
                ]
            });
        });
    } else if (monitor) {
        return client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Uncaught Exception/Catch (MONITOR)")
                    .setDescription(`
                    **Error:**\`\`\`${err}\`\`\`\n
                    **Origin:**\`\`\`${origin}\`\`\``)
                ]
            });
        });
    } else if (origin) {
        return client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Uncaught Exception/Catch")
                    .setDescription(`
                    **Error:**\`\`\`${err}\`\`\`\n
                    **Origin:**\`\`\`${origin}\`\`\``)
                ]
            });
        });
    } else {
        return client.users.fetch(settings.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Multiple Resolves")
                    .setDescription(`
                    **Type:**\`\`\`${type}\`\`\`\n
                    **Promise:**\`\`\`${promise}\`\`\`\n
                    **Reason:**\`\`\`${reason}\`\`\``)
                ]
            });
        });
    }
}

module.exports = async (client) => {

    process.on('unhandledRejection', (reason, promise) => {
        console.log('[antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, promise);
        errDM(client, reason, promise);
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        var monitor = true
        errDM(client, client, err, origin, monitor);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        errDM(client, err, origin);
    })

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('[antiCrash] :: Multiple Resolves');
        //console.log(type, promise, reason);
        //errDM();
    });
}