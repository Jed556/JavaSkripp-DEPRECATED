const util = require('minecraft-server-util')

module.exports = {
    name: 'mcserver',
    cooldown: 3,
    description: 'Get minecraft server info',
    permissions: ["CONNECT"],
    run: async (client, cmd, message, args) => {

        if(cmd === 'mcserver'){
            if(!args[0]) return message.channel.send({content: 'Enter a minecraft server ip'});
            if(!args[1]) return message.channel.send({content: 'Enter a minecraft server port'});
    
            util.status(args[0], {port: parseInt(args[1])}).then((response) =>{
                console.log(response);
                const embed = new client.MessageEmbed()
                .setColor('#BFC0EB')
                .setTitle('MC Server Status')
                .addFields(
                    {name: 'Server IP', value: response.host},
                    {name: 'Online Players', value: response.onlinePlayers},
                    {name: 'Max Players', value: response.maxPlayers},
                    {name: "Version", value: response.version}
                )
                .setFooter('Minecraft')
                message.channel.send({embeds: [embed]});
            })
            .catch ((error) =>{
                message.channel.send({content: 'Error finding the server'})
                throw error;
            });
        }
    }
}