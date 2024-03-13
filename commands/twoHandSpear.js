const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_SPEARS_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手長矛')
        .setDescription('查雙手長矛價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢雙手長矛價格')
                .addStringOption(option => 
                    option.setName('雙手長矛')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '刺痛', value: '刺痛'},
                            { name: '莫迪达斯之触', value: '莫迪达斯之触'},
                            { name: '鲨齿锯', value: '鲨齿锯'},
                            { name: '终末深渊的三叉戟', value: '终末深渊的三叉戟'},
                            { name: '致死剂量', value: '致死剂量'},
                            { name: '审判者', value: '审判者'},
                            { name: '图兰尼斯双叉戟', value: '图兰尼斯双叉戟'},
                            { name: '失落避难所的挽歌', value: '失落避难所的挽歌'},
                            { name: '西尔平的分形树', value: '西尔平的分形树'},
                    )
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('洞數')
                        .setDescription('輸入洞數')
                        .addChoices(
                            ...SOCKET_NUMBER.socketNumber
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('更新')
                .setDescription('更新雙手長矛價格')
                .addStringOption(option => 
                    option.setName('雙手長矛')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '刺痛', value: '刺痛'},
                            { name: '莫迪达斯之触', value: '莫迪达斯之触'},
                            { name: '鲨齿锯', value: '鲨齿锯'},
                            { name: '终末深渊的三叉戟', value: '终末深渊的三叉戟'},
                            { name: '致死剂量', value: '致死剂量'},
                            { name: '审判者', value: '审判者'},
                            { name: '图兰尼斯双叉戟', value: '图兰尼斯双叉戟'},
                            { name: '失落避难所的挽歌', value: '失落避难所的挽歌'},
                            { name: '西尔平的分形树', value: '西尔平的分形树'},
                    )
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('洞數')
                        .setDescription('輸入洞數')
                        .addChoices(
                            ...SOCKET_NUMBER.socketNumber
                        )
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('更新價格為')
                        .setDescription('輸入要更新的價格')
                        .setRequired(true)
                )    
        ),

    async execute(interaction) {
        try {
            if (interaction.options.getSubcommand() === '查詢') {
                await interaction.reply({ content: '取得資料中...', ephemeral: true });
    
                const search = interaction.options.getString('雙手長矛');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_SPEARS_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('雙手長矛');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_TWO_HAND_SPEARS_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
