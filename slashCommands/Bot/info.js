const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
let cpuStat = require("cpu-stat");
let os = require("os");
const { errDM } = require("../../handlers/functions");

module.exports = {
    name: "info",
    cooldown: 1,
    description: "Shows JavaSkripp's information",
    category: "Bot",
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],

    run: async (client, interaction) => {
        try {

            const ownerID = await client.users.cache.find(u => u.id === config.ownerID).id;
            const owner = await client.users.fetch(ownerID).catch(console.error);

            cpuStat.usagePercent(function (e, percent, seconds) {
                try {
                    if (e) return console.log(String(e.stack).red);

                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
                    
                    const botinfo = new MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL())
                        .setTitle("**Info & Status:**")
                        .setColor(ee.color).setTimestamp()
                        .addField("⏳ Memory Usage", `\`${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)}/ ${((os.totalmem() / 1024) / 1024).toFixed(2)}MB\``, true)
                        .addField("⌚️ Uptime ", `${duration(client.uptime).map(i => `\`${i}\``).join(", ")}`, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("📁 Users", `\`Total: ${client.users.cache.size - 1}\``, true)
                        .addField("📁 Servers", `\`Total: ${client.guilds.cache.size}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("📁 Voice-Channels", `\`Total: ${client.channels.cache.filter((ch) => ch.type === "GUILD_VOICE" || ch.type === "GUILD_STAGE_VOICE").size}\``, true)
                        .addField("🔊 Connections", `\`Total: ${connectedchannelsamount}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
                        .addField("🤖 CPU Usage", `\`${percent.toFixed(2)}%\``, true)
                        .addField("⚙ Loaded", `\`${client.slashCommands.size} Commands\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
                        .addField("📶 Latency", `\`Host: ${(os.hostname() == config.localhost) ? "Local" : "Heroku"}\` \`API: ${client.ws.ping}ms\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .setFooter(`Coded by: ${owner.tag}`, owner.displayAvatarURL({ dynamic: true }));
                    interaction.reply({
                        embeds: [botinfo]
                    });

                } catch (e) {
                    console.log(e)
                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
                    const botinfo = new MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL())
                        .setTitle("**Info & Status:**")
                        .setColor(ee.color).setTimestamp()
                        .addField("⏳ Memory Usage", `\`${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)}/ ${((os.totalmem() / 1024) / 1024).toFixed(2)}MB\``, true)
                        .addField("⌚️ Uptime ", `${duration(client.uptime).map(i => `\`${i}\``).join(", ")}`, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("📁 Users", `\`Total: ${client.users.cache.size - 1} Users\``, true)
                        .addField("📁 Servers", `\`Total: ${client.guilds.cache.size} Servers\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("📁 Voice-Channels", `\`Total: ${client.channels.cache.filter((ch) => ch.type === "GUILD_VOICE" || ch.type === "GUILD_STAGE_VOICE").size}\``, true)
                        .addField("🔊 Connections", `\`Total: ${connectedchannelsamount}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
                        .addField("🤖 CPU Usage", `\`${percent.toFixed(2)}%\``, true)
                        .addField("⚙ Loaded", `\`${client.slashCommands.size} Commands\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .addField("💻 Platform", `\`${os.platform()}\` \`${os.arch()}\``, true)
                        .addField("📶 Latency", `\`Host: ${(os.hostname() == "Jed556") ? "Local" : "Heroku"}\` \`API: ${client.ws.ping}ms\``, true)
                        .addField("\u200b", `\u200b`, true)
                        .setFooter(`Coded by: ${owner.tag}`, owner.displayAvatarURL({ dynamic: true }));
                    interaction.reply({
                        embeds: [botinfo]
                    });
                }
            })

            function duration(duration, useMilli = false) {
                let remain = duration;
                let days = Math.floor(remain / (1000 * 60 * 60 * 24));
                remain = remain % (1000 * 60 * 60 * 24);
                let hours = Math.floor(remain / (1000 * 60 * 60));
                remain = remain % (1000 * 60 * 60);
                let minutes = Math.floor(remain / (1000 * 60));
                remain = remain % (1000 * 60);
                let seconds = Math.floor(remain / (1000));
                remain = remain % (1000);
                let milliseconds = remain;
                let time = {
                    days,
                    hours,
                    minutes,
                    seconds,
                    milliseconds
                };
                let parts = []
                if (time.days) {
                    let ret = time.days + ' Day'
                    if (time.days !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.hours) {
                    let ret = time.hours + ' Hr'
                    if (time.hours !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.minutes) {
                    let ret = time.minutes + ' Min'
                    if (time.minutes !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)

                }
                if (time.seconds) {
                    let ret = time.seconds + ' Sec'
                    if (time.seconds !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (useMilli && time.milliseconds) {
                    let ret = time.milliseconds + ' ms'
                    parts.push(ret)
                }
                if (parts.length === 0) {
                    return ['instantly']
                } else {
                    return parts
                }
            }
            return;
        } catch (e) {
            console.log(String(e.stack).bgRed)
            errDM(client, e)
        }
    }
}