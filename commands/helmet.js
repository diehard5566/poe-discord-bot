const { SlashCommandBuilder } = require('discord.js');
const { getSheetData } = require('../DB-test/googleSheet');
const { ENUM_HElMET_SHEET, MAP_HELMET_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('頭盔')
        .setDescription('查頭盔價格')
        .addStringOption(option => 
            option.setName('頭盔')
            .addChoices(
            ...MAP_HELMET_SHEET.helmet
            )
                .setDescription('輸入名字')
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

            const search = interaction.options.getString('頭盔');
            const socketNumber = interaction.options.getString('洞數');

            const allHelmet = await getSheetData('1Jw_YeYYUbPiWpm89Ph194Y7pk6PaeKahzlzNqBJrRgs', ENUM_HElMET_SHEET);

            const searchHelmet = allHelmet.find(helmet => helmet[0] === search)
            const resultHelmetWithSocketNumber = searchHelmet[Number(socketNumber) + 1] || '目前尚無資料或沒價' ;
            const finalResponseToDiscordResult = `目前 "${search}"  "${socketNumber} 洞"的市集價格為 ：${resultHelmetWithSocketNumber}，掉落地點為： ${searchHelmet[1]}`

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}