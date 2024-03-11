const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_DAGGER_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('匕首')
        .setDescription('查匕首價格')
        .addStringOption(option => 
            option.setName('匕首')
                .setDescription('輸入名字')
                .addChoices(
                { name: '烟雾编织者', value: '烟雾编织者'},
                { name: '闪电岩片', value: '闪电岩片'},
                { name: '干旱之刃', value: '干旱之刃'},
                { name: '造鬼者', value: '造鬼者'},
                { name: '耶尔克霍尔的爆破刀', value: '耶尔克霍尔的爆破刀'},
                { name: '德拉戈拉斯之爪', value: '德拉戈拉斯之爪'},
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

            const search = interaction.options.getString('匕首');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_DAGGER_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
