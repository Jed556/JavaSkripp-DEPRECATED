const { MessageEmbed } = require("discord.js");
const settings = require("../botconfig/settings.json");
const ee = require("../botconfig/embed.json");

module.exports = client => {
    try {
        const owner = client.members.cache.get(settings.ownerID)

        process.on('unhandledRejection', (reason, p) => {
            console.log('[antiCrash] :: Unhandled Rejection/Catch');
            console.log(reason, p);
            const embed = {
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`antiCrash] :: Unhandled Rejection/Catch`)
                    .setDescription(`${reason}`, `${p}`)
                    .setTimestamp()
                ]
            }
            try {
                owner.send(embed)
            } catch (e) {
                console.log(String(e.stack).bgRed)
            }
        });

        process.on("uncaughtException", (err, origin) => {
            console.log('[antiCrash] :: Uncaught Exception/Catch');
            console.log(err, origin);
            const embed = {
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`[antiCrash] :: Unhandled Rejection/Catch`)
                    .setDescription(`${err}`, `${origin}`)
                    .setTimestamp()
                ]
            }
            try {
                owner.send(embed)
            } catch (e) {
                console.log(String(e.stack).bgRed)
            }
        })

        process.on('uncaughtExceptionMonitor', (err, origin) => {
            console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
            console.log(err, origin);
            const embed = {
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`[antiCrash] :: Uncaught Exception/Catch (MONITOR)`)
                    .setDescription(`${err}`, `${origin}`)
                    .setTimestamp()
                ]
            }
            try {
                owner.send(embed)
            } catch (e) {
                console.log(String(e.stack).bgRed)
            }
        });

        process.on('multipleResolves', (type, promise, reason) => {
            console.log('[antiCrash] :: Multiple Resolves');
            const embed = {
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`[antiCrash] :: Multiple Resolves`)
                    .setTimestamp()
                ]
            }
            try {
                owner.send(embed)
            } catch (e) {
                console.log(String(e.stack).bgRed)
            }
            //console.log(type, promise, reason);
        });
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}