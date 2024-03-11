const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_SCEPTER_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('權杖')
        .setDescription('查權杖價格')
        .addStringOption(option => 
            option.setName('權杖')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '冰冻之怒', value: '冰冻之怒'},
                    { name: '坎尼瓦的宣言', value: '坎尼瓦的宣言'},
                    { name: '榛树跟', value: '榛树跟'},
                    { name: '纵火者的火炬', value: '纵火者的火炬'},
                    { name: '破裂循环', value: '破裂循环'},
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

            const search = interaction.options.getString('權杖');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_SCEPTER_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
