const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_AXE_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手斧')
        .setDescription('查雙手斧價格')
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
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: true });

            const search = interaction.options.getString('雙手斧');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_AXE_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
