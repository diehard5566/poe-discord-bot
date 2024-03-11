const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_BOOTS_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('鞋子')
        .setDescription('查鞋子價格')
        .addStringOption(option => 
            option.setName('鞋子')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '哀霜', value: '哀霜'},
                    { name: '风暴潮', value: '风暴潮'},
                    { name: '伊泰拉之路', value: '伊泰拉之路'},
                    { name: '火龙靴', value: '火龙靴'},
                    { name: '苏洛龙之靴', value: '苏洛龙之靴'},
                    { name: '回光返照', value: '回光返照'},
                    { name: '短暂休息', value: '短暂休息'},
                    { name: '祈雨舞', value: '祈雨舞'},
                    { name: '受阻的命运', value: '受阻的命运'},
                    { name: '暗影迷踪步', value: '暗影迷踪步'},
                    { name: '首府的课程', value: '首府的课程'},
                    { name: '俞利娅之路', value: '俞利娅之路'},
                    { name: '维特拉塞尔的根须', value: '维特拉塞尔的根须'},
                    { name: '飘雪', value: '飘雪'},
                    { name: '山之麓', value: '山之麓'},
                    { name: '维昂的战车', value: '维昂的战车'},
                    { name: '特尔芬的海市蜃楼', value: '特尔芬的海市蜃楼'},
                    { name: '被抹灭的降临', value: '被抹灭的降临'},
                    { name: '流亡者之血', value: '流亡者之血'},
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

            const search = interaction.options.getString('鞋子');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_BOOTS_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
