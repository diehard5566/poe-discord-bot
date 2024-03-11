const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_ROD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手長杖')
        .setDescription('查雙手長杖價格')
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
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: true });

            const search = interaction.options.getString('雙手長杖');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_ROD_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
