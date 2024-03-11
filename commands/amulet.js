const { SlashCommandBuilder } = require('discord.js');
const { getItemPriceResponseToDiscordByItemName } = require('../DB-test/googleSheet');
const { ENUM_AMULET_SHEET, SOCKET_NUMBER } = require('../src/LastEpoch-sheet-enum')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('護身符')
        .setDescription('查護身符價格')
        .addStringOption(option => 
            option.setName('護身符')
                .setDescription('輸入名字')
                .addChoices(
                    { name: '心神坚毅', value: '心神坚毅'},
                    { name: '流血之心', value: '流血之心'},
                    { name: '奇马拉的精粹', value: '奇马拉的精粹'},
                    { name: '狼爪', value: '狼爪'},
                    { name: '濒死呻吟', value: '濒死呻吟'},
                    { name: '狼牙', value: '狼牙'},
                    { name: '奥里昂之眼', value: '奥里昂之眼'},
                    { name: '福尔摩苏斯的冰冻之眼', value: '福尔摩苏斯的冰冻之眼'},
                    { name: '命运汇合', value: '命运汇合'},
                    { name: '赌徒谬论', value: '赌徒谬论'},
                    { name: '西塔拉难题', value: '西塔拉难题'},
                    { name: '风暴之眼', value: '风暴之眼'},
                    { name: '洛吉之饥', value: '洛吉之饥'},
                    { name: '毒蛇之乳', value: '毒蛇之乳'},
                    { name: '全能', value: '全能'},
                    { name: '奥罗拉的时间剥离', value: '奥罗拉的时间剥离'},
                    { name: '奉献', value: '奉献'},
                    { name: '灵魂赌徒谬论', value: '灵魂赌徒谬论'},
                    { name: '繁森之泪', value: '繁森之泪'},
                    { name: '变节者的圣所', value: '变节者的圣所'},
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

            const search = interaction.options.getString('護身符');
            const socketNumber = interaction.options.getString('洞數');

            const finalResponseToDiscordResult = await getItemPriceResponseToDiscordByItemName(search, socketNumber, ENUM_AMULET_SHEET);

            await interaction.editReply({ content: finalResponseToDiscordResult, ephemeral: true });

        } catch (error) {
            console.log(error);
        }
    }
}
