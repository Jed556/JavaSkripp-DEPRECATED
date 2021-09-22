const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const Discord = require(`discord.js`);

module.exports = async (client) => {
    function DM(reason, p, err, origin) {
        if (p) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({ content: `[antiCrash] :: Unhandled Rejection/Catch**] ${reason}\n ${p}` });
            });
        } else if (monitor) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({ content: `**[antiCrash] :: Unhandled Rejection/Catch**]\n${err}\n${origin}` });
            });
        } else if (origin) {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({ content: `**[antiCrash] :: Unhandled Rejection/Catch**]\n${err}\n${origin}` });
            });
        } else {
            client.users.fetch(settings.ownerID, false).then((user) => {
                user.send({ content: `**[antiCrash] :: Multiple Resolves**` });
            });
        }
    }

    process.on('unhandledRejection', (reason, p) => {
        console.log('[antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        DM(reason, p);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        DM(err, origin);
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        let monitor = true
        DM(err, origin, monitor);
    });

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('[antiCrash] :: Multiple Resolves');
        DM();
        //console.log(type, promise, reason);
    });
}