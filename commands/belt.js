const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_BELT_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('腰帶')
        .setDescription('查腰帶價格')
        .addStringOption(option => 
            option.setName('腰帶')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '毒蛇之尾', value: '毒蛇之尾'},
                    { name: '能量护盾踪迹', value: '能量护盾踪迹'},
                    { name: '乌列罗斯之链', value: '乌列罗斯之链'},
                    { name: '拾荒者', value: '拾荒者'},
                    { name: '丛林女王储物腰带', value: '丛林女王储物腰带'},
                    { name: '宁静森林的遗产', value: '宁静森林的遗产'},
                    { name: '灵魂之链', value: '灵魂之链'},
                    { name: '破碎锁链', value: '破碎锁链'},
                    { name: '阿祖拉尔之怒', value: '阿祖拉尔之怒'},
                    { name: '荆棘投掷者', value: '荆棘投掷者'},
                    { name: '献祭者的祭品', value: '献祭者的祭品'},
                    { name: '雷霆之兆', value: '雷霆之兆'},
                    { name: '星之预兆', value: '星之预兆'},
                    { name: '被抹除者的圣餐仪式', value: '被抹除者的圣餐仪式'},
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

            const search = interaction.options.getString('腰帶');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_BELT_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
