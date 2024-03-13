const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_BODY_ARMOUR_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('胸甲')
        .setDescription('查胸甲價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢胸甲價格')
                .addStringOption(option => 
                    option.setName('胸甲')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '茶隼', value: '茶隼'},
                            { name: '奥诺斯图尔紧身衣', value: '奥诺斯图尔紧身衣'},
                            { name: '棱镜衣', value: '棱镜衣'},
                            { name: '乌尔齐的骄傲', value: '乌尔齐的骄傲'},
                            { name: '大失血', value: '大失血'},
                            { name: '备战', value: '备战'},
                            { name: '泰坦之心', value: '泰坦之心'},
                            { name: '山谷巢穴', value: '山谷巢穴'},
                            { name: '克莫德之笼', value: '克莫德之笼'},
                            { name: '晦暗裹布', value: '晦暗裹布'},
                            { name: '血肉编织', value: '血肉编织'},
                            { name: '灰烬的黑色裹s布', value: '灰烬的黑色裹s布'},
                            { name: '银翼', value: '银翼'},
                            { name: '石之血肉', value: '石之血肉'},
                            { name: '山之核', value: '山之核'},
                            { name: '魔像之笼', value: '魔像之笼'},
                            { name: '不稳定核心', value: '不稳定核心'},
                            { name: '静电之壳', value: '静电之壳'},
                            { name: '埃莱科的放弃', value: '埃莱科的放弃'},
                            { name: '基本准则', value: '基本准则'},
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
                .setDescription('更新胸甲價格')
                .addStringOption(option => 
                    option.setName('胸甲')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '茶隼', value: '茶隼'},
                            { name: '奥诺斯图尔紧身衣', value: '奥诺斯图尔紧身衣'},
                            { name: '棱镜衣', value: '棱镜衣'},
                            { name: '乌尔齐的骄傲', value: '乌尔齐的骄傲'},
                            { name: '大失血', value: '大失血'},
                            { name: '备战', value: '备战'},
                            { name: '泰坦之心', value: '泰坦之心'},
                            { name: '山谷巢穴', value: '山谷巢穴'},
                            { name: '克莫德之笼', value: '克莫德之笼'},
                            { name: '晦暗裹布', value: '晦暗裹布'},
                            { name: '血肉编织', value: '血肉编织'},
                            { name: '灰烬的黑色裹s布', value: '灰烬的黑色裹s布'},
                            { name: '银翼', value: '银翼'},
                            { name: '石之血肉', value: '石之血肉'},
                            { name: '山之核', value: '山之核'},
                            { name: '魔像之笼', value: '魔像之笼'},
                            { name: '不稳定核心', value: '不稳定核心'},
                            { name: '静电之壳', value: '静电之壳'},
                            { name: '埃莱科的放弃', value: '埃莱科的放弃'},
                            { name: '基本准则', value: '基本准则'},
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
        )
,

    async execute(interaction) {
        try {
            if (interaction.options.getSubcommand() === '查詢') {
                await interaction.reply({ content: '取得資料中...', ephemeral: true });

                const search = interaction.options.getString('胸甲');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_BODY_ARMOUR_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if ( interaction.options.getSubcommand() === '更新') {
                await interaction.reply({ content: '更新資料中...', ephemeral: true });

                const updateName = interaction.options.getString('胸甲');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');
    
                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_BODY_ARMOUR_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);
    
                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });                
            }
        } catch (error) {
            console.log(error);
        }
    }
}
