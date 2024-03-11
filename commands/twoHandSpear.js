const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_TWO_HAND_SPEARS_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('雙手長矛')
        .setDescription('查雙手長矛價格')
        .addStringOption(option => 
            option.setName('雙手長矛')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '刺痛', value: '刺痛'},
                    { name: '莫迪达斯之触', value: '莫迪达斯之触'},
                    { name: '鲨齿锯', value: '鲨齿锯'},
                    { name: '终末深渊的三叉戟', value: '终末深渊的三叉戟'},
                    { name: '致死剂量', value: '致死剂量'},
                    { name: '审判者', value: '审判者'},
                    { name: '图兰尼斯双叉戟', value: '图兰尼斯双叉戟'},
                    { name: '失落避难所的挽歌', value: '失落避难所的挽歌'},
                    { name: '西尔平的分形树', value: '西尔平的分形树'},
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

            const search = interaction.options.getString('雙手長矛');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_TWO_HAND_SPEARS_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
