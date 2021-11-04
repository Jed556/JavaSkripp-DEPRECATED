const { errDM } = require("./functions")

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
        errDM(client, err, origin, monitor);
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