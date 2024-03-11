const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_QUIVER_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('箭袋')
        .setDescription('查箭袋價格')
        .addStringOption(option => 
            option.setName('箭袋')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '特罗卡之牙', value: '特罗卡之牙'},
                    { name: '箭矢护卫', value: '箭矢护卫'},
                    { name: '血腥贮藏', value: '血腥贮藏'},
                    { name: '夜之使者', value: '夜之使者'},
                    { name: '泽里尔的狩猎', value: '泽里尔的狩猎'},
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

            const search = interaction.options.getString('箭袋');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_QUIVER_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
