const ms = require('ms');
const client = require('../../main');
module.exports = {
    name: 'mute',
    aliases: ['m'],
    description: 'Mute a member',
    permissions: ["ADMINISTRATOR", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MANAGE_ROLES", "MANAGE_GUILD"],
    run: async (client, message, args) => {
        const target = message.mentions.users.first();
        if(target && message.member.roles.cache.has(client.config.MOD_ID)){

            //message.guild.roles.create({name: 'Muted', reason: "Role for muted members"})
            let mainRole = message.guild.roles.cache.find(role => role.name === 'Member');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = message.guild.members.cache.get(target.id);

            if(!args[1]){
                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
                message.channel.send({content: `Muted <@${memberTarget.user.id}>`});
                return  
            }
            
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            message.channel.send({content: `Muted <@${memberTarget.user.id}> for ${ms(ms(args[1]))}`});

            setTimeout(function () {
                memberTarget.roles.remove(muteRole.id);
                memberTarget.roles.add(mainRole.id);
                message.channel.send({content: `Unmuted <@${memberTarget.user.id}>`});
            }, ms(args[1]));
        } else {
            message.channel.send({content: "Can't find that member"});
        }
    }
}