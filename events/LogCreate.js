const client = require("../main");
tLog = new Date();

client.ws.on("MESSAGE_CREATE", async message => {
    if (message.guild || message.content && !message.author.bot) {
        const guild = client.guilds.cache.get(message.guild_id);
        const channel = client.channels.cache.get(message.channel_id);

        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Message in ${guild.name} #${channel.name} from ${message.author.username}#${message.author.discriminator}: ${message.content}`);
    }
});
client.ws.on("INTERACTION_CREATE", async interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = client.channels.cache.get(interaction.channel_id);
    const user = client.users.cache.get(interaction.member.user.id);

    console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Command in ${guild.name} #${channel.name} from ${user.username}#${user.discriminator}: /${interaction.data.name}`)
});