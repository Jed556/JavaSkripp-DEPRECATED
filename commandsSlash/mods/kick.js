const client = require('../../main');

module.exports = {
    name: 'kick',
    aliases: ['k'],
    description: 'Kick a member',
    permissions: ["ADMINISTRATOR", "KICK_MEMBERS", "MANAGE_GUILD"],
    run: async (client, message, args) => {
        const member = message.mentions.users.first();
        if(member && message.member.roles.cache.has(client.config.MOD_ID)){
            const user = message.author;
            const memberTarget = message.guild.members.cache.get(user.id);
            memberTarget.kick();
            message.channel.send({content: "User kicked"});
        } else {
            message.channel.send({content: "You can't kick that member"});
    }
}
}