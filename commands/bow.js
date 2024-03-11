const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_BOW_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('弓')
        .setDescription('查弓價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢弓價格')
                .addStringOption(option => 
                    option.setName('弓')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '乌瑟林之弓', value: '乌瑟林之弓'},
                            { name: '炼狱之触', value: '炼狱之触'},
                            { name: '德雷科指南针', value: '德雷科指南针'},
                            { name: '酸羽', value: '酸羽'},
                            { name: '凛冬统御', value: '凛冬统御'},
                            { name: '初飞', value: '初飞'},
                            { name: '远射', value: '远射'},
                            { name: '阴影之弦', value: '阴影之弦'},
                            { name: '千年龙诗', value: '千年龙诗'},
                            { name: '聚焦怒火', value: '聚焦怒火'},
                            { name: '勇士之爪', value: '勇士之爪'},
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
                .setDescription('更新弓價格')
                .addStringOption(option => 
                    option.setName('弓')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '乌瑟林之弓', value: '乌瑟林之弓'},
                            { name: '炼狱之触', value: '炼狱之触'},
                            { name: '德雷科指南针', value: '德雷科指南针'},
                            { name: '酸羽', value: '酸羽'},
                            { name: '凛冬统御', value: '凛冬统御'},
                            { name: '初飞', value: '初飞'},
                            { name: '远射', value: '远射'},
                            { name: '阴影之弦', value: '阴影之弦'},
                            { name: '千年龙诗', value: '千年龙诗'},
                            { name: '聚焦怒火', value: '聚焦怒火'},
                            { name: '勇士之爪', value: '勇士之爪'},
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
    
                const search = interaction.options.getString('弓');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_BOW_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('弓');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_BOW_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
