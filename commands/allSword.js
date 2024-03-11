const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_ALL_SWORD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('劍')
        .setDescription('查劍價格')
        .addStringOption(option => 
            option.setName('劍')
                .setDescription('輸入名字')
                .addChoices(
                    {name: '微笑遗容', value: '微笑遗容'},
                    {name: '火山巨剑', value: '火山巨剑'},
                    {name: '梦棘', value: '梦棘'},
                    {name: '冲击', value: '冲击'},
                    {name: '利维坦切刀', value: '利维坦切刀'},
                    {name: '战斗法师奋勇之剑', value: '战斗法师奋勇之剑'},
                    {name: '日蚀', value: '日蚀'},
                    {name: '嗜血的托克雷芬', value: '嗜血的托克雷芬'},
                    {name: '噬魔剑', value: '噬魔剑'},
                    {name: '马拉特罗斯的脊柱', value: '马拉特罗斯的脊柱'},
                    {  name: '蜂鸣', value: '蜂鸣'},
                    {  name: '雷恩之眼', value: '雷恩之眼'},
                    {  name: '彩虹刃', value: '彩虹刃'},
                    {  name: '角斗士之誓', value: '角斗士之誓'},
                    {  name: '时停错觉', value: '时停错觉'},
                    {  name: '奥里斯', value: '奥里斯'},
                    {  name: '冻结之光的启示', value: '冻结之光的启示'},
                    {  name: '铭记者的墓地', value: '铭记者的墓地'},
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

            const search = interaction.options.getString('劍');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ALL_SWORD_SHEET);

            await interaction.editReply({ content: `單雙手劍合併為一區，${finalResponseToDiscordResult}`, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
