const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const { MessageEmbed } = require(`discord.js`);

module.exports = async (client) => {
    function DM(reason, p, err, origin, monitor) {
        if (p) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.wrongcolor)
                        .setTitle("[antiCrash] :: Unhandled Rejection/Catch")
                        .setDescription(`\`\`\`${reason}\n${p}\`\`\``)
                    ]
                });
            });
        } else if (monitor) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.wrongcolor)
                        .setTitle("Uncaught Exception/Catch (MONITOR)")
                        .setDescription(`\`\`\`${err}\n${origin}\`\`\``)
                    ]
                });
            });
        } else if (origin) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.wrongcolor)
                        .setTitle("[antiCrash] :: Uncaught Exception/Catch")
                        .setDescription(`\`\`\`${err}\n${origin}\`\`\``)
                    ]
                });
            });
        } else {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({
                    embeds: [new MessageEmbed()
                        .setTimestamp()
                        .setColor(ee.wrongcolor)
                        .setTitle("[antiCrash] :: Multiple Resolves")
                        .setDescription(`\`\`\`${err}\n${origin}\`\`\``)
                    ]
                });
            });
        }
    }

    process.on('unhandledRejection', (reason, p) => {
        console.log('[antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        DM(reason, p);
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        var monitor = true
        DM(err, origin, monitor);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        DM(err, origin);
    })

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('[antiCrash] :: Multiple Resolves');
        //console.log(type, promise, reason);
        //DM();
    });
}