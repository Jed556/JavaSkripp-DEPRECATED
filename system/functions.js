// REQUIRE DEPENDENCIES
const { MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js")
const config = require("../config/client.json");
const emb = require("../config/embed.json");

// EXPORT ALL FUNCTIONS
module.exports.mainDir = mainDir;
module.exports.reSlash = reSlash;
module.exports.randomNum = randomNum;
module.exports.delay = delay;
module.exports.errDM = errDM;


// ---------- FUNCTIONS ---------- //

/**
 * @returns Client's root directory
 */
function mainDir() {
    return process.cwd().replace(/\\/g, '/')
}

/**
 * @param {string} string
 * @returns Replaces "\" with "/"
 */
function reSlash(string) {
    return string.replace(/\\/g, '/')
}

/**
 * 
 * @param {*} min Number | Minimum number
 * @param {*} max Number | Maximum number
 * @returns Random number
 */
function randomNum(min, max) {
    try {
        let number;
        if (min && max) {
            number = Math.floor(Math.random() * Math.floor((max - min) + min));
        } else {
            number = Math.floor(Math.random());
        }
        return number;
    } catch (e) { }
}

/**
 * 
 * @param {*} delayInms Number | Time in Milliseconds
 * @returns Promise, waiting for the given Milliseconds
 */
 function delay(delayInms) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    } catch (e) {
        console.log(String(e.stack).bgRed)
        errDM(client, e)
    }
}

/**
 * @param {*} client Discord Client
 * @param {*} type Error type
 * @param {*} error Interaction error
 * @param {*} err Interaction error
 * @param {*} e Interaction error
 * @param {*} origin Origin of the error
 * @param {*} promise Promise
 * @param {*} monitor Monitored
 * @returns Automatic error logs to DM
 */
 function errDM(client, error, type, reason, promise, err, origin, monitor, e) {
    const report = new MessageEmbed()
        .setTimestamp()
        .setColor(emb.errColor)
        .setAuthor("antiCrash.js", emb.error)
        .setFooter("Check logs for more details")

    if (client.fatalError) {
        report.setAuthor("antiCrash.js", emb.dead)
        client.fatalError = false
    }

    if (e) {
        return client.users.fetch(config.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Command Error")
                    .setDescription(`**Error:**\`\`\`${e.stack ? String(e.stack) : String(e)}\`\`\``)
                ]
            });
        });
    } else if (error) {
        return client.users.fetch(config.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Command Error")
                    .setDescription(`**Error:**\`\`\`${error}\`\`\``)
                ]
            });
        });
    } else if (promise && reason) {
        return client.users.fetch(config.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Unhandled Rejection/Catch")
                    .setDescription(`
                    **Reason:**\`\`\`${reason}\`\`\`\n
                    **Promise:**\`\`\`${JSON.stringify(promise)}\`\`\``)
                ]
            });
        });
    } else if (monitor && err && origin) {
        return client.users.fetch(config.ownerID, false).then((user) => {
            user.send({
                embeds: [report
                    .setTitle("Uncaught Exception/Catch (MONITOR)")
                    .setDescription(`
                    **Error:**\`\`\`${err}\`\`\`\n
                    **Origin:**\`\`\`${origin}\`\`\``)
                ]
            });
        });
    } else if (err && origin) {
        return client.users.fetch(config.ownerID, false).then((user) => {
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
        return client.users.fetch(config.ownerID, false).then((user) => {
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