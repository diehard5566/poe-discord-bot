const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_RING_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('戒指')
        .setDescription('查戒指價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢戒指價格')
                .addStringOption(option => 
                    option.setName('戒指')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '三眼戒指', value: '三眼戒指'},
                            { name: '树栖回路', value: '树栖回路'},
                            { name: '空心手指', value: '空心手指'},
                            { name: '利亚斯图章', value: '利亚斯图章'},
                            { name: '终末游牧民的传家宝', value: '终末游牧民的传家宝'},
                            { name: '血丝带', value: '血丝带'},
                            { name: '奥卡雷恩', value: '奥卡雷恩'},
                            { name: '水银线圈', value: '水银线圈'},
                            { name: '耀阳花环', value: '耀阳花环'},
                            { name: '痛苦虹吸', value: '痛苦虹吸'},
                            { name: '异端预言家之舌', value: '异端预言家之舌'},
                            { name: '席尔瓦蕨叶', value: '席尔瓦蕨叶'},
                            { name: '朱拉的星盘', value: '朱拉的星盘'},
                            { name: '死亡灰烬', value: '死亡灰烬'},
                            { name: '半影', value: '半影'},
                            { name: '阿特拉里亚的红戒指', value: '阿特拉里亚的红戒指'},
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
                .setDescription('更新戒指價格')
                .addStringOption(option => 
                    option.setName('戒指')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '三眼戒指', value: '三眼戒指'},
                            { name: '树栖回路', value: '树栖回路'},
                            { name: '空心手指', value: '空心手指'},
                            { name: '利亚斯图章', value: '利亚斯图章'},
                            { name: '终末游牧民的传家宝', value: '终末游牧民的传家宝'},
                            { name: '血丝带', value: '血丝带'},
                            { name: '奥卡雷恩', value: '奥卡雷恩'},
                            { name: '水银线圈', value: '水银线圈'},
                            { name: '耀阳花环', value: '耀阳花环'},
                            { name: '痛苦虹吸', value: '痛苦虹吸'},
                            { name: '异端预言家之舌', value: '异端预言家之舌'},
                            { name: '席尔瓦蕨叶', value: '席尔瓦蕨叶'},
                            { name: '朱拉的星盘', value: '朱拉的星盘'},
                            { name: '死亡灰烬', value: '死亡灰烬'},
                            { name: '半影', value: '半影'},
                            { name: '阿特拉里亚的红戒指', value: '阿特拉里亚的红戒指'},
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
    
                const search = interaction.options.getString('戒指');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_RING_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('戒指');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_RING_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
