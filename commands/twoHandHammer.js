const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_HAMMERS_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手鎚')
        .setDescription('查雙手鎚價格')
        .addStringOption(option => 
            option.setName('雙手鎚')
                .setDescription('輸入名字')
                .addChoices(
                        { name: '罗伦特之锤', value: '罗伦特之锤'},
                        { name: '教宗的', value: '教宗的'},
                        { name: '风暴突击者', value: '风暴突击者'},
                        { name: '布尔达之怒', value: '布尔达之怒'},
                        { name: '暗影信标', value: '暗影信标'},
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

            const search = interaction.options.getString('雙手鎚');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_HAMMERS_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
