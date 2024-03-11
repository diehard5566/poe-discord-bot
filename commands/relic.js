const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_RELIC_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('遺物')
        .setDescription('查遺物價格')
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
                    // { name: '被抹灭野蛮人的奉献', value: '被抹灭野蛮人的奉献'},
                    // { name: '被抹灭法师的知识', value: '被抹灭法师的知识'},
                    // { name: '被抹灭守卫的法典', value: '被抹灭守卫的法典'},
                    // { name: '被抹灭侍祭的野心', value: '被抹灭侍祭的野心'},
                    // { name: '被抹灭游侠的赌博', value: '被抹灭游侠的赌博'},
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
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: true });

            const search = interaction.options.getString('遺物');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_RELIC_SHEET);

            await interaction.editReply({ content: `遺器不包含抹滅系列 ${finalResponseToDiscordResult}`, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
