const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_ONE_HAND_HAMMERS_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('單手鎚')
        .setDescription('查單手鎚價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢單手鎚價格')
                .addStringOption(option => 
                    option.setName('單手鎚')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '鲜血棍', value: '鲜血棍'},
                            { name: '阿雷克之骨', value: '阿雷克之骨'},
                            { name: '叛逆的意志', value: '叛逆的意志'},
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
                .setDescription('更新單手鎚價格')
                .addStringOption(option => 
                    option.setName('單手鎚')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '鲜血棍', value: '鲜血棍'},
                            { name: '阿雷克之骨', value: '阿雷克之骨'},
                            { name: '叛逆的意志', value: '叛逆的意志'},
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
    
                const search = interaction.options.getString('單手鎚');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ONE_HAND_HAMMERS_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('單手鎚');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_ONE_HAND_HAMMERS_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
