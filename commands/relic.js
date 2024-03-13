const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName, updatesSheetData } = require('../DB-test/googleSheet');
const { ENUM_RELIC_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('遺物')
        .setDescription('查遺物價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢遺物價格')
                .addStringOption(option => 
                    option.setName('遺物')
                        .setDescription('輸入名字')
                        .addChoices(
                            { name: '元素之书', value: '元素之书'},
                            { name: '死灵药典', value: '死灵药典'},
                            { name: '光之传家宝', value: '光之传家宝'},
                            { name: '魂火', value: '魂火'},
                            { name: '瓦尔德尔圣杯', value: '瓦尔德尔圣杯'},
                            { name: '兰花花瓣', value: '兰花花瓣'},
                            { name: '乌塞努伊球', value: '乌塞努伊球'},
                            { name: '莫拉马斯剑柄', value: '莫拉马斯剑柄'},
                            { name: '梅尔文令状', value: '梅尔文令状'},
                            { name: '遗忘之锚', value: '遗忘之锚'},
                            { name: '赫基尔之皿', value: '赫基尔之皿'},
                            { name: '奥瑞克西亚之眼', value: '奥瑞克西亚之眼'},
                            { name: '克尔坦爆破剂', value: '克尔坦爆破剂'},
                            { name: '风暴刻印的圣约书', value: '风暴刻印的圣约书'},
                            { name: '乌斯罗斯的扭曲之心', value: '乌斯罗斯的扭曲之心'},
                            { name: '斗争容器', value: '斗争容器'},
                            { name: '狄奥泰恩的滴血笔尖', value: '狄奥泰恩的滴血笔尖'},
                            { name: '奥奇里安的灰烬', value:'奥奇里安的灰烬'},
                            { name: '吸血鬼之巢', value: '吸血鬼之巢'},
                            { name: '漩涡旗帜', value: '漩涡旗帜'},
                            { name: '劫掠者的黄金', value: '劫掠者的黄金'},
                            { name: '多头蛇之盒', value: '多头蛇之盒'},
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
                    .setDescription('更新遺物價格')
                    .addStringOption(option => 
                        option.setName('遺物')
                            .setDescription('輸入名字')
                            .addChoices(
                                { name: '元素之书', value: '元素之书'},
                                { name: '死灵药典', value: '死灵药典'},
                                { name: '光之传家宝', value: '光之传家宝'},
                                { name: '魂火', value: '魂火'},
                                { name: '瓦尔德尔圣杯', value: '瓦尔德尔圣杯'},
                                { name: '兰花花瓣', value: '兰花花瓣'},
                                { name: '乌塞努伊球', value: '乌塞努伊球'},
                                { name: '莫拉马斯剑柄', value: '莫拉马斯剑柄'},
                                { name: '梅尔文令状', value: '梅尔文令状'},
                                { name: '遗忘之锚', value: '遗忘之锚'},
                                { name: '赫基尔之皿', value: '赫基尔之皿'},
                                { name: '奥瑞克西亚之眼', value: '奥瑞克西亚之眼'},
                                { name: '克尔坦爆破剂', value: '克尔坦爆破剂'},
                                { name: '风暴刻印的圣约书', value: '风暴刻印的圣约书'},
                                { name: '乌斯罗斯的扭曲之心', value: '乌斯罗斯的扭曲之心'},
                                { name: '斗争容器', value: '斗争容器'},
                                { name: '狄奥泰恩的滴血笔尖', value: '狄奥泰恩的滴血笔尖'},
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
    
                const search = interaction.options.getString('遺物');
                const socketNumber = interaction.options.getString('洞數');
    
                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_RELIC_SHEET);
    
                await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });
            } else if (interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新價格中...', ephemeral: true });

                const updateName = interaction.options.getString('遺物');
                const updatePriceValue = interaction.options.getString('更新價格為');
                const socketNumber = interaction.options.getString('洞數');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_RELIC_SHEET, updateName, Number(socketNumber), `${updatePriceValue}萬`);

                await interaction.editReply({ content: `${updateName}， ${socketNumber}洞，價格更新為：${updatePriceValue}萬`, ephemeral: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
