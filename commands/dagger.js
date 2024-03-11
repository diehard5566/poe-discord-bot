const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_DAGGER_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('匕首')
        .setDescription('匕首價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢匕首價格')   
                .addStringOption(option => 
                    option.setName('匕首')
                        .setDescription('輸入名字')
                        .addChoices(
                        { name: '烟雾编织者', value: '烟雾编织者'},
                        { name: '闪电岩片', value: '闪电岩片'},
                        { name: '干旱之刃', value: '干旱之刃'},
                        { name: '造鬼者', value: '造鬼者'},
                        { name: '耶尔克霍尔的爆破刀', value: '耶尔克霍尔的爆破刀'},
                        { name: '德拉戈拉斯之爪', value: '德拉戈拉斯之爪'},
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
                .setDescription('更新匕首價格')
                .addStringOption(option => 
                    option.setName('匕首')
                        .setDescription('輸入名字')
                        .addChoices(
                        { name: '烟雾编织者', value: '烟雾编织者'},
                        { name: '闪电岩片', value: '闪电岩片'},
                        { name: '干旱之刃', value: '干旱之刃'},
                        { name: '造鬼者', value: '造鬼者'},
                        { name: '耶尔克霍尔的爆破刀', value: '耶尔克霍尔的爆破刀'},
                        { name: '德拉戈拉斯之爪', value: '德拉戈拉斯之爪'},
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
    
                const search = interaction.options.getString('匕首');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_DAGGER_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('匕首');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_DAGGER_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
