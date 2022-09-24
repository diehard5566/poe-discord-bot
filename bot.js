const { 
    Client,
    GatewayIntentBits,
    EmbedBuilder 
} = require('discord.js')
require('dotenv/config')
const { getURLFromGGC } = require('./controller/currencyExchange')
const Decimal = require('decimal.js')
const connectDB = require('./db/connection')
const Exchange = require('./module/exchangeSchema')
const { model } = require('mongoose')
const CronJob = require('cron').CronJob;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


// confirm bot start and connected to DB
const start = async () => {
    try {
        await connectDB(process.env.MONGO_TOKEN)
        client.on('ready', () => {
            console.log('Ready to start');
            
            // send msg every x milliseconds
            // 1021820420200075336 test channel id 
            const channel = client.channels.cache.find(channel => channel.id === '1021820420200075336') 

            setInterval(() => {
                channel.send('d')
            }, 10000);

        });
    } catch (error) {
        console.log(error);
    }
};

start();

const searchJsonReady = {
    exchange: {
        status: {
            option: "onlineleague"
        },
        have: ["divine"],
        want: ["chaos"],
    },
};

const divine = async (query) => {
    const data = await getURLFromGGC(query);

    const obj = data.result;

    const top3Value = [];

    // const D1 = 1000 //new Decimal(Object.values(obj)[0].listing.offers[0].item.amount).c
    // const D2 = new Decimal(Object.values(obj)[1].listing.offers[0].item.amount).c
    // const D3 = new Decimal(Object.values(obj)[2].listing.offers[0].item.amount).c
    // const D4 = new Decimal(Object.values(obj)[3].listing.offers[0].item.amount).c
    // const D5 = new Decimal(Object.values(obj)[4].listing.offers[0].item.amount).c

    for (let i = 0; i < 10; i++) {
        const D = new Decimal(Object.values(obj)[i].listing.offers[0].item.amount).c;
        top3Value.push(D);
    }

    // top3Value.push(D1,D2,D3,D4,D5)

    const finalDivinePrice = top3Value.flat()

    console.log('🚀 -------------------------------------------------------------------------🚀');
    console.log('🚀 ~ file: bot.js ~ line 61 ~ divine ~ finalDivinePrice', typeof finalDivinePrice[0]);
    console.log('🚀 -------------------------------------------------------------------------🚀');

    return finalDivinePrice;
}

const testEmbed = new EmbedBuilder()
    .setDescription('目前D：C價格，取官網前五筆')
    .setTitle('Divine')
    .addFields(
        { name: '第一筆', value: '1D : 1000C' },
        { name: '第二筆', value: '1D : 800C' },
        { name: '第三筆', value: '1D : 790C' },
        { name: '第四筆', value: '1D : 780C' },
        { name: '第五筆', value: '1D : 760C' },
        { name: '\u200B', value: '\u200B' },
        { name: '換算成c:', value: '取第二筆為基準作換算', inline: true },
        { name: '0.1D = ', value: '80c' },
        { name: '0.2D = ', value: '160c' },
        { name: '0.3D = ', value: '240c' },
        { name: '0.4D = ', value: '320c' },
        { name: '0.5D = ', value: '400c' },
        { name: '0.6D = ', value: '80c' },
        { name: '0.7D = ', value: '160c' },
        { name: '0.8D = ', value: '240c' },
        { name: '0.9D = ', value: '320c' },
    );



client.on('messageCreate', async (msg) => { 
        
        // TODO 搬到controller? 
    // 前置判斷
    // try {
    //     if (!msg.guild || !msg.member) return;
    //     if (!msg.member.user) return;
    //     if (msg.member.user.bot) return;
    // } catch (error) {
    //     console.log(error);
    // }

    // 字串分析
    try {
        const prefix = '!'
        if (msg.content.substring(0, prefix.length) === prefix) {
            const cmd = msg.content.substring(prefix.length).split(' ');

                // 功能實作
                switch (cmd[0]) {
                    case 'ping':
                        msg.channel.send('pong')
                        break;
                    case 'div':
                        msg.channel.send({ embeds: [testEmbed] })
                        break;
                    default:
                        break;
                };
        };
    } catch (error) {
        console.log('OnMessageError', error);
    }



    if (msg.content === 'D') { //TODO command 之後要改
        // 取得第一筆資料
        try {
            const exchange = await divine(searchJsonReady);
            
            const saveToDB = new Exchange({
                id: 1,
                divPrice: exchange,
            });

            saveToDB.save().then((result) => {
                console.log(result);
            });

            msg.channel.send(exchange.toString());
            
        } catch (error) {
            console.log(error);
        }

    if (msg.content === 'd') { //TODO 把這邊換成定時
        try {
                // TODO 定時取得資料然後更新到DB 預計每2 or 5分鐘一次
                // await User.updateOne({ email: 'test2@google.com' }, { email: 'test@google.com' });

                // get data from DB
                const divPriceFromDB = await model.find({ id: 1});

                console.log('🚀 -------------------------------------------------------------------------🚀');
                console.log('🚀 ~ file: bot.js ~ line 149 ~ client.on ~ divPriceFromDB', divPriceFromDB);
                console.log('🚀 -------------------------------------------------------------------------🚀');
                
                // TODO 要改成send embed
                msg.channel.send(exchange.toString());
        } catch (error) {
            console.log(error);
        }
    }

    }
});

client.login(process.env.TOKEN)