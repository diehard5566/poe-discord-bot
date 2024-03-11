const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_ONE_HAND_HAMMERS_SHEET } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('單手鎚')
        .setDescription('查單手鎚價格')
        .addStringOption(option => 
            option.setName('單手鎚')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '鲜血棍', value: '鲜血棍'},
                    { name: '阿雷克之骨', value: '阿雷克之骨'},
                    { name: '叛逆的意志', value: '叛逆的意志'},
            )
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('洞數')
                .setDescription('輸入洞數')
                .addChoices(
                    {'name': '1', 'value': '1'},
                    {'name': '2', 'value': '2'},
                    {'name': '3', 'value': '3'},
                    {'name': '4', 'value': '4'},
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.reply({ content: '取得資料中...', ephemeral: true });

            const search = interaction.options.getString('單手鎚');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ONE_HAND_HAMMERS_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
