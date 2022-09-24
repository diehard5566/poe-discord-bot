const { 
    Client,
    GatewayIntentBits,
    EmbedBuilder, 
} = require('discord.js')
require('dotenv/config')
const { divine } = require('./controller/currencyExchange');
const searchJsonReady = require('./src/divinePrice.json')


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on('ready', () => {
    console.log('Ready to start');

    // send msg every x milliseconds
    const channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID)

    setInterval(() => {
        channel.send('!d')
    }, 300000);
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
                    const exchange = await divine(searchJsonReady);

                    // const exchange = [950,100,950,950,950,930,921,920,920,'nb3aQvH0']

                    const testEmbed2 = new EmbedBuilder()
                        .setDescription('目前D：C價格，取官網前10筆')
                        .setTitle('神聖價格(可點)')
                        .setURL(`https://web.poe.garena.tw/trade/exchange/卡蘭德/${exchange[9]}`)
                        .addFields(
                            { name: '第 1 ~ 10 筆', value:  exchange.toString() + 'c' },
                            { name: '\u200B', value: '\u200B' },
                            { name: '換算成c:', value: '取第二筆為基準作換算，小數點無條件捨去', inline: true },
                            { name: '0.1D = ', value: Math.trunc(exchange[0][1] * 0.1).toString() + 'c' },
                            { name: '0.2D = ', value: Math.trunc(exchange[0][1] * 0.2).toString() + 'c' },
                            { name: '0.3D = ', value: Math.trunc(exchange[0][1] * 0.3).toString() + 'c' },
                            { name: '0.4D = ', value: Math.trunc(exchange[0][1] * 0.4).toString() + 'c' },
                            { name: '0.5D = ', value: Math.trunc(exchange[0][1] * 0.5).toString() + 'c' },
                            { name: '0.6D = ', value: Math.trunc(exchange[0][1] * 0.6).toString() + 'c' },
                            { name: '0.7D = ', value: Math.trunc(exchange[0][1] * 0.7).toString() + 'c' },
                            { name: '0.8D = ', value: Math.trunc(exchange[0][1] * 0.8).toString() + 'c' },
                            { name: '0.9D = ', value: Math.trunc(exchange[0][1] * 0.9).toString() + 'c' },
                        );


                    msg.channel.send({ embeds: [testEmbed2] });
                    break;
                case ('b'):

                    await msg.channel.send('Test message')
                    break;
            }
        }
    } catch (err) {
        console.log('OnMessageError', err);
    }
}); 

client.login(process.env.TOKEN)