const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_GLOVES_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('手套')
        .setDescription('查手套價格')
        .addStringOption(option => 
            option.setName('手套')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '守护者手套', value: '守护者手套'},
                    { name: '河湾掌控', value: '河湾掌控'},
                    { name: '战斗机会', value: '战斗机会'},
                    { name: '石拳', value: '石拳'},
                    { name: '翼卫', value: '翼卫'},
                    { name: '梅林之傲', value: '梅林之傲'},
                    { name: '萎缩', value: '萎缩'},
                    { name: '死亡之手', value: '死亡之手'},
                    { name: '贪婪', value: '贪婪'},
                    { name: '利拉卡之爪', value: '利拉卡之爪'},
                    { name: '渡鸦崛起', value: '渡鸦崛起'},
                    { name: '雪上加霜', value: '雪上加霜'},
                    { name: '热风沙规则', value: '热风沙规则'},
                    { name: '风暴之爪', value: '风暴之爪'},
                    { name: '贪婪虚空', value: '贪婪虚空'},
                    { name: '冻伤镣铐', value: '冻伤镣铐'},
                    { name: '献祭的拥抱', value: '献祭的拥抱'},
                    { name: '竺拉的执念', value: '竺拉的执念'},
                    { name: '燃烧的贪婪', value: '燃烧的贪婪'},
                    { name: '利亚斯的诡计', value: '利亚斯的诡计'},
                    { name: '审判之手', value: '审判之手'},
                    { name: '被抹灭的襁褓', value: '被抹灭的襁褓'},
                    { name: '血色鸟栖', value: '血色鸟栖'},
                    { name: '猎鹰击拳', value: '猎鹰击拳'},
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

            const search = interaction.options.getString('手套');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_GLOVES_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
