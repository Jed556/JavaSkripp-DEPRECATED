module.exports = {
    name: 'embedtest',
    description: "Embeds",
    run: async (client, message, args) => {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('Commands')
        .setURL('https://youtube.com')
        .setDescription("Da Embed")
        .addFields(
            {name: 'Hi', value: 'Good'},
            {name: 'Halo', value: 'nc'},
            {name: 'Hola', value: 'bye'}
        )
        .setImage('https://www.bing.com/images/search?view=detailV2&ccid=W8dS2y3K&id=5272D7C2A810A562927641CC15D38B2101BFD4DB&thid=OIF.CdIBJ3kCwQQskWNxsSPj8w&mediaurl=https%3a%2f%2fi.ytimg.com%2fvi%2fK3pqLr9Gyng%2fmaxresdefault.jpg&exph=720&expw=1280&q=popping+cat+meme&simid=429641071120&FORM=IRPRST&ck=09D201277902C1042C916371B123E3F3&selectedIndex=27&ajaxhist=0&ajaxserp=0')
        .Footer(Byeeeeeeee);

        message.channel.send({embed: [embed]});
    }

}