const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_ALL_SWORD_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('劍')
        .setDescription('查劍價格')
        .addSubcommand(subcommand =>
            subcommand
                .setName('查詢')
                .setDescription('查詢劍價格')
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
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('更新')
                .setDescription('更新劍價格')
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

                const search = interaction.options.getString('劍');
                const socketNumber = interaction.options.getString('洞數');

                const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ALL_SWORD_SHEET);

                await interaction.editReply({ content: `單雙手劍合併為一區，${finalResponseToDiscordResult}`, ephemeral: true });
            } else if(interaction.options.getSubcommand() === '更新'){
                await interaction.reply({ content: '更新資料中...', ephemeral: true });

                const search = interaction.options.getString('劍');
                const socketNumber = interaction.options.getString('洞數');
                const newValue = interaction.options.getString('更新價格為');

                await updatesSheetData(process.env.GOOGLE_SHEET_ID, ENUM_ALL_SWORD_SHEET, search, Number(socketNumber), newValue);

                await interaction.editReply({ content: `已更新 ${search} - ${socketNumber} 洞的價格為 ${newValue}`, ephemeral: true });
            }

        } catch (error) {
            console.log(error);
        }
    }
}
