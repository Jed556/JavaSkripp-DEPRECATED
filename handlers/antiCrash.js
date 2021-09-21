const { MessageEmbed } = require("discord.js");
const settings = require("../botconfig/settings.json");
const ee = require("../botconfig/embed.json");

module.exports = client => {
    const owner = client.users.cache.get(settings.ownerIDS)

    process.on('unhandledRejection', (reason, p) => {
        console.log('[antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        embed = {embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`antiCrash] :: Unhandled Rejection/Catch`)
            .addField(`${reason}`, `${p}`)
            .setTimestamp()
        ]}
        owner.send(embed)
    });

    process.on("uncaughtException", (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        embed = {embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`[antiCrash] :: Unhandled Rejection/Catch`)
            .addField(`${err}`, `${origin}`)
            .setTimestamp()
        ]}
        owner.send(embed)
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        embed = {embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`[antiCrash] :: Uncaught Exception/Catch (MONITOR)`)
            .addField(`${err}`, `${origin}`)
            .setTimestamp()
        ]}
        owner.send(embed)
    });

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('[antiCrash] :: Multiple Resolves');
        embed = {embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`[antiCrash] :: Multiple Resolves`)
            .setTimestamp()
        ]}
        owner.send(embed)
        //console.log(type, promise, reason);
    });
}