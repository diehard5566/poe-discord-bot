const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_ROD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手長杖')
        .setDescription('查雙手長杖價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢雙手長杖價格')
                .addStringOption(option => 
                    option.setName('雙手長杖')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '瘟疫携带者法杖', value: '瘟疫携带者法杖'},
                            { name: '龙焰赦令', value: '龙焰赦令'},
                            { name: '全视', value: '全视'},
                            { name: '艾尔贡避难所', value: '艾尔贡避难所'},
                            { name: '贾斯伯灼热之傲', value: '贾斯伯灼热之傲'},
                            { name: '坚毅的诅咒', value: '坚毅的诅咒'},
                            { name: '异常呼唤', value: '异常呼唤'},
                            { name: '圣器分支', value: '圣器分支'},
                            { name: '博斯无政府状态', value: '博斯无政府状态'},
                            { name: '瑞文的堡垒', value: '瑞文的堡垒'},
                            { name: '苦痛之轮', value: '苦痛之轮'},
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
                .setDescription('更新雙手長杖價格')
                .addStringOption(option => 
                    option.setName('雙手長杖')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '瘟疫携带者法杖', value: '瘟疫携带者法杖'},
                            { name: '龙焰赦令', value: '龙焰赦令'},
                            { name: '全视', value: '全视'},
                            { name: '艾尔贡避难所', value: '艾尔贡避难所'},
                            { name: '贾斯伯灼热之傲', value: '贾斯伯灼热之傲'},
                            { name: '坚毅的诅咒', value: '坚毅的诅咒'},
                            { name: '异常呼唤', value: '异常呼唤'},
                            { name: '圣器分支', value: '圣器分支'},
                            { name: '博斯无政府状态', value: '博斯无政府状态'},
                            { name: '瑞文的堡垒', value: '瑞文的堡垒'},
                            { name: '苦痛之轮', value: '苦痛之轮'},
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
    
                const search = interaction.options.getString('雙手長杖');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_ROD_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('雙手長杖');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_TWO_HAND_ROD_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
