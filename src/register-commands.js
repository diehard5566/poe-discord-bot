require('dotenv/config')
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: '開',
        description: '開啟買賣通知'
    },
    {
        name: '關',
        description: '關閉買賣通知'
    },
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('註冊中...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.BOT_ID, process.env.DS_SERVER_ID), {
                body: commands,
            }
        )

        console.log('指令註冊完畢！');
    } catch (error) {
        console.log(error);    
    }
})();
