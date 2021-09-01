const client = require("../../main");

module.exports = {
    name: 'unmute',
    description: 'Unmute a member',
    permissions: ["ADMINISTRATOR", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MANAGE_ROLES", "MANAGE_GUILD"],
    run: async (client, message, args) => {
        const target = message.mentions.users.first();
        if(target && message.member.roles.cache.has(client.config.MOD_ID)){
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Member');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);
            
            memberTarget.roles.remove(muteRole.id);
            memberTarget.roles.add(mainRole.id);
            message.channel.send(`Unmuted <@${memberTarget.user.id}>`);
        } else {
            message.channel.send("Can't find that member");
        }
    }
}