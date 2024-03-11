const cron = require('node-cron');
const fs = require("node:fs");
const path = require("node:path");
const { 
    Client,
    GatewayIntentBits,
    Collection,
    Events,
} = require('discord.js')
require('dotenv/config')
const { getEmbedFromExchange } = require('./src/embed')
const { 
    chromeQuery,
    jewellersQuery,
    altQuery,
} = require('./src/currencySearchQuery');
const {
    hourlyAlertByCurrencyQuery,
} = require('./controller/currencyNotification');

let userAlertArray = [];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// client.on('interactionCreate', (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     const user = interaction.user.id

//     if (interaction.commandName === '開') {
//         console.log(`${user} 使用開啟通知功能`);

//         interaction.reply(`<@${user}> 已開啟通知`);

//         if (!userAlertArray.includes(user)) {
//             userAlertArray.push(user);
//         }
//     }

//     if (interaction.commandName === '關') {
//         console.log(`${user} 使用關閉通知功能`);

//         interaction.reply(`<@${user}> 已關閉通知`);
//         userAlertArray = userAlertArray.filter(existingId => existingId !== user);
//     }
// });

client.on('ready', async() => {
    console.log('Ready to start');

    // send msg every x milliseconds
    // // 可以任意增減
    const channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID);
    const channel2 = client.channels.cache.find(channel2 => channel2.id === process.env.PAYED_CHANNEL_ID)
    // const testChannel = client.channels.cache.find(test => test.id === '1180885277741420654')

    setInterval( async() => {
        try {
            const finalEmbed = await getEmbedFromExchange();
    
            console.log('🚀 ------------------------------------------------------------------🚀');
            console.log('🚀 ~ file: bot.js ~ for vps log', 'bot is fine now');
            console.log('🚀 ------------------------------------------------------------------🚀');
    
            channel.send({ embeds: [finalEmbed] });
        } catch (error) {
            console.log(new Date());
            console.error('An error occurred:', error);
        }
    }, 210000);

    // 底下需要刪除，否則沒有加入PAYED_CHANNEL_ID會報錯
    setInterval( async() => {
        try {
            const finalEmbed = await getEmbedFromExchange();
    
            console.log('🚀 ------------------------------------------------------------------🚀');
            console.log('🚀 ~ file: bot.js ~ for vps log', 'channel2 is fine now');
            console.log('🚀 ------------------------------------------------------------------🚀');
    
            channel2.send({ embeds: [finalEmbed] }); 
        } catch (error) {
            console.log(new Date());
            console.error('An error occurred:', error);
        }
    }, 600000);
    // 刪到這裡

    // 買賣通知
    const historyAlerts = new Map();

    // 每小時執行一次的函數
    setInterval(async () => {
        console.log('hourly alert started at:', new Date());
        await hourlyAlertByCurrencyQuery(jewellersQuery,testChannel, userAlertArray, historyAlerts);
        await hourlyAlertByCurrencyQuery(altQuery,testChannel, userAlertArray, historyAlerts);
        await hourlyAlertByCurrencyQuery(chromeQuery, testChannel, userAlertArray, historyAlerts);
    }, 3600000);

    // 每天午夜重置歷史記錄
    cron.schedule('0 0 * * *', () => {
        historyAlerts.clear();
    }, {
        scheduled: true,
        timezone: "Asia/Taipei"
    });


    // TODO: 12/27 有空的話完成下面的修正
    // function scheduleHourlyTasks() {
    //     const now = new Date();
    //     const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    //     const delay = nextHour - now;
    
    //     setTimeout(() => {
    //         hourlyAlertByCurrencyQuery(jewellersQuery, testChannel, userAlertArray, historyAlerts);
    //         hourlyAlertByCurrencyQuery(altQuery, testChannel, userAlertArray, historyAlerts);
    //         hourlyAlertByCurrencyQuery(chromeQuery, testChannel, userAlertArray, historyAlerts);
    
    //         setInterval(() => {
    //             hourlyAlertByCurrencyQuery(jewellersQuery, testChannel, userAlertArray, historyAlerts);
    //             hourlyAlertByCurrencyQuery(altQuery, testChannel, userAlertArray, historyAlerts);
    //             hourlyAlertByCurrencyQuery(chromeQuery, testChannel, userAlertArray, historyAlerts);
    //         }, 3600000); // 1小时
    //     }, delay);
    // }
    
    // // 初始化定时任务
    // scheduleHourlyTasks();
    
    // // 每天午夜重置历史记录
    // cron.schedule('0 0 * * *', () => {
    //     historyAlerts.clear();
    // }, {
    //     scheduled: true,
    //     timezone: "Asia/Taipei"
    // });
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
        console.error('An error occurred:', err);
    }
}); 

// 指令
client.commands = new Collection();

const commands = [];

// 讀取 commands 資料夾下的 js 檔案
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// 將指令加入 Collection
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// 在 Collection 中以指令名稱作為 key，指令模組作為 value 加入
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[警告] ${filePath} 中的指令缺少必要的 "data" 或 "execute" 屬性。`);
	}

	// 存進 commands array
	commands.push(command.data.toJSON());
}

// 當收到互動事件時，檢查是否為指令，若是則執行該指令
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`找不到指令 ${interaction.commandName}。`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "執行指令時發生錯誤！",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "執行指令時發生錯誤！",
				ephemeral: true,
			});
		}
	}
});

// 註冊指令
const registerCommands = async (client) => {
	try {
		if (client.application) {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await client.application.commands.set(commands);
			console.log(`Successfully reloaded ${data.size} application (/) commands.`);
		}
	} catch(e) {
		console.error(e);
	}
}

// 當 client 就緒時顯示訊息
client.once(Events.ClientReady, async (client) => {
	console.log(`已就緒！已登入帳號：${client.user.tag}`);
	await registerCommands(client);
});

client.login(process.env.TOKEN);
