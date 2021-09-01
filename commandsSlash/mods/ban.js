const client = require('../../main');

module.exports = {
    name: 'ban',
    aliases: ['b'],
    description: 'Ban a member',
    permissions: ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_GUILD"],
    run: async (client, message, args) => {
        const member = message.metions.users.first();
        if(member && message.member.roles.cache.has(client.config.MOD_ID)){
            const user = message.author;
            const memberTarget = message.guild.members.cache.get(user.id);
            memberTarget.ban();
            message.channel.send({content: "User banned"});
        } else {
            message.channel.send({content: "You can't ban that member"});
        }
    }
}