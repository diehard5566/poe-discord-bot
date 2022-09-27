const { 
    Client,
    GatewayIntentBits,
} = require('discord.js')
require('dotenv/config')
const { getEmbedFromExchange } = require('./src/embed')


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on('ready', async() => {
    console.log('Ready to start');

    // send msg every x milliseconds
    // 可以任意增減
    const channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID);
    const channel2 = client.channels.cache.find(channel2 => channel2.id === process.env.PAYED_CHANNEL_ID)

    setInterval( async() => {
        const finalEmbed = await getEmbedFromExchange();

        console.log('🚀 ------------------------------------------------------------------🚀');
        console.log('🚀 ~ file: bot.js ~ for vps log', 'bot is fine now');
        console.log('🚀 ------------------------------------------------------------------🚀');

        channel.send({ embeds: [finalEmbed] });
    }, 210000);

    // 底下需要刪除，否則沒有加入PAYED_CHANNEL_ID會報錯
    setInterval( async() => {
        const finalEmbed = await getEmbedFromExchange();

        console.log('🚀 ------------------------------------------------------------------🚀');
        console.log('🚀 ~ file: bot.js ~ for vps log', 'channel2 is fine now');
        console.log('🚀 ------------------------------------------------------------------🚀');

        channel2.send({ embeds: [finalEmbed] }); 
    }, 600000);
    // 刪到這裡
});

client.on('messageCreate', async (msg) => {
    //字串分析
    try {
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) //如果訊息的開頭~前綴字長度的訊息 = 前綴字
        {
            const cmd = msg.content.substring(prefix.length).split(' '); //以空白分割前綴以後的字串

            //功能實作
            switch (cmd[0]) {
                case 'd':
                    const finalEmbed = await getEmbedFromExchange();
                    msg.channel.send({ embeds: [finalEmbed] });
                    break;
                case 'b':
                    msg.channel.send('test msg');
                    break;
            }
        }
    } catch (err) {
        console.log('OnMessageError', err);
    }
}); 

client.login(process.env.TOKEN);