const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_AXE_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手斧')
        .setDescription('查雙手斧價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢雙手斧價格')
                .addStringOption(option => 
                    option.setName('雙手斧')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '骸骨收割', value: '骸骨收割'},
                            { name: '冷漠巨口', value: '冷漠巨口'},
                            { name: '死亡之拥', value: '死亡之拥'},
                            { name: '篡夺者之令', value: '篡夺者之令'},
                            { name: '哈特农之誓', value: '哈特农之誓'},
                            { name: '苦痛火镰', value: '苦痛火镰'},
                            { name: '双扭线天平', value: '双扭线天平'},
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
                .setDescription('更新雙手斧價格')
                .addStringOption(option => 
                    option.setName('雙手斧')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '骸骨收割', value: '骸骨收割'},
                            { name: '冷漠巨口', value: '冷漠巨口'},
                            { name: '死亡之拥', value: '死亡之拥'},
                            { name: '篡夺者之令', value: '篡夺者之令'},
                            { name: '哈特农之誓', value: '哈特农之誓'},
                            { name: '苦痛火镰', value: '苦痛火镰'},
                            { name: '双扭线天平', value: '双扭线天平'},
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
    
                const search = interaction.options.getString('雙手斧');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_AXE_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('雙手斧');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_TWO_HAND_AXE_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
