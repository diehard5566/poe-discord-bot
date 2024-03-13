const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_QUIVER_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('箭袋')
        .setDescription('查箭袋價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢箭袋價格')
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
                )    
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('更新')
                .setDescription('更新箭袋價格')
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
    
                const search = interaction.options.getString('箭袋');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_QUIVER_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('箭袋');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_QUIVER_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
