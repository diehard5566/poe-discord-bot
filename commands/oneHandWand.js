const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_ONE_HAND_WAND_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('魔杖')
        .setDescription('查魔杖價格')
        .addStringOption(option => 
            option.setName('魔杖')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '灰烬之歌', value: '灰烬之歌'},
                    { name: '炼金术士的杓', value: '炼金术士的杓'},
                    { name: '坟墓之触', value: '坟墓之触'},
                    { name: '玛丽娜的迷失之魂', value: '玛丽娜的迷失之魂'},
                    { name: '算盘法杖', value: '算盘法杖'},
                    { name: '错乱折跃', value: '错乱折跃'},
                    { name: '疯狂炼金术士的勺子', value: '疯狂炼金术士的勺子'},
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

            const search = interaction.options.getString('魔杖');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_ONE_HAND_WAND_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
