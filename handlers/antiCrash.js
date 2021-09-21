const { MessageEmbed } = require("discord.js");
const settings = require("../botconfig/settings.json");
const ee = require("../botconfig/embed.json");

module.exports = client => {
    try {
        const owner = client.users.cache.get(settings.ownerID)

        process.on('unhandledRejection', (reason, p) => {
            console.log('[antiCrash] :: Unhandled Rejection/Catch');
            console.log(reason, p);
            embed = {
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`antiCrash] :: Unhandled Rejection/Catch`)
                    .setDescription(`${reason}`, `${p}`)
                    .setTimestamp()
                ]
            }
            owner.send(embed)
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
            owner.send(embed)
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
            owner.send(embed)
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
            owner.send(embed)
            //console.log(type, promise, reason);
        });
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}