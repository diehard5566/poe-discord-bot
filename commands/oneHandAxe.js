const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_ONE_HAND_AXE_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('單手斧')
        .setDescription('查單手斧價格')
        .addStringOption(option => 
            option.setName('單手斧')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '野兽之王', value: '野兽之王'},
                    { name: '鲜血滋味', value: '鲜血滋味'},
                    { name: '无可争议', value: '无可争议'},
                    { name: '风暴之喉', value: '风暴之喉'},
                    { name: '血颂', value: '血颂'},
                    { name: '哈卡的凤凰', value: '哈卡的凤凰'},
                    { name: '协议遣散', value: '协议遣散'},
                    { name: '斩击解决方案', value: '斩击解决方案'},
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

            const search = interaction.options.getString('單手斧');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ONE_HAND_AXE_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
