const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_OFF_HAND_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('副手法器')
        .setDescription('查副手法器價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢副手法器價格')
                .addStringOption(option => 
                    option.setName('副手法器')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '伊格尼瓦尔兽首', value: '伊格尼瓦尔兽首'},
                            { name: '死亡象征', value: '死亡象征'},
                            { name: '伊泰拉 火焰-寒冷', value: '伊泰拉 火焰-寒冷'},
                            { name: '伊泰拉 寒冷-闪电', value: '伊泰拉 寒冷-闪电'},
                            { name: '伊泰拉 火焰-闪电', value: '伊泰拉 火焰-闪电'},
                            { name: '魔咒编年史', value: '魔咒编年史'},
                            { name: '腐败大脑', value: '腐败大脑'},
                            { name: '谜团碎片', value: '谜团碎片'},
                            { name: '弗雷的避难所', value: '弗雷的避难所'},
                            { name: '幽暗煤碳', value: '幽暗煤碳'},
                            { name: '挥发冰瓶', value: '挥发冰瓶'},
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
                .setDescription('更新副手法器價格')
                .addStringOption(option => 
                    option.setName('副手法器')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '伊格尼瓦尔兽首', value: '伊格尼瓦尔兽首'},
                            { name: '死亡象征', value: '死亡象征'},
                            { name: '伊泰拉 火焰-寒冷', value: '伊泰拉 火焰-寒冷'},
                            { name: '伊泰拉 寒冷-闪电', value: '伊泰拉 寒冷-闪电'},
                            { name: '伊泰拉 火焰-闪电', value: '伊泰拉 火焰-闪电'},
                            { name: '魔咒编年史', value: '魔咒编年史'},
                            { name: '腐败大脑', value: '腐败大脑'},
                            { name: '谜团碎片', value: '谜团碎片'},
                            { name: '弗雷的避难所', value: '弗雷的避难所'},
                            { name: '幽暗煤碳', value: '幽暗煤碳'},
                            { name: '挥发冰瓶', value: '挥发冰瓶'},
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
    
                const search = interaction.options.getString('副手法器');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_OFF_HAND_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('副手法器');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_OFF_HAND_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
