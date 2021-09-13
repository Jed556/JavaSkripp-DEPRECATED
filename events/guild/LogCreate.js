const client = require("../../main");

client.on("messageCreate", async message => {
    if (message.guild || message.content && !message.author.bot) {
        const guild = client.guilds.cache.get(message.guild_id);
        const channel = client.channels.cache.get(message.channel_id);

        console.log(`Message in ${guild.name} #${channel.name} from ${message.author.username}#${message.author.discriminator}: ${message.content}`);
    }
});
client.on("interactionCreate", async interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = client.channels.cache.get(interaction.channel_id);
    const user = client.users.cache.get(interaction.member.user.id);

    console.log(`Command in ${guild.name} #${channel.name} from ${user.username}#${user.discriminator}: /${interaction.data.name}`)
});